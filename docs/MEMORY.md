# Memoria del proyecto

Resumen breve para retomar trabajo de Candace sin depender del historial de una conversación.

## Contexto estable

- Proyecto de gestión comercial llamado Candace.
- `frontend/` es el cliente web Vite/Alpine; usa `/api/v1`.
- `django_backend/` es el backend activo, con Django REST Framework, JWT y SQLite local.
- `mobile/` es la app React Native sobre Expo; se puede abrir con Expo Go.
- `backend/` conserva Laravel como versión anterior y no se inicia desde el flujo normal.
- La documentación oficial del proyecto se organiza en este directorio `docs/`.

## Estado funcional conocido

- La API ofrece autenticación, productos, categorías, clientes, proveedores, facturas, panel y reportes.
- Django filtra registros por empresa y expone paginación compatible con la web.
- Expo permite iniciar sesión, ver el panel y consultar productos, clientes y facturas.
- Los flujos web siguen siendo los más completos; móvil todavía es principalmente consultivo.
- El importador `import_legacy` está destinado a una base Django sin datos y no transfiere hashes de contraseñas.

## Arranque

- Pasos locales: [INSTALACION.md](./INSTALACION.md).
- Dirección de API y Wi-Fi móvil: [EXPO.md](./EXPO.md).
- Contrato de endpoints: [API.md](./API.md).
- No compartir credenciales ni datos de negocios reales en documentación o capturas.

## Convenciones para mantener esta memoria

- Actualizarla solo cuando un dato duradero del proyecto cambie.
- No guardar tokens, contraseñas, secretos, direcciones IP privadas ni datos personales.
- Distinguir claramente funciones existentes de propuestas o pendientes.
- Mantener los pasos reproducibles en la guía especializada y usar esta página solo como resumen.
