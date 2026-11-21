from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health", lambda request: JsonResponse({"status": "ok", "version": "1.0.0"})),
    path("api/v1/", include("api.urls")),
]
