# Reporte de implementación

## Alcance entregado

- Se habilitó Django como backend de ejecución y se conservaron los archivos Laravel de la versión anterior.
- Se añadió el esquema Django para empresas, usuarios, catálogo, clientes, proveedores, facturas, pagos y movimientos.
- Se preservaron rutas y formatos de respuesta que consume la web.
- Se incorporó una app Expo con autenticación segura, panel y consultas de productos, clientes y facturas.
- Se añadió una importación manual de SQLite que evita copiar contraseñas antiguas.
- Se organizaron las guías del proyecto y el libreto.

## Comprobaciones ejecutadas

- Django: comprobación del proyecto y de migraciones sin diferencias.
- Django: pruebas automatizadas de autenticación, registro, cierre de sesión, aislamiento y facturación.
- Web: `npm run build`.
- Móvil: compatibilidad Expo y `npx expo export --platform android`.
- Importador: prueba aislada con una base temporal, confirmando conservación de IDs y contraseñas no utilizables.

Los resultados son comprobaciones del entorno de desarrollo; no certifican despliegue en producción ni una importación de datos reales.

## Observaciones pendientes

- La app móvil aún no realiza operaciones de escritura.
- El teléfono necesita conectividad a la API por IP local durante la prueba Expo Go.
- La auditoría npm del entorno Expo reporta vulnerabilidades moderadas transitivas ligadas a `minimatch`; no se forzó una actualización con degradación de Expo.
- Antes de producción deben definirse base de datos, HTTPS, respaldos, secretos, CORS y hosts.

## Conclusión

La estructura permite iniciar web y API desde `ejecutar.bat` y probar la app móvil separadamente con Expo Go. La transferencia de datos de Laravel sigue siendo una operación deliberada y respaldada, no automática.
