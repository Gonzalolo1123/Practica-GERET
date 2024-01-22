# Usa la imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo
WORKDIR /app

# Instala Chromium
RUN apt-get update && apt-get install -y chromium

# Crea el directorio puppeteer dentro de /app
RUN mkdir -p /app/puppeteer

# Copia los archivos de Puntos de interés y TITAN al directorio adecuado
COPY ["Puntos de interés.xlsx", "/app/puppeteer/"]
COPY ["TITAN.xlsx", "/app/puppeteer/"]

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Instala Puppeteer
RUN npm install puppeteer

# Agrega las dependencias específicas
RUN npm install exceljs mysql2

# Copia el resto de la aplicación
COPY . .

# Exponer el puerto que utiliza tu aplicación (si es necesario)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "main.js"]
