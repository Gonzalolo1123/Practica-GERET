const fs = require('fs');
const ConsultaDB= require("./puntos_interes");

function leerArchivo(ruta) {
  try {
    const contenido = fs.readFileSync(ruta, 'utf-8');
    const datos = contenido.trim().split('\n').filter(valor => valor.trim() !== '');  // Filtrar valores vacíos
    return datos;
  } catch (error) {
    console.error(`Error al leer el archivo ${ruta}:`, error);
    return [];
  }
}

async function encontrarValoresUnicos(archivo1, archivo2) {
  const datosArchivo1 = new Set(leerArchivo(archivo1));
  const datosArchivo2 = new Set(leerArchivo(archivo2));

  // Encontrar valores únicos en el primer archivo (sitios.txt)
  const valoresUnicosArchivo1 = [...datosArchivo1].filter(valor => valor !== '' && !datosArchivo2.has(valor));

  // Guardar los valores únicos en un archivo de texto
  // fs.writeFileSync('archivo_resultado.txt', valoresUnicosArchivo1.join('\n'));

  // Mostrar resultados
  console.log('valores no presentes en officeTrack:', valoresUnicosArchivo1.length);

  // Crear una instancia de LoadScrapper

  // Llamar a la función Login con los parámetros necesarios
  // Crear una instancia de ConsultaDB
  const consultaDB = new ConsultaDB();

  // Llamar a la función executeQuery con los parámetros necesarios
  await consultaDB.executeQuery(valoresUnicosArchivo1);

}

module.exports = {
  encontrarValoresUnicos,
};