# Transición de Laravel a Django

## Qué cambia

- Django pasa a ser el backend activo desde `ejecutar.bat`.
- El frontend web mantiene sus rutas y formato de paginación para seguir consumiendo `/api/v1`.
- Expo usa esa misma API.
- El código Laravel existente no se borra ni se altera; queda disponible en `backend/` como referencia durante la transición.
- Django usa por defecto una nueva base `django_backend/candace.sqlite3`; no modifica automáticamente `backend/database/database.sqlite`.

## Datos existentes

Las bases son distintas y no se copian al instalar. Para importar una copia SQLite de Laravel, detén ambos servidores, respalda `backend/database/database.sqlite`, prepara la base Django y ejecuta:

```powershell
django_backend\.venv\Scripts\python.exe django_backend\manage.py migrate
django_backend\.venv\Scripts\python.exe django_backend\manage.py import_legacy
```

La orden importa las tablas de empresas, usuarios, catálogos, facturas, pagos y movimientos que existan en la base de origen; puede recibir `--source "C:\ruta\copia.sqlite"`. Está diseñada para una base Django vacía y aborta si ya hay datos de negocio. Conserva los identificadores, pero no reutiliza los hashes de contraseña: los usuarios importados deben restablecerla. Revisa los conteos de salida y compara los datos antes de cambiar de entorno. Nunca apuntes Django directamente a la base Laravel.

## Reversión temporal

El código Laravel y su base original se conservan sin cambios. `ejecutar.bat` inicia Django; para volver temporalmente al backend anterior, inicia Laravel desde `backend/` y apunta el proxy de `frontend/vite.config.js` a ese servidor. Evita ejecutar ambos servicios contra la misma base o puerto a la vez.

## Lista para la puesta en producción

- Importar datos mediante una copia de seguridad y comparar conteos antes/después.
- Verificar hashes de contraseña o requerir restablecimiento.
- Probar login, aislamiento por empresa, facturación, restauración de stock y reportes.
- Configurar `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, hosts/CORS permitidos y HTTPS.
- Configurar una base de datos de producción con respaldo y política de recuperación.
