@echo off
REM Script para levantar el proyecto completo

echo.
echo ========================================
echo  Prueba Técnica Fullstack
echo ========================================
echo.

REM Verificar si existe .env
if not exist .env (
    echo [!] Archivo .env no encontrado
    echo [*] Copiar .env.example a .env y configurar DATABASE_URL
    copy .env.example .env >nul 2>&1
    if exist .env (
        echo [+] Archivo .env creado. Por favor edítalo con tu DATABASE_URL
        pause
    ) else (
        echo [-] No se encontró .env.example
        echo [*] Crea .env con:
        echo    DATABASE_URL=tu-mongodb-url
        echo    PAYLOAD_SECRET=tu-secret
        pause
        exit /b 1
    )
)

echo [*] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo [-] Error al instalar dependencias
    pause
    exit /b 1
)
echo [+] Dependencias instaladas

echo.
echo [*] Ejecutando seed de datos...
call npm run seed
if errorlevel 1 (
    echo [-] Error al ejecutar seed
    echo [!] Verifica que DATABASE_URL esté correctamente configurado en .env
    pause
    exit /b 1
)
echo [+] Datos de seed ejecutados

echo.
echo ========================================
echo [+] Todo listo! Iniciando servidor...
echo ========================================
echo.
echo URLs:
echo   Frontend: http://localhost:3000
echo   Admin:    http://localhost:3000/admin
echo.
echo Usuarios de prueba:
echo   Admin:    admin@test.com / admin1234
echo   Usuario:  usuario@test.com / usuario1234
echo.

call npm run dev
