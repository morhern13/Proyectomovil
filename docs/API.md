# API Django

Base local: `http://127.0.0.1:8000/api/v1`. Los recursos no llevan barra final para ser compatibles con el cliente web existente. Los errores usan los estados HTTP habituales de Django REST Framework.

## Autenticación

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/health` | Público |
| POST | `/auth/login` | Público; cuerpo `email`, `password` |
| POST | `/auth/register` | Público; cuerpo `name`, `email`, `password`, `password_confirmation`, `company_name` |
| GET | `/auth/me` | Bearer |
| POST | `/auth/logout` | Bearer |

Login responde `{ "token": "...", "user": { "id", "name", "email", "role", "company_id" } }`. Envíalo luego como `Authorization: Bearer <token>`. El registro devuelve el token, usuario y empresa creados.

## Recursos protegidos

| Recurso | Métodos |
|---|---|
| `/companies` | GET, PUT, PATCH |
| `/products` | GET, POST |
| `/products/{id}` | GET, PUT, PATCH, DELETE |
| `/products/{id}/kardex` | GET |
| `/categories` | GET, POST |
| `/categories/{id}` | GET, PUT, PATCH, DELETE |
| `/customers` | GET, POST |
| `/customers/{id}` | GET, PUT, PATCH, DELETE |
| `/suppliers` | GET, POST |
| `/suppliers/{id}` | GET, PUT, PATCH, DELETE |
| `/invoices` | GET, POST |
| `/invoices/{id}` | GET, DELETE |
| `/dashboard/stats` | GET |
| `/reports/sales` | GET |
| `/reports/inventory` | GET |

Las listas paginadas devuelven `current_page`, `data`, `per_page` y `total` para ser compatibles con la web existente. `per_page` acepta valores hasta 1000. Productos admite `search`, `category_id`, `brand_id` y `low_stock`; facturas admite `search`, `status`, `date_from`, `date_to`.

Al emitir una factura, la API valida que el cliente y los productos pertenezcan a la empresa del usuario; registra los renglones y movimientos y descuenta el inventario dentro de una transacción. Al anular/eliminar una factura se restaura el stock. Las facturas emitidas no se editan.
