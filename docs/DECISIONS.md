# Decisiones del proyecto

Registro de las decisiones que describen la arquitectura actual. Este documento refleja el estado del código; no presupone una cronología de decisiones que no esté registrada.

## D-01: Django es la API activa

- **Decisión:** usar Django y Django REST Framework como backend compartido por web y móvil.
- **Motivo:** ambas interfaces necesitan una fuente común para autenticación, inventario, ventas y reportes.
- **Consecuencia:** `ejecutar.bat` inicia Django. Laravel permanece en `backend/` como implementación anterior y apoyo de transición.

## D-02: Conservar el cliente web existente

- **Decisión:** mantener el frontend Vite/Alpine y adaptar Django a las rutas `/api/v1` y al formato de paginación que consume.
- **Motivo:** evitar rehacer pantallas que ya existen y reducir cambios innecesarios en el flujo web.
- **Consecuencia:** los cambios en el contrato de la API deben comprobarse contra sus consumidores web.

## D-03: Una app Expo nativa separada

- **Decisión:** alojar la app React Native dentro de `mobile/` y usar Expo Go en desarrollo.
- **Motivo:** permitir validar una interfaz de teléfono real sin reemplazar el panel web.
- **Consecuencia:** Expo necesita una URL accesible desde la red local; `127.0.0.1` del teléfono no es el computador.

## D-04: Aislar los datos por empresa

- **Decisión:** filtrar los recursos de negocio por la empresa asociada al usuario autenticado y verificar referencias antes de crear operaciones.
- **Motivo:** evitar que una cuenta mezcle información de distintas empresas.
- **Consecuencia:** cada endpoint nuevo debe probar el alcance de empresa tanto en lecturas como en escrituras.

## D-05: Mantener bases de datos separadas durante la transición

- **Decisión:** Django crea `django_backend/candace.sqlite3`; Laravel conserva su base original.
- **Motivo:** no alterar ni reutilizar accidentalmente un esquema de otra aplicación.
- **Consecuencia:** la importación desde una copia SQLite es explícita, se hace sobre una base Django vacía y exige restablecer las contraseñas importadas.

## D-06: Comenzar el móvil con lectura

- **Decisión:** entregar primero autenticación, panel y listas móviles; conservar en la web las operaciones completas de edición y venta.
- **Motivo:** establecer una experiencia móvil conectada con alcance controlado antes de duplicar flujos de escritura.
- **Consecuencia:** no anunciar emisión o edición de facturas desde la app móvil hasta implementarlas y probarlas.
