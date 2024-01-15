const fs = require("fs");

function leerArchivo(ruta) {
  try {
    const contenido = fs.readFileSync(ruta, "utf-8");
    const datos = contenido
      .trim()
      .split("\n")
      .filter((valor) => valor.trim() !== ""); // Filtrar valores vacíos
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
  const valoresUnicosArchivo1 = [...datosArchivo1].filter(
    (valor) => valor !== "" && !datosArchivo2.has(valor)
  );

  // Mostrar resultados
  console.log(
    "valores no presentes en officeTrack:",
    valoresUnicosArchivo1.length
  );

  // Retornar el array
  return valoresUnicosArchivo1;
}

async function UnionEXPI(rowsPI, valoresAB) {
  const resultado = [];

  for (const valorAB of valoresAB) {
    const [POI, nombre] = valorAB;

    for (const rowPI of rowsPI) {
      const { sitio, codigo, direccion, comuna, lat, longuitud } = rowPI;

      // Compara nombre y sitio
      if (sitio === nombre) {
        // Si cumple, agrega los datos al resultado en el orden especificado
        resultado.push([sitio, codigo, direccion, comuna, lat, longuitud, POI]);
      }
    }
  }
  console.log("A",resultado)
  return resultado;
}

module.exports = {
  encontrarValoresUnicos,
  UnionEXPI,
};
