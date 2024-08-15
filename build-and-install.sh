#!/bin/bash

# Salir si algún comando falla
set -e

# Ejecutar la compilación del proyecto
echo "Building the project..."
npm run build

# Verificar si el directorio dist existe
if [ ! -d "./dist" ]; then
  echo "Error: Build directory does not exist."
  exit 1
fi

# Copiar package.json y package-lock.json a dist
echo "Copying package.json and package-lock.json to dist..."
cp package.json dist/
cp package-lock.json dist/ || true

# Instalar dependencias en el directorio dist
echo "Installing dependencies in dist..."
cd dist
npm install --production

# Regresar al directorio raíz
cd ..

echo "Build and installation complete."
