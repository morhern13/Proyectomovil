# Arquitectura de Candace

## Objetivo

Candace se ejecuta en web y en móvil con una API común. Django es el backend activo, la interfaz web existente sigue en `frontend/` y la aplicación nativa está en `mobile/`, basada en Expo para probarla con Expo Go.

## Componentes

| Componente | Ruta | Tecnología | Responsabilidad |
|---|---|---|---|
| Web | `frontend/` | Vite, Alpine.js, Tailwind CSS | Panel de negocio, autenticación, inventario, ventas y reportes |
| API activa | `django_backend/` | Django, Django REST Framework, JWT | Autenticación, datos de negocio, reglas de inventario y reportes |
| App móvil | `mobile/` | React Native, Expo | Inicio de sesión, resumen y consulta de productos |
| API anterior | `backend/` | Laravel 11 | Código fuente anterior; no se inicia con el flujo principal |
| Guías | `docs/` | Markdown | Instalación, API, arquitectura, migración y libreto |

## Flujo de datos

```text
Navegador ── Vite (5173) ── proxy /api ── Django (8000) ── candace.sqlite3
Expo Go ─────────────────── HTTP/JWT ─── Django (8000) ── candace.sqlite3
```

Los clientes usan rutas `/api/v1` y tokens Bearer. Django filtra la información por la empresa del usuario autenticado. La base Django es independiente de `backend/database/database.sqlite`; el traslado de los registros anteriores se describe en [Transición desde Laravel](./MIGRACION.md).

## Estado funcional móvil

La primera versión de Expo implementa inicio de sesión, resumen de ventas/actividad y consulta de productos, clientes y facturas. La web sigue conservando los flujos de altas, edición, facturación/POS y reportes. La app móvil consume la misma API y aún no replica todas las operaciones de escritura web.
