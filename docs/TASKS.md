# Tareas de producto

Estado orientativo basado en la implementación actual. Actualizarlo al cambiar el alcance.

## Completadas

- [x] Definir la arquitectura web + Django + Expo.
- [x] Crear modelos y migraciones Django para los módulos comerciales.
- [x] Mantener rutas API compatibles con el panel web.
- [x] Incorporar autenticación JWT y revocación al cerrar sesión.
- [x] Probar aislamiento por empresa y actualización de inventario por factura.
- [x] Añadir app Expo Go con resumen y consultas móviles.
- [x] Organizar documentación, libreto y guía paso a paso.
- [x] Crear importador de una copia SQLite de Laravel con restablecimiento de contraseñas.

## Próximas

- [ ] Probar la app en dispositivos Android e iOS reales y registrar pasos reproducibles.
- [ ] Añadir operaciones móviles de escritura para el primer módulo que se priorice.
- [ ] Añadir flujo formal para restablecer contraseña de usuarios importados.
- [ ] Importar una copia real anonimizada y contrastar conteos y relaciones antes de la migración final.
- [ ] Elegir base de datos, alojamiento, HTTPS, respaldos y observabilidad para producción.
- [ ] Revisar dependencias npm transitivas y reevaluar los avisos restantes sin degradar el SDK de Expo.
- [ ] Añadir pruebas de integración que cubran también respuestas consumidas por las pantallas web.

## Criterio para cerrar una tarea

Una tarea está lista cuando el comportamiento solicitado funciona, sus pruebas y validaciones pasan, se actualizan los documentos relacionados y cualquier limitación restante queda expresada con claridad.
