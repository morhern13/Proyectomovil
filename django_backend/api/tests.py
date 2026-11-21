from datetime import date
from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from .models import Category, Company, Customer, Product, User


class ApiBehaviorTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.company = Company.objects.create(name="Candace")
        self.user = User.objects.create_user(
            email="admin@example.com", password="StrongPass123!", name="Admin",
            role="admin", company=self.company,
        )
        self.client.force_authenticate(self.user)

    def test_dashboard_scopes_counts_to_authenticated_company(self):
        Product.objects.create(company=self.company, code="P-1", name="Producto")
        other_company = Company.objects.create(name="Otra empresa")
        Product.objects.create(company=other_company, code="P-2", name="Otro")

        response = self.client.get("/api/v1/dashboard/stats")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["products_count"], 1)

    def test_invoice_creation_updates_stock_and_records_movement(self):
        product = Product.objects.create(
            company=self.company, code="P-1", name="Producto", stock=Decimal("8"),
            cost=Decimal("2.50"), price=Decimal("4.00"),
        )

        response = self.client.post("/api/v1/invoices", {
            "type": "factura",
            "date": date.today().isoformat(),
            "items": [
                {"product_id": product.id, "quantity": "2", "unit_price": "4"},
                {"product_id": product.id, "quantity": "1", "unit_price": "4"},
            ],
        }, format="json")

        self.assertEqual(response.status_code, 201, response.data)
        product.refresh_from_db()
        self.assertEqual(product.stock, Decimal("5"))
        self.assertEqual(len(response.data["items"]), 2)
        self.assertEqual(response.data["items"][0]["description"], "Producto")
        self.assertEqual(product.movements.count(), 2)

    def test_login_returns_bearer_compatible_access_token(self):
        self.client.force_authenticate(user=None)

        response = self.client.post("/api/v1/auth/login", {
            "email": "admin@example.com", "password": "StrongPass123!",
        }, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["company_id"], self.company.id)

    def test_logout_revokes_the_current_bearer_token(self):
        self.client.force_authenticate(user=None)
        login_response = self.client.post("/api/v1/auth/login", {
            "email": "admin@example.com", "password": "StrongPass123!",
        }, format="json")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['token']}")

        logout_response = self.client.post("/api/v1/auth/logout")
        dashboard_response = self.client.get("/api/v1/dashboard/stats")

        self.assertEqual(logout_response.status_code, 200)
        self.assertEqual(dashboard_response.status_code, 401)

    def test_register_creates_company_and_returns_expected_shape(self):
        self.client.force_authenticate(user=None)

        response = self.client.post("/api/v1/auth/register", {
            "name": "Nueva Admin",
            "email": "nueva@example.com",
            "password": "VeryStrongPass123!",
            "password_confirmation": "VeryStrongPass123!",
            "company_name": "Nueva Empresa",
            "rnc": "123456789",
        }, format="json")

        self.assertEqual(response.status_code, 201, response.data)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["name"], "Nueva Admin")
        self.assertEqual(response.data["company"]["tax_id"], "123456789")

    def test_product_list_does_not_expose_other_companies(self):
        Product.objects.create(company=self.company, code="P-1", name="Mi producto")
        other = Company.objects.create(name="Otra empresa")
        Product.objects.create(company=other, code="P-2", name="Producto ajeno")

        response = self.client.get("/api/v1/products")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total"], 1)
        self.assertEqual([item["name"] for item in response.data["data"]], ["Mi producto"])
        self.assertIn("category", response.data["data"][0])

    def test_category_list_preserves_the_web_data_envelope(self):
        Category.objects.create(company=self.company, name="General")

        response = self.client.get("/api/v1/categories")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"][0]["name"], "General")

    def test_product_create_accepts_web_category_id_and_returns_nested_category(self):
        category = Category.objects.create(company=self.company, name="General")

        response = self.client.post("/api/v1/products", {
            "code": "P-10",
            "name": "Producto categorizado",
            "category_id": str(category.id),
            "price": "12.50",
            "stock": "0",
        }, format="json")

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["category_id"], category.id)
        self.assertEqual(response.data["category"]["name"], "General")
