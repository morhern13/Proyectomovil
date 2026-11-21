@echo off
title Candace - Iniciar
cd /d "%~dp0"

set "PYTHON=%~dp0django_backend\.venv\Scripts\python.exe"
if not exist "%PYTHON%" (
    echo No se encontro el entorno Python.
    echo Ejecuta primero los pasos de instalacion en docs\INSTALACION.md.
    pause
    exit /b 1
)

echo Aplicando migraciones pendientes de Django ...
"%PYTHON%" "%~dp0django_backend\manage.py" migrate --noinput
if errorlevel 1 (
    echo No se pudieron aplicar las migraciones. Revisa la instalacion y la base de datos.
    pause
    exit /b 1
)

echo Iniciando API Django en http://127.0.0.1:8000 ...
start "Candace API Django" "%PYTHON%" "%~dp0django_backend\manage.py" runserver 0.0.0.0:8000

echo Iniciando frontend web en http://localhost:5173 ...
start "Candace Web" /D "%~dp0frontend" cmd /k npm run dev -- --host 0.0.0.0

timeout /t 5 >nul
start "" http://localhost:5173

echo Listo. Cierra las ventanas de Django y Vite para detener el sistema.
