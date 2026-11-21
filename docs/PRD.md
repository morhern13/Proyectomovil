# PRD — Candace híbrido web y móvil

## 1. Resumen

Candace ayuda a pequeños negocios a consultar y gestionar su operación mediante un panel web y una aplicación móvil conectados a una API común. Django centraliza los datos y la lógica comercial.

## 2. Usuarios

- **Administrador de empresa:** crea la cuenta y administra el negocio.
- **Personal comercial/operativo:** consulta catálogo, clientes, facturas y métricas según sus permisos.
- **Usuario móvil:** necesita acceso rápido a información clave desde teléfono.

## 3. Problema y objetivos

El panel web existente cubre flujos comerciales, pero no ofrece la misma accesibilidad en teléfono. Se busca compartir autenticación y datos entre clientes y conservar la web mientras se entrega una experiencia móvil utilizable.

### Objetivos

1. Mantener el panel web operativo con el backend actualizado.
2. Proporcionar una app que se pruebe con Expo Go.
3. Mantener coherencia de datos mediante una API central.
4. Aislar información por empresa y proteger las sesiones.
5. Documentar instalación, operación, arquitectura y presentación.

## 4. Alcance actual

### Incluido

- API Django con tokens JWT y recursos comerciales.
- Panel web integrado mediante `/api/v1`.
- Cliente Expo para resumen y consulta de productos, clientes y facturas.
- Base de datos local separada del backend Laravel previo.
- Guías y comando explícito de importación desde una copia SQLite.

### No incluido todavía

- Escritura móvil de productos, clientes, categorías o facturas.
- Sincronización fuera de línea.
- Distribución de la app en tiendas o backend de producción.
- Importación automática de contraseñas anteriores.
- Sustitución/eliminación de los archivos Laravel.

## 5. Requisitos funcionales

- **RF-01:** permitir el registro de empresa y administrador.
- **RF-02:** autenticar con correo y contraseña y proteger los endpoints privados.
- **RF-03:** filtrar recursos y relaciones por empresa.
- **RF-04:** permitir consulta y mantenimiento web de los módulos existentes.
- **RF-05:** registrar ventas de manera transaccional y actualizar inventario.
- **RF-06:** ofrecer estadísticas y reportes.
- **RF-07:** permitir iniciar sesión en móvil y consultar panel y listas.
- **RF-08:** revocar el token al cerrar sesión y guardar la sesión móvil de forma segura.
- **RF-09:** documentar una ruta de migración que proteja la base anterior.

## 6. Requisitos no funcionales

- Errores HTTP y de validación explícitos.
- Comunicación HTTPS fuera de la red local de desarrollo.
- Configuración por entorno de secretos, hosts, CORS y URL móvil.
- Pruebas sobre autenticación, aislamiento de empresa y consistencia del inventario.
- Interfaces adaptables y legibles en escritorio y teléfono.

## 7. Criterios de aceptación

1. La web y la app usan `/api/v1` del mismo backend.
2. Un usuario de una empresa no puede consultar registros de otra empresa.
3. Una factura actualiza stock y movimientos como una sola operación.
4. La app móvil abre con Expo Go en la misma red local y puede consultar sus listas.
5. Los comandos de pruebas/build y los pasos de instalación están documentados.
6. La base Laravel original no se modifica al iniciar Django.

## 8. Indicadores de entrega

- Pruebas automatizadas de API pasan.
- Build de producción web termina correctamente.
- Exportación Android de Expo termina correctamente.
- Una demostración en teléfono alcanza Django mediante la IP LAN configurada.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Datos existentes no aparecen automáticamente en Django | Respaldar y usar la importación explícita desde una copia |
| Teléfono no alcanza `localhost` del PC | Configurar IP LAN, firewall y hosts |
| Diferencias del contrato API rompen la web | Probar formas de respuesta y build del cliente web |
| Operaciones duplicadas durante una venta | Transacción y validación de referencias de la API |
| Contraseñas antiguas incompatibles | Forzar restablecimiento tras importar |
