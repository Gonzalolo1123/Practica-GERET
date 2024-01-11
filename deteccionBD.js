const fs = require('fs');

class DatabaseReader {
  constructor(connection) {
    this.connection = connection;
  }

  async executeQuery(archivoDB) {
    try {
      const [rows, fields] = await this.connection.execute('SELECT DISTINCT SITIO FROM rasp_integracion;');

      // Extraer los valores de SITIO y guardarlos en un arreglo
      const sitios = rows.map(row => row.SITIO);

      //console.log('Sitios:', sitios);

      // Guardar los sitios en un archivo de texto
      fs.writeFileSync(archivo, sitios.join('\n'));

      console.log(`Sitios guardados en ${archivoDB}`);
    } catch (error) {
      console.error('Error en la consulta:', error);
    } finally {
      // Cerrar la conexión al finalizar
      this.connection.end();
    }
  }
}

module.exports = DatabaseReader;
