echo "Eliminando carpeta dist..."
rm -rf api/dist/
echo "Eliminando carpeta certs..."
rm -rf api/certs/
echo "Creando carpeta dist..."
mkdir api/certs/
echo "Copiando archivos cert del servidor a carpeta cert dentro de la api..."
cp ../certs/* api/certs/
cd client/
echo "Compilando el cliente..."
npx vite build
echo "Moviendo el cliente a la carpeta dist de la api..."
mv dist/ ../api/
