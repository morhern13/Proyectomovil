# Candace

Aplicación de gestión para web y móvil. La nueva arquitectura usa Django como API compartida, conserva el panel web Vite/Alpine existente y añade una app React Native con Expo Go.

## Inicio rápido

1. Instala dependencias y prepara la base siguiendo [Instalación](./docs/INSTALACION.md).
2. Ejecuta `ejecutar.bat` para iniciar Django y la web.
3. Crea una cuenta desde **Registro**.
4. Para probar la app en el teléfono, configura su IP/API según [Expo Go](./docs/EXPO.md).

## Documentación

Consulta el [índice de documentación](./docs/README.md). Incluye PRD, diseño, decisiones, memoria, reporte, reglas, tareas, guías técnicas y libreto de presentación.

## Directorios del proyecto

```text
Candace/
├── backend/                  # Laravel anterior, preservado durante la transición
├── django_backend/            # API Django activa y migraciones
│   ├── api/                   # Modelos, vistas, serializers, pruebas e importador
│   ├── candace/               # Configuración y URLs del proyecto Django
│   ├── manage.py              # Comandos de Django
│   └── requirements.txt       # Dependencias Python
├── docs/                      # Documentación propia del producto
│   ├── README.md              # Índice de documentos
│   ├── PRD.md                 # Requisitos y alcance
│   ├── DESIGNS.md             # Diseño técnico y funcional
│   ├── DECISIONS.md           # Registro de decisiones
│   ├── MEMORY.md              # Contexto estable para retomar el proyecto
│   ├── REPORTE.md             # Estado y verificaciones de implementación
│   ├── RULES.md               # Reglas para cambios y mantenimiento
│   ├── TASKS.md               # Completado y trabajo pendiente
│   ├── GUION.md               # Libreto para demostración/presentación
│   ├── ARQUITECTURA.md        # Componentes y flujo de datos
│   ├── INSTALACION.md         # Requisitos y pasos de arranque
│   ├── API.md                 # Endpoints y contrato
│   ├── EXPO.md                # Configuración de Expo Go
│   └── MIGRACION.md           # Transición desde Laravel
├── frontend/                  # Aplicación web Vite/Alpine
├── mobile/                    # App React Native / Expo Go
├── tools/                     # Herramientas locales del proyecto
├── ejecutar.bat               # Migraciones y arranque de Django + web
└── README.md                  # Esta guía de entrada
```

## Guía paso a paso del directorio

1. **Empieza aquí:** lee este `README.md` para ubicar los componentes y los comandos principales.
2. **Conoce el alcance:** abre [`docs/PRD.md`](./docs/PRD.md) para ver qué resuelve Candace, qué incluye y qué está fuera del alcance actual.
3. **Entiende la estructura técnica:** revisa [`docs/DESIGNS.md`](./docs/DESIGNS.md) y [`docs/ARQUITECTURA.md`](./docs/ARQUITECTURA.md) antes de modificar integraciones.
4. **Consulta por qué se eligió el diseño:** lee [`docs/DECISIONS.md`](./docs/DECISIONS.md); distingue las decisiones vigentes de las tareas pendientes.
5. **Prepara el entorno:** sigue [`docs/INSTALACION.md`](./docs/INSTALACION.md), instala las dependencias y ejecuta `ejecutar.bat`. El directorio `django_backend/` contiene la API activa.
6. **Prueba la web:** abre `frontend/` para trabajar en las pantallas. Usa el registro para crear una empresa y consulta [`docs/API.md`](./docs/API.md) para conocer las rutas que consume.
7. **Prueba el teléfono:** abre `mobile/`, configura su URL de API y sigue [`docs/EXPO.md`](./docs/EXPO.md) para iniciar Expo Go.
8. **Revisa la transición de datos:** antes de importar o mover registros, respalda la base Laravel y sigue [`docs/MIGRACION.md`](./docs/MIGRACION.md). El contenido de `backend/` no es el backend que arranca el flujo actual.
9. **Valida y documenta cambios:** consulta [`docs/RULES.md`](./docs/RULES.md), actualiza [`docs/TASKS.md`](./docs/TASKS.md) si cambia el alcance y refleja el resultado en [`docs/REPORTE.md`](./docs/REPORTE.md).
10. **Retoma o presenta el proyecto:** [`docs/MEMORY.md`](./docs/MEMORY.md) resume el contexto estable; [`docs/GUION.md`](./docs/GUION.md) organiza una demostración paso a paso.

Para el índice navegable de todos los archivos Markdown usa [`docs/README.md`](./docs/README.md). Cada guía vive en `docs/`; el código, las dependencias y los datos permanecen en sus respectivos directorios de aplicación.

# Proyectomovil
