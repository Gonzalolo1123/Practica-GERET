class ConsultaDB {
  constructor(connection) {
    this.connection = connection;
  }

  async executeQuery(archivoDB) {
    try {
      // Crea una cadena de marcadores de posición según la longitud del arreglo
      const placeholders = Array(archivoDB.length).fill("?").join(", ");

      const [rows, fields] = await this.connection.execute(
        `SELECT SITIO, SITIO AS codigo, DIRECCION, COMUNA, LAT, LONGITUD FROM rasp_integracion WHERE SITIO IN (${placeholders});`
      );

      // Procesar los resultados según sea necesario.
      console.log("Resultados de la consulta:", rows);
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
    } finally {
      if (this.connection && typeof this.connection.end === "function") {
        this.connection.end();
      }
    }
  }
}

module.exports = ConsultaDB;
