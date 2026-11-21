# App móvil y Expo Go

## Qué incluye

- Inicio de sesión contra la API Django.
- Token guardado en SecureStore (almacenamiento seguro del sistema operativo).
- Panel con productos, alertas de stock, clientes, ventas del mes y facturas pendientes.
- Consulta de productos, clientes y facturas.

## Conexión al backend en el teléfono

Expo Go corre en el teléfono; `127.0.0.1` allí apunta al propio teléfono, no al computador que ejecuta Django. Por eso:

1. Obtén la IP local IPv4 del computador con `ipconfig` (por ejemplo, `192.168.1.10`).
2. Copia `mobile/.env.example` a `mobile/.env` y sustituye la IP:

   ```dotenv
   EXPO_PUBLIC_API_URL=http://192.168.1.10:8000/api/v1
   ```

3. Permite conexiones privadas al puerto 8000 en el firewall de Windows cuando aparezca el aviso.
4. Asegúrate de que Django escucha en `0.0.0.0:8000` y que `DJANGO_ALLOWED_HOSTS` incluye esa IP (ver [Instalación](./INSTALACION.md)).
5. Inicia Expo (`npm --prefix mobile start`) y escanea el QR con Expo Go.

El `.env` local no debe añadirse al repositorio. La dirección HTTP es adecuada únicamente para pruebas en una red local; una app publicada debe usar HTTPS.
