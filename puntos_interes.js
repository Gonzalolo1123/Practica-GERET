const fs = require('fs').promises;
const mysql = require('mysql2/promise');

class ConsultaDB {
  constructor(connection) {
    this.connection = connection;
  }

  async executeQuery(archivoDB) {
    try {
      if (!this.connection || typeof this.connection.execute !== 'function') {
        throw new Error('Conexión no válida.');
      }

      const [rows, fields] = await this.connection.execute(`SELECT SITIO, SITIO AS codigo, DIRECCION, COMUNA, LAT, LONGITUD FROM rasp_integracion WHERE SITIO =${archivoDB};`);

      await fs.writeFile(archivoDB, JSON.stringify(rows, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error en la consulta:', error);
    } finally {
      if (this.connection && typeof this.connection.end === 'function') {
        this.connection.end();
      }
    }
  }
}

module.exports= ConsultaDB;