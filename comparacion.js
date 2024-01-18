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


  // Retornar el array
  return valoresUnicosArchivo1;
}async function UnionEXPI(rowsPI, valoresAB) {
  const resultado = [];

  for (let i = 0; i < rowsPI.length; i++) {
    const rowPI = rowsPI[i];
    const comuna = rowPI.COMUNA; // Asumiendo que COMUNA está en rowPI
    
    // Buscar si el valor de comuna está presente en valoresAB
    const encontrado = valoresAB.find(
      ([_, valorComuna]) => valorComuna.toLowerCase() === comuna.toLowerCase()
    );
    
    // Si se encuentra en valoresAB, agregar valorPOI a rowPI
    if (encontrado) {
      rowPI.valorPOI = encontrado[0];
    }

    // Agregar a resultado
    resultado.push(rowPI);
  }
  //console.log(resultado[0])
  return resultado;
}







module.exports = {
  encontrarValoresUnicos,
  UnionEXPI,
};
