# Instalación y ejecución

## Requisitos

- Windows 10/11
- Python 3.10 o posterior
- Node.js LTS y npm
- Expo Go instalado en el teléfono para probar la aplicación móvil

## Primera instalación

Desde PowerShell, en la carpeta raíz del proyecto:

```powershell
py -m venv django_backend\.venv
django_backend\.venv\Scripts\python.exe -m pip install -r django_backend\requirements.txt
django_backend\.venv\Scripts\python.exe django_backend\manage.py migrate
npm --prefix frontend install
npm --prefix mobile install
```

`ejecutar.bat` aplica migraciones pendientes y arranca Django y el sitio web. La orden `migrate` anterior es opcional; también puede ejecutarse manualmente cuando no se usa el archivo por lotes.

## Web

1. Ejecuta `ejecutar.bat`.
2. Se abrirá `http://localhost:5173`.
3. Usa **Registro** para crear la empresa y el usuario administrador inicial.

La web llama `/api/v1` mediante el proxy de Vite; durante desarrollo Django escucha en `http://127.0.0.1:8000`.

## Móvil con Expo Go

1. Configura la dirección LAN del computador como se explica en [Expo Go](./EXPO.md).
2. En la raíz ejecuta `npm --prefix mobile start`.
3. Escanea el QR con Expo Go. El teléfono y el computador deben estar en la misma red.

## Pruebas y compilación web

```powershell
django_backend\.venv\Scripts\python.exe django_backend\manage.py test
npm --prefix frontend run build
```

## Inicio manual (opcional)

En ventanas separadas:

```powershell
django_backend\.venv\Scripts\python.exe django_backend\manage.py runserver 0.0.0.0:8000
npm --prefix frontend run dev
npm --prefix mobile start
```

## Variables de entorno

- `DJANGO_SECRET_KEY`: clave secreta fuerte en producción.
- `DJANGO_DEBUG`: establece `false` en producción.
- `DJANGO_ALLOWED_HOSTS`: hosts separados por coma; incluye el dominio y, para pruebas en teléfono, la IP LAN del computador.
- `CANDACE_DB_PATH`: ruta opcional de la base SQLite de Django.
- `CORS_ALLOWED_ORIGINS`: orígenes web permitidos, separados por coma.
- `EXPO_PUBLIC_API_URL`: URL completa de la API Django para Expo, incluida `/api/v1`.

No publiques secretos ni uses el servidor de desarrollo de Django en producción.
