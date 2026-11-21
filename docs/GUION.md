# Libreto de presentación de Candace

Duración sugerida: 4–5 minutos. Sustituye los nombres o datos de ejemplo por los que uses en la demostración.

## 1. Apertura — 20 segundos

> Hola. Hoy presento Candace, una solución de gestión para consultar y organizar la operación de un negocio desde la web y desde el teléfono. Ambas interfaces usan la misma API Django.

## 2. Arquitectura — 40 segundos

> El proyecto se divide en tres piezas principales: el panel web construido con Vite y Alpine.js, una API REST con Django y una aplicación móvil con React Native y Expo. La API centraliza la autenticación, los productos, las ventas y los reportes. Laravel permanece en el proyecto como referencia de la versión anterior.

Mostrar el esquema en [Arquitectura](./ARQUITECTURA.md).

## 3. Recorrido web — 1 minuto

> En la web inicio sesión o registro la empresa. El panel resume productos, alertas de stock, clientes, ventas y facturas pendientes. Desde el menú puedo revisar el catálogo, las categorías, clientes y proveedores; también consultar facturas, punto de venta y reportes.

Acciones de demostración: abrir el panel, buscar un producto y mostrar la vista de reportes. No crear una factura en una base con datos reales.

## 4. Recorrido móvil — 1 minuto

> La app móvil está preparada para Expo Go. Inicio sesión con el mismo usuario y la app consulta el panel y el catálogo en la misma API. El token se guarda con SecureStore. En el teléfono se usa la IP local del computador para que ambos dispositivos se comuniquen por la red Wi-Fi.

Mostrar el QR de Expo Go; abrir el resumen y luego la lista de productos.

## 5. API y operación — 50 segundos

> La API usa rutas versionadas bajo `/api/v1`, tokens Bearer y aislamiento por empresa. Al crear una factura, valida sus referencias, guarda el detalle y actualiza el inventario en una sola transacción. Los reportes se calculan sobre esos mismos registros.

Mencionar las rutas en [API](./API.md) y ejecutar las pruebas automatizadas.

## 6. Cierre — 20 segundos

> En resumen, Candace conserva el panel web actual, incorpora una app móvil para consultas y utiliza Django como backend común. La guía de instalación explica cómo ejecutar el sistema y cómo preparar Expo Go.

## Apéndice: recorrido por la documentación — 45 segundos

> Para conocer el producto consultamos el PRD; para entender sus pantallas y componentes, el diseño; y para conocer las razones de la arquitectura, las decisiones. El README y las guías explican cómo ubicarse y ejecutar el proyecto. El reporte resume lo verificado; las reglas indican cómo mantenerlo y las tareas distinguen lo ya completado de lo pendiente. La memoria conserva el contexto duradero para quien retome el desarrollo.

Orden sugerido para mostrar los documentos:

1. [README principal](../README.md) y [índice de documentación](./README.md).
2. [PRD](./PRD.md), [diseño](./DESIGNS.md) y [decisiones](./DECISIONS.md).
3. [Arquitectura](./ARQUITECTURA.md), [instalación](./INSTALACION.md), [API](./API.md) y [Expo Go](./EXPO.md).
4. [Reporte](./REPORTE.md), [reglas](./RULES.md), [tareas](./TASKS.md) y [memoria](./MEMORY.md).

## Lista antes de presentar

- Completar [Instalación](./INSTALACION.md) y verificar la API.
- Crear una cuenta de demostración y cargar datos de prueba.
- Confirmar que el teléfono y el computador comparten Wi-Fi.
- Verificar `EXPO_PUBLIC_API_URL` y probar el QR con anticipación.
- No mostrar credenciales, datos personales ni información comercial real.
- Sustituir en el libreto cualquier dato o afirmación que haya cambiado desde el [reporte](./REPORTE.md).
