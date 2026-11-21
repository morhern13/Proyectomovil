# Reglas de trabajo del proyecto

## Organización

- Mantener el código Django en `django_backend/`, la web en `frontend/` y el móvil en `mobile/`.
- Guardar documentación del producto en `docs/` y enlazarla desde su índice.
- No mezclar documentación propia con README de dependencias instaladas.
- Mantener Laravel bajo `backend/` hasta completar y verificar la transición.

## API y datos

- Añadir endpoints bajo `/api/v1` y conservar compatibilidad con los consumidores existentes cuando sea posible.
- Toda consulta de datos de negocio debe limitarse a la empresa del usuario autenticado.
- Validar que referencias relacionadas pertenezcan a la misma empresa.
- Hacer las actualizaciones coordinadas de ventas, detalle e inventario en transacciones.
- No confiar en identificadores de empresa enviados por el cliente.
- Responder errores con mensajes y códigos apropiados; no ocultar fallos con valores de éxito.

## Autenticación y secretos

- Enviar credenciales solo por HTTPS fuera de pruebas locales.
- Mantener el token web en el flujo que ya usa el cliente y el token móvil en SecureStore.
- No registrar tokens, contraseñas ni información comercial sensible.
- Mantener `.env` local fuera del repositorio y usar valores seguros en producción.
- No importar hashes de contraseñas previos sin una compatibilidad verificada.

## UI y accesibilidad

- Presentar estados de carga, vacío y error.
- Mantener textos de interfaz en español y formatos de región apropiados.
- Diseñar controles táctiles y tarjetas compactas para uso móvil.
- No indicar que hay soporte móvil para operaciones que todavía no están implementadas.

## Validación de cambios

- API: ejecutar `manage.py check` y `manage.py test`.
- Web: ejecutar `npm --prefix frontend run build`.
- Móvil: ejecutar `npx expo install --check` y `npx expo export --platform android`.
- Actualizar documentación relacionada cuando cambie el arranque, las rutas o el alcance.
