# Diseño de la solución

## Diseño técnico

```text
                  ┌──────────────────────────────┐
Navegador ───────▶│ Web Vite / Alpine (5173)     │
                  └──────────────┬───────────────┘
                                 │ proxy /api
                                 ▼
                  ┌──────────────────────────────┐
                  │ API Django / DRF (8000)      │
                  │ JWT · aislamiento por empresa│
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ SQLite local de Django       │
                  └──────────────────────────────┘
                                 ▲
                                 │ HTTP + Bearer
                  ┌──────────────┴───────────────┐
                  │ React Native / Expo Go       │
                  └──────────────────────────────┘
```

Laravel y su SQLite quedan fuera de ese flujo normal. La migración entre bases está descrita en [MIGRACION.md](./MIGRACION.md).

## Diseño funcional

### Web

1. Registro de empresa e inicio de sesión.
2. Panel y navegación entre productos, categorías, clientes, proveedores, facturación/POS y reportes.
3. Las solicitudes autenticadas envían el token Bearer desde el cliente Axios.
4. Vite reenvía `/api` a Django durante el desarrollo.

### Móvil

1. Inicio de sesión en la API común.
2. Guardado del token con Expo SecureStore.
3. Pantallas consultivas: resumen, productos, clientes y facturas.
4. Cierre de sesión que elimina las credenciales locales y revoca el token actual.

## Patrones de interfaz

- Mantener una jerarquía clara: título de pantalla, navegación y contenido.
- Usar estados visibles de carga y error; no mostrar datos de ejemplo como si vinieran del servidor.
- Para errores de red o validación, comunicar el mensaje sin ocultar fallos.
- Formatear moneda y fechas usando configuración regional en español.
- La interfaz móvil organiza listas en tarjetas y presenta acciones compatibles con pantalla táctil.

## Principios de integración

- La API es la fuente de verdad para reglas, permisos, inventario y cálculos.
- La empresa del usuario se obtiene del token/usuario autenticado, no de un identificador confiado al cliente.
- Las facturas actualizan sus renglones y el stock dentro de una transacción.
- Las claves de API para móvil se configuran mediante `EXPO_PUBLIC_API_URL`; nunca se fija una IP de desarrollador para producción.
