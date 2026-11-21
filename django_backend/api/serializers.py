from django.contrib.auth.password_validation import validate_password
from django.utils.text import slugify
from rest_framework import serializers

from .models import (
    Brand,
    Category,
    Company,
    Customer,
    InventoryMovement,
    Invoice,
    InvoiceItem,
    Product,
    Supplier,
    User,
)


class UserSummarySerializer(serializers.ModelSerializer):
    company_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ("id", "name", "email", "role", "company_id")


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        exclude = ("deleted_at",)
        read_only_fields = ("id", "created_at", "updated_at")


class BlankablePrimaryKeyRelatedField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        if data == "":
            return None
        return super().to_internal_value(data)


class CustomerSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ("id", "name", "code", "phone", "email")


class ProductSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "name", "code")


class CategorySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "color")


class BrandSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name")


class SupplierSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ("id", "name")


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirmation = serializers.CharField(write_only=True)
    company_name = serializers.CharField(max_length=255)
    rnc = serializers.CharField(max_length=50, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value

    def validate(self, attrs):
        confirmation = attrs.get("password_confirmation")
        if confirmation and attrs["password"] != confirmation:
            raise serializers.ValidationError({"password_confirmation": "Las contraseñas no coinciden."})
        validate_password(attrs["password"])
        return attrs


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    parent_id = BlankablePrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="parent", required=False, allow_null=True
    )

    class Meta:
        model = Category
        exclude = ("deleted_at",)
        read_only_fields = ("id", "company", "slug", "created_at", "updated_at")

    def get_children(self, obj):
        children = obj.children.filter(
            company_id=obj.company_id, deleted_at__isnull=True
        ).order_by("sort_order")
        return CategorySerializer(children, many=True, context=self.context).data

    def create(self, validated_data):
        validated_data["slug"] = slugify(validated_data["name"])
        return super().create(validated_data)


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        exclude = ("deleted_at",)
        read_only_fields = ("id", "company", "created_at", "updated_at")


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        exclude = ("deleted_at",)
        read_only_fields = ("id", "company", "created_at", "updated_at")


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        exclude = ("deleted_at",)
        read_only_fields = ("id", "company", "created_at", "updated_at")


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySummarySerializer(read_only=True)
    brand = BrandSummarySerializer(read_only=True)
    supplier = SupplierSummarySerializer(read_only=True)
    category_id = BlankablePrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", required=False, allow_null=True
    )
    brand_id = BlankablePrimaryKeyRelatedField(
        queryset=Brand.objects.all(), source="brand", required=False, allow_null=True
    )
    supplier_id = BlankablePrimaryKeyRelatedField(
        queryset=Supplier.objects.all(), source="supplier", required=False, allow_null=True
    )

    class Meta:
        model = Product
        exclude = ("deleted_at",)
        read_only_fields = ("id", "company", "created_at", "updated_at")


class InvoiceItemSerializer(serializers.ModelSerializer):
    product = ProductSummarySerializer(read_only=True)

    class Meta:
        model = InvoiceItem
        exclude = ("company", "invoice")
        read_only_fields = ("id", "description", "unit", "cost", "subtotal", "total")


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    customer = CustomerSummarySerializer(read_only=True)

    class Meta:
        model = Invoice
        exclude = ("deleted_at",)
        read_only_fields = ("id", "company", "user", "number", "seller", "subtotal", "total", "balance", "created_at", "updated_at")


class InventoryMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryMovement
        fields = "__all__"
