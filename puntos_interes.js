class ConsultaDB {
  constructor(connection) {
    // Constructor de la clase ConsultaDB que recibe una conexión a la base de datos.
    this.connection = connection;
  }

  async executeQuery(archivoDB) {
    try {
      // Consulta SQL para seleccionar registros distintos de una subconsulta.
      const sql = `
      SELECT DISTINCT * FROM(
        SELECT DISTINCT *
        FROM RASP_INTEGRACION_COMPARATIVA)as subconsulta;
      `;

      // Ejecuta la consulta SQL y obtén las filas y campos resultantes.
      const [rows, fields] = await this.connection.query(sql);

      // Filtra las filas basándose en los valores de SITIO en archivoDB.
      const valoresFiltrados = [];
      const sitosEncontrados = new Set();

      for (const row of rows) {
        // Verifica si el valor de SITIO está presente en archivoDB y no se ha agregado previamente.
        if (archivoDB.includes(row.SITIO) && !sitosEncontrados.has(row.SITIO)) {
          // Agrega la fila a valoresFiltrados y registra el SITIO para evitar duplicados.
          valoresFiltrados.push(row);
          sitosEncontrados.add(row.SITIO);
        }
      }

      // Devuelve las filas filtradas.
      return valoresFiltrados;
    } catch (error) {
      // Manejo de errores durante la ejecución de la consulta.
      console.error("Error en la consulta:", error);
      if (error.code === "ER_CON_COUNT_ERROR") {
        console.error(
          "Error de conexión a la base de datos. Demasiadas conexiones."
        );
      } else if (error.code === "PROBABLE_ERROR_CODE") {
        console.error(
          "Otro tipo de error específico relacionado con la conexión."
        );
      }

      // Relanza el error para que pueda ser manejado por la llamada a la función.
      throw error;
    } finally {
      // Cierra la conexión a la base de datos en la sección "finally".
      if (this.connection && typeof this.connection.end === "function") {
        this.connection.end();
      }
    }
  }
}

module.exports = ConsultaDB; // Exporta la clase ConsultaDB para su uso en otros archivos.
