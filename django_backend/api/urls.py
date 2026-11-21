from django.urls import include, path
from rest_framework.routers import SimpleRouter

from . import views


router = SimpleRouter(trailing_slash=False)
router.register("companies", views.CompanyViewSet, basename="company")
router.register("products", views.ProductViewSet, basename="product")
router.register("categories", views.CategoryViewSet, basename="category")
router.register("customers", views.CustomerViewSet, basename="customer")
router.register("suppliers", views.SupplierViewSet, basename="supplier")
router.register("invoices", views.InvoiceViewSet, basename="invoice")

urlpatterns = [
    path("auth/login", views.login, name="login"),
    path("auth/register", views.register, name="register"),
    path("auth/me", views.auth_me_or_logout, name="auth-me"),
    path("auth/logout", views.auth_me_or_logout, name="auth-logout"),
    path("dashboard/stats", views.dashboard_stats, name="dashboard-stats"),
    path("reports/sales", views.sales_report, name="sales-report"),
    path("reports/inventory", views.inventory_report, name="inventory-report"),
    path("", include(router.urls)),
]
