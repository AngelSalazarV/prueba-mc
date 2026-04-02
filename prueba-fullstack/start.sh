#!/bin/bash

echo ""
echo "========================================"
echo " Prueba Técnica Fullstack"
echo "========================================"
echo ""

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "[!] Archivo .env no encontrado"
    echo "[*] Copiar .env.example a .env y configurar DATABASE_URL"
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "[+] Archivo .env creado. Por favor edítalo con tu DATABASE_URL"
        exit 1
    else
        echo "[-] No se encontró .env.example"
        echo "[*] Crea .env con:"
        echo "   DATABASE_URL=tu-mongodb-url"
        echo "   PAYLOAD_SECRET=tu-secret"
        exit 1
    fi
fi

echo "[*] Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "[-] Error al instalar dependencias"
    exit 1
fi
echo "[+] Dependencias instaladas"

echo ""
echo "[*] Ejecutando seed de datos..."
npm run seed
if [ $? -ne 0 ]; then
    echo "[-] Error al ejecutar seed"
    echo "[!] Verifica que DATABASE_URL esté correctamente configurado en .env"
    exit 1
fi
echo "[+] Datos de seed ejecutados"

echo ""
echo "========================================"
echo "[+] Todo listo! Iniciando servidor..."
echo "========================================"
echo ""
echo "URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Admin:    http://localhost:3000/admin"
echo ""
echo "Usuarios de prueba:"
echo "   Admin:    admin@test.com / admin123"
echo "   Usuario:  usuario@test.com / usuario123"
echo ""

npm run dev
