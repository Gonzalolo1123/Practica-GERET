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

function encontrarValoresUnicos(array1, array2) {
  const datosArray1 = new Set(array1);
  const datosArray2 = new Set(array2);

  // Encontrar valores únicos en el primer array
  const valoresUnicosArray1 = [...datosArray1].filter(
    (valor) => valor !== "" && !datosArray2.has(valor)
  );

  // Retornar el array con valores únicos
  return valoresUnicosArray1;
}
async function UnionEXPI(rowsPI, valoresAB) {
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
