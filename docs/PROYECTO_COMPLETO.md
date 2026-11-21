# Documento completo del proyecto Candace

## 1. Introducción

Candace es un proyecto de gestión empresarial pensado para pequeñas y medianas empresas que necesitan controlar inventario, clientes, proveedores, facturas y reportes desde una plataforma web y desde una aplicación móvil.

La idea principal es centralizar la información en una sola API y permitir que varios tipos de clientes consuman esa misma información:

- un panel web para uso operativo y administrativo,
- una app móvil para consulta rápida desde el teléfono,
- un backend común que gestiona autenticación, permisos y datos.

El proyecto está desarrollado con una arquitectura híbrida:

- Backend activo: Django + Django REST Framework
- Frontend web: Vite + Alpine.js + Tailwind CSS
- App móvil: React Native + Expo
- Base de datos: SQLite local para desarrollo
- Código Laravel previo: se conserva como referencia histórica, pero no es el backend principal activo

---

## 2. ¿Qué problema resuelve Candace?

Muchas empresas necesitan llevar el control comercial y operativo sin depender únicamente de una computadora de escritorio. El problema que aborda Candace es la falta de acceso rápido y constante a la información crítica:

- stock disponible,
- clientes y proveedores,
- ventas y facturas,
- reportes y estadísticas,
- acceso desde cualquier lugar, incluso desde un móvil.

El proyecto busca resolver esto con una solución moderna, modular y con una API compartida para evitar duplicación de lógica.

---

## 3. Objetivos del proyecto

### Objetivo general
Desarrollar una plataforma de gestión para negocio con soporte web y móvil, usando un mismo backend para mantener coherencia en los datos.

### Objetivos específicos
1. Mantener un sistema web funcional para administración y ventas.
2. Agregar una aplicación móvil para consulta rápida desde teléfono.
3. Centralizar autenticación y datos en Django.
4. Aislar la información por empresa para evitar mezcla de datos entre clientes.
5. Documentar instalación, uso y arquitectura para facilitar mantenimiento y presentación.
6. Preservar la base de datos y el código Laravel anterior como referencia temporal, sin usarlo como backend activo.

---

## 4. Usuarios del sistema

Candace está pensado para distintos perfiles de usuario:

### 4.1 Administrador de empresa
Es el usuario principal. Crea la empresa, define la configuración inicial y tiene control general del sistema.

### 4.2 Personal operativo o comercial
Puede consultar productos, clientes, facturas y reportes. Participa en la operación diaria del negocio.

### 4.3 Usuario móvil
Necesita acceder a información clave desde el teléfono, idealmente para consultar estado de productos, ventas y clientes sin estar frente a la computadora.

---

## 5. Alcance del proyecto

### Incluido actualmente
- Registro de empresa y usuario administrador
- Login con correo y contraseña
- Autenticación con JWT (JSON Web Token)
- Gestión de empresas, categorías, clientes, proveedores, productos y facturas
- Inventario y control de stock
- Reportes y dashboards de ventas
- App móvil con acceso a información básica
- API REST centralizada
- Base de datos SQLite separada del proyecto Laravel antiguo

### No incluido todavía
- Edición completa de facturas desde móvil
- Sincronización offline
- App en tiendas (Play Store / App Store)
- Migración automática de usuarios o contraseñas del sistema anterior
- Sustitución total del legado Laravel en este punto

---

## 6. Arquitectura general

El proyecto tiene cuatro piezas principales:

```text
Cliente web (Vite / Alpine) ──> API Django ──> SQLite
Cliente móvil (Expo Go) ──────> API Django ──> SQLite
                                     │
                                     └── Autenticación JWT
```

### 6.1 Backend activo
La API activa está en:

- `django_backend/`

Se basa en:

- Python
- Django
- Django REST Framework
- JWT para autenticación

### 6.2 Frontend web
La aplicación web está en:

- `frontend/`

Se usa para:

- login y registro,
- panel principal,
- manejo de productos,
- clientes,
- facturas,
- POS,
- reportes.

### 6.3 App móvil
La app móvil está en:

- `mobile/`

Está construida con:

- React Native
- Expo
- Expo Go para pruebas en Android/iPhone

Su propósito principal es consulta rápida desde el teléfono.

### 6.4 Backend legado
La carpeta:

- `backend/`

Contiene el proyecto Laravel anterior. Se conserva como referencia y respaldo, pero no es la base activa del sistema que se está ejecutando hoy.

---

## 7. Estructura de carpetas del proyecto

```text
Candace/
├── README.md
├── ejecutar.bat
├── backend/                  # Laravel legado
├── django_backend/           # API principal activa
│   ├── api/
│   ├── candace/
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 # Panel web
├── mobile/                   # App móvil Expo
├── docs/                     # Documentación del proyecto
├── tools/
└── ...
```

### 7.1 `django_backend/api/`
Aquí vive la lógica de negocio principal:

- modelos (`models.py`)
- vistas y endpoints (`views.py`)
- URLs del API (`urls.py`)
- serializadores (`serializers.py`)
- pruebas (`tests.py`)
- migraciones

### 7.2 `frontend/src/`
Aquí está la parte visual del sistema web:

- `pages/` → pantallas funcionales
- `js/` → lógica del cliente,
- `stores/` → estado de autenticación,
- `router.js` → enrutamiento,
- `api/client.js` → cliente HTTP para consumir la API

### 7.3 `mobile/`
Contiene la app para pruebas en teléfono, con acceso a la API y sesión segura.

### 7.4 `docs/`
Es la memoria técnica del proyecto. Aquí se documentan:

- PRD
- arquitectura
- requisitos
- instalación
- API
- decisiones
- guion de presentación
- migración

---

## 8. Modelo de negocio y dominio

El sistema se orienta a un negocio comercial con gestión de inventario y ventas.

### 8.1 Entidades principales

- `Company` → empresa a la que pertenece cada dato
- `User` → usuario del sistema, asociado a una empresa
- `Category` → categorías de productos
- `Brand` → marcas
- `Supplier` → proveedores
- `Customer` → clientes
- `Product` → productos del inventario
- `Invoice` → facturas emitidas
- `InvoiceItem` → detalles de cada factura
- `InventoryMovement` → movimientos de stock

### 8.2 Relación con la empresa
La clave del diseño es que todos los datos están vinculados a la empresa del usuario autenticado. Esto evita que un usuario de una compañía pueda ver datos de otra.

Esto se implementa con filtros por `company_id` en las consultas del backend.

---

## 9. Flujo completo del sistema (paso a paso)

### Paso 1: Registro del negocio
Cuando un usuario entra por primera vez a la web, debe registrarse.

El flujo es:

1. El usuario accede a la vista de registro.
2. Escribe los datos básicos: nombre, email, contraseña, nombre de la empresa.
3. El frontend envía esos datos a la API Django.
4. Django crea:
   - una empresa nueva,
   - un usuario administrador asociado a esa empresa.
5. La API responde con un token JWT y los datos del usuario.

Este proceso está definido en:

- `POST /auth/register`

---

### Paso 2: Inicio de sesión
Cuando el usuario quiere entrar:

1. Envía email y contraseña al endpoint de login.
2. Django autentica al usuario.
3. Si es válido, genera un token JWT.
4. El frontend lo guarda y lo usa en peticiones posteriores.

Endpoint:

- `POST /auth/login`

Respuesta típica:

```json
{
  "token": "...",
  "user": {
    "id": 1,
    "name": "Juan",
    "email": "juan@empresa.com",
    "role": "admin",
    "company_id": 2
  }
}
```

---

### Paso 3: Autenticación y sesión
Cada consulta protegida requiere el token en el encabezado:

```http
Authorization: Bearer <token>
```

El sistema valida la sesión del usuario y su empresa. Si el token es inválido o expirado, la API responde con error de autenticación.

Endpoints de sesión:

- `GET /auth/me`
- `POST /auth/logout`

---

### Paso 4: Consulta del dashboard
Cuando un usuario ingresa al panel, se consumen recursos como:

- `/dashboard/stats`
- `/reports/sales`
- `/reports/inventory`

Estos endpoints devuelven métricas del negocio, como:

- ventas del día,
- facturas emitidas,
- productos bajos en stock,
- inventario total,
- tasa de movimiento comercial.

Esto permite al administrador o vendedor ver el estado del negocio desde un vistazo.

---

### Paso 5: Gestión de catálogo
El sistema permite administrar productos, proveedores, categorías y marcas.

#### Productos
El usuario puede:

- crear productos,
- editar precio, costo y stock,
- buscar por nombre o código,
- filtrar por categoría o marca,
- consultar indicadores de stock bajo.

#### Categorías
Las categorías segregan productos por tipo o familia. Se gestionan por empresa para evitar solapamientos.

#### Proveedores y clientes
Cada entidad está relacionada con la empresa del usuario actual. Se filtran registros por empresa para no mezclar información.

---

### Paso 6: Venta y facturación
La parte más importante del negocio es la facturación.

Proceso de una factura:

1. El usuario selecciona un cliente.
2. Agrega productos a la factura.
3. La API valida que el cliente y los productos pertenezcan a la empresa del usuario.
4. Se calcula subtotal, descuento, impuestos y total.
5. Se registra la factura con sus detalles.
6. El sistema actualiza stock y movimientos de inventario.
7. La operación se realiza dentro de una transacción para garantizar consistencia.

Esto es crítico porque si la factura se crea y el stock no se descuenta correctamente, el sistema quedaría inconsistente.

Cuando una factura se elimina o anula, la API restaura el stock para compensar el ingreso previo.

---

### Paso 7: Kardex o historial de inventario
Cada producto puede consultar su movimiento de inventario.

Endpoint:

- `/products/{id}/kardex`

Esto devuelve el historial de entradas y salidas del producto, útil para:

- controlar inventario,
- conocer los movimientos,
- detectar errores en ventas u compras,
- presentar evidencias a auditoría.

---

### Paso 8: App móvil
La app móvil se conecta a la misma API. Su flujo es más simple que la web:

1. El usuario entra con sus credenciales.
2. La app solicita token JWT.
3. El backend valida la identidad y permite acceso.
4. La app consulta productos, clientes, facturas y dashboard.
5. La información se presenta en pantallas optimizadas para teléfono.

Esto permite que el usuario no tenga que estar siempre en la web para ver información clave.

---

## 10. Cómo funciona la API Django

La API está construida con `SimpleRouter` y `ViewSets`.

### Endpoints relevantes

#### Autenticación
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/logout`

#### Recursos empresariales
- `GET /companies`
- `GET /products`
- `POST /products`
- `GET /customers`
- `GET /suppliers`
- `GET /invoices`
- `GET /dashboard/stats`
- `GET /reports/sales`
- `GET /reports/inventory`

### Características importantes
- Los recursos devuelven respuestas paginadas con compatibilidad con la web existente.
- Los filtros permiten búsquedas por texto y por campos como categoría, marca o mínimo de stock.
- La API valida que los registros pertenecen a la empresa del usuario antes de permitir acceso o escritura.
- Los errores HTTP se gestionan con códigos claros de validación y permisos.

---

## 11. Seguridad del proyecto

Candace toma varias medidas para proteger la información.

### 11.1 Aislamiento por empresa
Cada usuario sólo puede consultar datos asociados a su `company_id`.

Esto evita que un usuario de una empresa vea información de otra empresa.

### 11.2 Autenticación por token
Django genera un JWT para cada sesión. El token se envía en la cabecera `Authorization`.

### 11.3 Revocación de sesiones
Cuando un usuario cierra sesión, el sistema registra el token como revocado para evitar reutilización.

### 11.4 Validación de referencias
Antes de guardar un producto, factura o categoría, la API comprueba que el registro relacionado pertenezca a la misma empresa.

### 11.5 Transacciones
Para facturación e inventario, se usan transacciones para asegurar que todo quede consistente o que no se guarde parcialmente.

---

## 12. Base de datos y lógica de datos

La base de datos principal del proyecto activo es SQLite local, ubicada en:

- `django_backend/candace.sqlite3`

La estructura permite representar un negocio real con:

- múltiples empresas,
- múltiples usuarios por empresa,
- clientes, proveedores, productos, categorías,
- inventario y facturas,
- movimientos de stock,
- reportes por empresa.

La lógica se define en los modelos Django, donde cada entidad incluye campos necesarios para el negocio.

---

## 13. Cómo se ejecuta el proyecto

### 13.1 Requisitos
- Python 3.10+
- Node.js LTS
- npm
- Expo Go en el teléfono
- Windows 10/11

### 13.2 Instalación
El proceso recomendado se describe en `docs/INSTALACION.md` y consiste en:

```powershell
py -m venv django_backend\.venv
django_backend\.venv\Scripts\python.exe -m pip install -r django_backend\requirements.txt
django_backend\.venv\Scripts\python.exe django_backend\manage.py migrate
npm --prefix frontend install
npm --prefix mobile install
```

### 13.3 Inicio rápido
En la raíz del proyecto, se puede ejecutar:

```bat
ejecutar.bat
```

Esto hace lo siguiente:

- aplica migraciones pendientes,
- levanta Django en `http://127.0.0.1:8000`,
- levanta la web en `http://localhost:5173`.

### 13.4 Ejecutar manualmente
También se puede hacer manualmente en terminales separadas:

```powershell
django_backend\.venv\Scripts\python.exe django_backend\manage.py runserver 0.0.0.0:8000
npm --prefix frontend run dev
npm --prefix mobile start
```

---

## 14. Flujo de trabajo para una demo en clase

Si el profesor quiere ver el proyecto funcionando, el flujo ideal es:

1. Ejecutar `ejecutar.bat`.
2. Abrir la web en `localhost:5173`.
3. Crear una empresa y usuario administrador.
4. Ir a productos y registrar algunos productos.
5. Registrar clientes y proveedores.
6. Crear una factura con varios artículos.
7. Verificar que el stock baja automáticamente.
8. Revisar el dashboard y reportes.
9. Abrir la app móvil con Expo Go.
10. Iniciar sesión y consultar el resumen o productos.

Este recorrido demuestra claramente que el proyecto integra negocio, API, base de datos y clientes web/móvil.

---

## 15. Pruebas y validación

El proyecto incluye pruebas de Django, y la documentación recomienda ejecutar:

```powershell
django_backend\.venv\Scripts\python.exe django_backend\manage.py test
npm --prefix frontend run build
```

Estas pruebas permiten verificar:

- autenticación,
- aislamiento de empresa,
- comportamiento de inventario,
- estabilidad de rutas y lógica de negocio.

---

## 16. Limitaciones actuales

El proyecto ya tiene una base funcional, pero aún presenta ciertas limitaciones:

- la app móvil aún no cubre todas las operaciones de escritura,
- no hay sincronización offline,
- la migración de datos del Laravel previo requiere proceso controlado,
- el despliegue en producción no está preparado todavía,
- la aplicación móvil requiere configuración de red local para usar la API.

Estas limitaciones no restan valor al proyecto, sino que marcan la siguiente etapa de evolución.

---

## 17. Valor académico y técnico del proyecto

Candace tiene una buena base como proyecto académico porque integra varios conocimientos:

- backend con Django,
- APIs REST,
- autenticación JWT,
- bases de datos relacionales,
- arquitectura multi-cliente,
- desarrollo web con Vite,
- desarrollo móvil con Expo,
- gestión de inventario y ventas,
- control de permisos por empresa,
- documentación técnica y de presentación.

Es un proyecto completo, realista y útil, porque resuelve un problema de negocio que puede existir en una pequeña empresa.

---

## 18. Conclusión

Candace es más que una app de ejemplo: es una solución de gestión empresarial con arquitectura moderna, enfoque práctico y una clara separación entre frontend, backend y datos.

Su fortaleza está en que usa un backend centralizado para web y móvil, asegurando que los datos sean consistentes, seguros y accesibles desde distintos dispositivos.

El proyecto demuestra que se puede combinar:

- lógica de negocio,
- servicios de API,
- experiencia de usuario web,
- experiencia mobile,
- seguridad y organización de datos,
- documentación profesional.

En resumen, Candace es un proyecto sólido, bien estructurado y con un gran potencial para seguir creciendo.

---

## 19. Resumen corto para explicar al profesor

"Candace es un sistema de gestión para empresas que combina un panel web y una app móvil. La API principal está en Django, donde se gestionan usuarios, clientes, inventario, facturación y reportes. La parte web está desarrollada con Vite y Alpine, mientras que la app móvil está construida con React Native y Expo. La innovación del proyecto es que web y móvil consumen la misma API, lo que garantiza consistencia de datos, seguridad por empresa y acceso a la información desde distintos dispositivos. El proyecto sirve para gestionar operaciones comerciales con un enfoque realista y escalable."

---

## 20. Archivos documentados relacionados

- [README principal](../README.md)
- [Índice de documentación](README.md)
- [PRD](PRD.md)
- [Arquitectura](ARQUITECTURA.md)
- [Instalación](INSTALACION.md)
- [API](API.md)
- [Guion de presentación](GUION.md)

Este documento sirve como resumen completo para entregar al profesor y como referencia del proyecto desde una visión general hasta su funcionamiento técnico.
