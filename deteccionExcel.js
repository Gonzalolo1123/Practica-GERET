const ExcelJS = require('exceljs');
const fs = require('fs');

class ExcelReader {
  constructor(rutaArchivo) {
    this.rutaArchivo = rutaArchivo;
    this.valoresColumnaB = [];
    this.workbook = new ExcelJS.Workbook();
  }

  async leerArchivo() {
    try {
      await this.workbook.xlsx.readFile(this.rutaArchivo);
      const hoja = this.workbook.getWorksheet('Puntos de interés');
    
      hoja.eachRow({ includeEmpty: false }, (row) => {
        const valorColumnaB = row.getCell('B').value; // Modificación aquí
        if (valorColumnaB !== undefined) {
          if (this.valoresColumnaB.includes(valorColumnaB)) {
            // Valor repetido encontrado
          } else {
            this.valoresColumnaB.push(valorColumnaB);
          }
        }
      });

      //console.log('Valores de la columna B:', this.valoresColumnaB);
      console.log(`Cantidad de valores repetidos: ${hoja.rowCount - this.valoresColumnaB.length}`);
      
      // Guardar el arreglo en un archivo de texto
      fs.writeFileSync('valoresColumnaB.txt', this.valoresColumnaB.join('\n'));

      console.log('Arreglo completo guardado en valoresColumnaB.txt');
    } catch (error) {
      console.log('Error al leer el archivo:', error.message);
    }
  }
}

module.exports = ExcelReader;
