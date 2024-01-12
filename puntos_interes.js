const fs = require('fs').promises; // Utilizando fs.promises para utilizar promesas

class ConsultaDB {
  constructor(connection) {
    this.connection = connection;
  }

  async executeQuery(archivoDB) {
    try {
      // Ejecutar la consulta SQL
      const [rows, fields] = await this.connection.execute(`SELECT SITIO, SITIO AS codigo, DIRECCION, COMUNA, LAT, LONGITUD FROM rasp_integracion WHERE SITIO =${archivoDB};`);

      // Guardar los resultados en un archivo de texto
      await fs.writeFile(archivoDB, JSON.stringify(rows, null, 2), 'utf-8');

      
    } catch (error) {
      console.error('Error en la consulta:', error);
    } finally {
      // Cerrar la conexión al finalizar
      this.connection.end();
    }
  }
}
module.exports = ConsultaDB;
// Uso de la función
const mysql = require('mysql2/promise');

/*async function main() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hola12345",
    database: "rasp_integracion"
  });

  const consultaDB = new ConsultaDB(connection);
  await consultaDB.executeQuery('resultados.txt');
}

main();
*/
