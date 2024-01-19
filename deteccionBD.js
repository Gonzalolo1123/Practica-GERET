class DatabaseReader {
  constructor(connection) {
    this.connection = connection;
  }

  async executeQuery() {
    try {
      const sql = `
      SELECT DISTINCT SITIO FROM(
        SELECT DISTINCT SITIO
        FROM RASP_INTEGRACION_COMPARATIVA)as subconsulta;
      `;

      const [rows] = await this.connection.query(sql);

      // Extraer los valores de SITIO y guardarlos en un arreglo
      const sitios = rows.map((row) => row.SITIO);

      return sitios;
    } catch (error) {
      console.error("Error en la consulta:", error);
      throw error; // Lanza nuevamente el error para que pueda ser manejado por el código que llama a esta función
    }
  }
}

module.exports = DatabaseReader;
