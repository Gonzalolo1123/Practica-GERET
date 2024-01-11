
const fs = require('fs');

function leerArchivo(ruta,) {
  try {
    const contenido = fs.readFileSync(ruta, 'utf-8');
    const datos = contenido.trim().split('\n').filter(valor => valor.trim() !== '');  // Filtrar valores vacíos
    //console.log(`Datos leídos de ${ruta}:`, datos);
    return datos;
  } catch (error) {
    console.error(`Error al leer el archivo ${ruta}:`, error);
    return [];
  }
}

function encontrarValoresUnicos(archivo1, archivo2) {
  const datosArchivo1 = new Set(leerArchivo(archivo1));
  const datosArchivo2 = new Set(leerArchivo(archivo2));

  // Encontrar valores únicos en el primer archivo (sitios.txt)
  const valoresUnicosArchivo1 = [...datosArchivo1].filter(valor => valor !== '' && !datosArchivo2.has(valor));
  console.log("Valores que no se encuentran en OfficeTrack:", valoresUnicosArchivo1);
  console.log("Tamaño del arreglo: ", valoresUnicosArchivo1.length)
}
/*
// Ejemplo de uso
const archivo1 = 'sitios.txt';
const archivo2 = 'valoresColumnaB.txt';
encontrarValoresUnicos(archivo1, archivo2);*/

module.exports = {
  encontrarValoresUnicos,
};