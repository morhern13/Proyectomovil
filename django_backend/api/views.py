from datetime import date
from datetime import datetime, timezone as datetime_timezone
from decimal import Decimal, DecimalException

from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Count, F, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Brand,
    Category,
    Company,
    Customer,
    InventoryMovement,
    Invoice,
    InvoiceItem,
    Product,
    RevokedToken,
    Supplier,
    User,
)
from .serializers import (
    BrandSerializer,
    CategorySerializer,
    CompanySerializer,
    CustomerSerializer,
    InvoiceSerializer,
    ProductSerializer,
    RegisterSerializer,
    SupplierSerializer,
    UserSummarySerializer,
)


def tenant_queryset(model, user):
    return model.objects.filter(company_id=user.company_id, deleted_at__isnull=True)


def ensure_company_reference(queryset, value, field):
    if value in (None, ""):
        return None
    try:
        belongs_to_company = queryset.filter(pk=value).exists()
    except (TypeError, ValueError):
        belongs_to_company = False
    if not belongs_to_company:
        return Response({"message": f"{field} no pertenece a esta empresa."}, status=400)
    return None


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email", "")
    password = request.data.get("password", "")
    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({"email": ["Credenciales incorrectas."]}, status=status.HTTP_400_BAD_REQUEST)
    if not user.is_active:
        return Response({"message": "Usuario inactivo."}, status=status.HTTP_403_FORBIDDEN)
    token = str(RefreshToken.for_user(user).access_token)
    return Response({"token": token, "user": UserSummarySerializer(user).data})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    values = serializer.validated_data
    with transaction.atomic():
        company = Company.objects.create(
            name=values["company_name"],
            tax_id=values.get("rnc") or None,
            phone=values.get("phone") or None,
            address=values.get("address") or None,
            is_active=True,
        )
        user = User.objects.create_user(
            email=values["email"],
            password=values["password"],
            name=values["name"],
            role="admin",
            company=company,
            is_active=True,
        )
    return Response({
        "token": str(RefreshToken.for_user(user).access_token),
        "user": UserSummarySerializer(user).data,
        "company": CompanySerializer(company).data,
    }, status=status.HTTP_201_CREATED)


@api_view(["GET", "POST"])
def auth_me_or_logout(request):
    if request.method == "POST":
        token = request.auth
        RevokedToken.objects.filter(expires_at__lte=timezone.now()).delete()
        RevokedToken.objects.get_or_create(
            jti=token["jti"],
            defaults={
                "expires_at": datetime.fromtimestamp(token["exp"], tz=datetime_timezone.utc),
            },
        )
        return Response({"message": "Sesión cerrada."})
    user_data = UserSummarySerializer(request.user).data
    user_data["company"] = CompanySerializer(request.user.company).data if request.user.company_id else None
    return Response({"user": user_data})


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    pagination_class = None
    http_method_names = ["get", "put", "patch", "head", "options"]

    def get_queryset(self):
        return Company.objects.filter(
            pk=self.request.user.company_id, is_active=True, deleted_at__isnull=True
        )

    def update(self, request, *args, **kwargs):
        if str(self.get_object().id) != str(request.user.company_id):
            return Response({"message": "No autorizado."}, status=403)
        return super().update(request, *args, **kwargs)


class TenantModelViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return tenant_queryset(self.queryset.model, self.request.user)

    def perform_create(self, serializer):
        serializer.save(company_id=self.request.user.company_id)

    def check_references(self, request, related):
        for field, queryset in related:
            error = ensure_company_reference(queryset, request.data.get(field), field)
            if error:
                return error
        return None


class ProductViewSet(TenantModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related("category", "brand", "supplier")
        search = self.request.query_params.get("search")
        if search:
            from django.db.models import Q
            queryset = queryset.filter(Q(name__icontains=search) | Q(code__icontains=search) | Q(barcode__icontains=search))
        category_id = self.request.query_params.get("category_id")
        brand_id = self.request.query_params.get("brand_id")
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if brand_id:
            queryset = queryset.filter(brand_id=brand_id)
        if self.request.query_params.get("low_stock") in ("1", "true", "yes"):
            queryset = queryset.filter(stock__lte=F("stock_min"), track_stock=True)
        return queryset.order_by("name")

    def create(self, request, *args, **kwargs):
        error = self.check_references(request, [
            ("category_id", tenant_queryset(Category, request.user)),
            ("brand_id", tenant_queryset(Brand, request.user)),
            ("supplier_id", tenant_queryset(Supplier, request.user)),
        ])
        if error:
            return error
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        if product.company_id != request.user.company_id:
            return Response({"message": "No autorizado."}, status=403)
        error = self.check_references(request, [
            ("category_id", tenant_queryset(Category, request.user)),
            ("brand_id", tenant_queryset(Brand, request.user)),
            ("supplier_id", tenant_queryset(Supplier, request.user)),
        ])
        if error:
            return error
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        if product.stock > 0:
            return Response({"message": "No se puede eliminar un producto con stock."}, status=422)
        product.deleted_at = timezone.now()
        product.save(update_fields=["deleted_at"])
        return Response({"message": "Producto eliminado."})

    @action(detail=True, methods=["get"])
    def kardex(self, request, pk=None):
        product = self.get_object()
        movements = InventoryMovement.objects.filter(
            company_id=request.user.company_id, product=product
        ).order_by("-created_at")
        page = self.paginate_queryset(movements)
        from .serializers import InventoryMovementSerializer
        result = InventoryMovementSerializer(page if page is not None else movements, many=True).data
        return Response({
            "product": {"id": product.id, "name": product.name, "code": product.code, "stock": product.stock},
            "movements": self.get_paginated_response(result).data if page is not None else result,
        })


class CategoryViewSet(TenantModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = super().get_queryset().filter(parent__isnull=True).order_by("sort_order")
        return queryset

    def perform_create(self, serializer):
        parent_id = self.request.data.get("parent_id")
        if parent_id and not tenant_queryset(Category, self.request.user).filter(pk=parent_id).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"parent_id": "La categoría padre no pertenece a esta empresa."})
        serializer.save(company_id=self.request.user.company_id)

    def update(self, request, *args, **kwargs):
        category = self.get_object()
        if category.company_id != request.user.company_id:
            return Response({"message": "No autorizado."}, status=403)
        parent_id = request.data.get("parent_id")
        if parent_id and not tenant_queryset(Category, request.user).filter(pk=parent_id).exists():
            return Response({"parent_id": "La categoría padre no pertenece a esta empresa."}, status=400)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()
        if Product.objects.filter(category=category, deleted_at__isnull=True).exists():
            return Response({"message": "Categoría tiene productos asociados."}, status=422)
        category.deleted_at = timezone.now()
        category.save(update_fields=["deleted_at"])
        return Response({"message": "Categoría eliminada."})


class CustomerViewSet(TenantModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            from django.db.models import Q
            queryset = queryset.filter(Q(name__icontains=search) | Q(code__icontains=search) | Q(tax_id__icontains=search))
        return queryset.order_by("name")

    def update(self, request, *args, **kwargs):
        customer = self.get_object()
        if customer.company_id != request.user.company_id:
            return Response({"message": "No autorizado."}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        customer = self.get_object()
        customer.deleted_at = timezone.now()
        customer.save(update_fields=["deleted_at"])
        return Response({"message": "Cliente eliminado."})


class SupplierViewSet(TenantModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            from django.db.models import Q
            queryset = queryset.filter(Q(name__icontains=search) | Q(code__icontains=search))
        return queryset.order_by("name")

    def update(self, request, *args, **kwargs):
        supplier = self.get_object()
        if supplier.company_id != request.user.company_id:
            return Response({"message": "No autorizado."}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        supplier = self.get_object()
        supplier.deleted_at = timezone.now()
        supplier.save(update_fields=["deleted_at"])
        return Response({"message": "Proveedor eliminado."})


class InvoiceViewSet(TenantModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related("customer").prefetch_related("items")
        search = self.request.query_params.get("search")
        if search:
            from django.db.models import Q
            queryset = queryset.filter(Q(number__icontains=search) | Q(customer__name__icontains=search))
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        date_from = parse_date(self.request.query_params.get("date_from", ""))
        date_to = parse_date(self.request.query_params.get("date_to", ""))
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        return queryset.order_by("-date", "-id")

    def create(self, request, *args, **kwargs):
        values = request.data
        items = values.get("items")
        if values.get("type") not in {"factura", "recibo", "ticket", "devolucion"}:
            return Response({"type": "Tipo de comprobante no válido."}, status=400)
        if not isinstance(items, list) or not items:
            return Response({"items": "Debe incluir al menos un producto."}, status=400)
        customer_id = values.get("customer_id")
        if customer_id:
            try:
                customer_exists = tenant_queryset(Customer, request.user).filter(pk=customer_id).exists()
            except (TypeError, ValueError):
                customer_exists = False
            if not customer_exists:
                return Response({"customer_id": "El cliente no pertenece a esta empresa."}, status=400)
        if not all(isinstance(item, dict) for item in items):
            return Response({"items": "Cada artículo debe ser un objeto válido."}, status=400)
        invoice_date = parse_date(str(values.get("date") or date.today()))
        if invoice_date is None:
            return Response({"date": "La fecha no es válida."}, status=400)

        with transaction.atomic():
            product_lines = []
            products_by_id = {}
            for item in items:
                product_id = item.get("product_id")
                product_key = str(product_id)
                product = products_by_id.get(product_key)
                if product is None:
                    try:
                        product = tenant_queryset(Product, request.user).filter(pk=product_id).first()
                    except (TypeError, ValueError):
                        product = None
                if product is None:
                    return Response({"product_id": "Producto no encontrado para esta empresa."}, status=400)
                try:
                    quantity = Decimal(str(item.get("quantity", "0")))
                    unit_price = Decimal(str(item.get("unit_price", "-1")))
                    if not quantity.is_finite() or not unit_price.is_finite():
                        raise ValueError
                except (TypeError, ValueError, DecimalException):
                    return Response({"items": "Cantidad o precio no válidos."}, status=400)
                if quantity <= 0 or unit_price < 0:
                    return Response({"items": "La cantidad debe ser positiva y el precio no negativo."}, status=400)
                products_by_id[product_key] = product
                product_lines.append((product, quantity, unit_price))

            next_number = Invoice.objects.filter(company_id=request.user.company_id).count() + 1
            number = str(next_number).zfill(8)
            subtotal = sum((quantity * price for _, quantity, price in product_lines), Decimal("0"))
            invoice = Invoice.objects.create(
                company_id=request.user.company_id,
                customer_id=customer_id,
                user=request.user,
                type=values["type"],
                number=number,
                status="pendiente",
                date=invoice_date,
                payment_method=values.get("payment_method"),
                seller=request.user.name,
                subtotal=subtotal,
                total=subtotal,
                balance=subtotal,
                notes=values.get("notes"),
            )
            for product, quantity, unit_price in product_lines:
                line_total = quantity * unit_price
                InvoiceItem.objects.create(
                    company_id=request.user.company_id,
                    invoice=invoice,
                    product=product,
                    description=product.name,
                    unit=product.unit,
                    quantity=quantity,
                    unit_price=unit_price,
                    cost=product.cost,
                    subtotal=line_total,
                    total=line_total,
                )
                if product.track_stock:
                    before = product.stock
                    product.stock -= quantity
                    product.save(update_fields=["stock", "updated_at"])
                    InventoryMovement.objects.create(
                        company_id=request.user.company_id,
                        product=product,
                        user=request.user,
                        type="salida",
                        reference_type="invoice",
                        reference_id=invoice.id,
                        reference_number=number,
                        quantity=-quantity,
                        stock_before=before,
                        stock_after=product.stock,
                        unit_cost=product.cost,
                    )

        return Response(self.get_serializer(invoice).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        invoice = self.get_object()
        if invoice.company_id != request.user.company_id:
            return Response({"message": "No autorizado."}, status=403)
        return Response({"message": "Las facturas emitidas no se editan."}, status=405)

    def destroy(self, request, *args, **kwargs):
        invoice = self.get_object()
        with transaction.atomic():
            for item in invoice.items.select_related("product"):
                product = item.product
                if product and product.track_stock:
                    product.stock += item.quantity
                    product.save(update_fields=["stock", "updated_at"])
            invoice.deleted_at = timezone.now()
            invoice.save(update_fields=["deleted_at"])
        return Response({"message": "Factura eliminada y stock restaurado."})


@api_view(["GET"])
def dashboard_stats(request):
    company_id = request.user.company_id
    today = timezone.localdate()
    invoices = Invoice.objects.filter(company_id=company_id, deleted_at__isnull=True)
    return Response({
        "products_count": tenant_queryset(Product, request.user).count(),
        "low_stock_count": tenant_queryset(Product, request.user).filter(
            track_stock=True, stock__lte=F("stock_min")
        ).count(),
        "customers_count": tenant_queryset(Customer, request.user).count(),
        "month_sales": invoices.exclude(status="anulada").filter(
            date__year=today.year, date__month=today.month
        ).aggregate(total=Sum("total"))["total"] or Decimal("0"),
        "pending_invoices": invoices.filter(status="pendiente").count(),
    })


@api_view(["GET"])
def sales_report(request):
    company_id = request.user.company_id
    today = timezone.localdate()
    start = parse_date(request.query_params.get("from", "")) or today.replace(day=1)
    end = parse_date(request.query_params.get("to", "")) or today
    invoices = Invoice.objects.filter(
        company_id=company_id, deleted_at__isnull=True, date__range=(start, end)
    ).exclude(status="anulada")
    totals = invoices.aggregate(
        total_invoices=Count("id"), total_revenue=Sum("total"),
        total_tax=Sum("tax"), total_subtotal=Sum("subtotal"),
    )
    for key in ("total_revenue", "total_tax", "total_subtotal"):
        totals[key] = totals[key] or Decimal("0")
    by_payment = list(invoices.values("payment_method").annotate(
        count=Count("id"), total=Sum("total")
    ).order_by("payment_method"))
    top_products = list(InvoiceItem.objects.filter(
        invoice__in=invoices
    ).values("product_id", "product__name", "product__code").annotate(
        total_qty=Sum("quantity"), total=Sum("subtotal")
    ).order_by("-total_qty")[:10])
    for row in top_products:
        row["product"] = (
            {"id": row["product_id"], "name": row["product__name"], "code": row["product__code"]}
            if row["product_id"] else None
        )
        del row["product__name"]
        del row["product__code"]
    by_period = list(invoices.annotate(period=TruncDate("date")).values("period").annotate(
        count=Count("id"), total=Sum("total")
    ).order_by("period"))
    for row in by_period:
        row["period"] = row["period"].isoformat()
    return Response({
        "from": start.isoformat(), "to": end.isoformat(), "totals": totals,
        "by_payment": by_payment, "top_products": top_products, "sales_by_period": by_period,
    })


@api_view(["GET"])
def inventory_report(request):
    products = tenant_queryset(Product, request.user).select_related("category").order_by("name")
    summary = products.aggregate(
        total_products=Count("id"), total_stock_items=Sum("stock"),
        total_inventory_value=Sum(F("stock") * F("cost")),
        total_sale_value=Sum(F("stock") * F("price")),
    )
    for field in ("total_stock_items", "total_inventory_value", "total_sale_value"):
        summary[field] = summary[field] or Decimal("0")
    low_stock = products.filter(track_stock=True, stock__lte=F("stock_min"))
    summary["low_stock_count"] = low_stock.count()
    by_category = list(products.values("category__name").annotate(
        count=Count("id"), stock=Sum("stock"), value=Sum(F("stock") * F("cost"))
    ).order_by("category__name"))
    for row in by_category:
        row["category"] = row.pop("category__name") or "Sin categoría"
    return Response({
        "summary": summary,
        "low_stock": ProductSerializer(low_stock, many=True).data,
        "by_category": by_category,
    })
