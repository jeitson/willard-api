#!/bin/sh

# Verifica si la carpeta dist no existe
if [ ! -d "dist" ]; then
  echo "No se encontró la carpeta 'dist'. Ejecutando la construcción..."
  npm run build
fi

# Ejecuta la aplicación
echo "Iniciando la aplicación..."
node dist/main
