class ConsultaDB {
  constructor(connection) {
    this.connection = connection;
  }

  async executeQuery(archivoDB) {
    try {
      const sql = `
        SELECT DISTINCT *
        FROM RASP_INTEGRACION_COMPARATIVA
      `;

      const [rows, fields] = await this.connection.query(sql);

      // Filtrar las filas basándose en los valores de SITIO en archivoDB
      const valoresFiltrados = [];
      const sitosEncontrados = new Set();

      for (const row of rows) {
        if (archivoDB.includes(row.SITIO) && !sitosEncontrados.has(row.SITIO)) {
          valoresFiltrados.push(row);
          sitosEncontrados.add(row.SITIO);
        }
      }

      return valoresFiltrados;
    } catch (error) {
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

      throw error; // Re-lanza el error para que pueda ser manejado por la llamada a la función.
    } finally {
      if (this.connection && typeof this.connection.end === "function") {
        this.connection.end();
      }
    }
  }
}

module.exports = ConsultaDB;
