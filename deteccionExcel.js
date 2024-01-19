const ExcelJS = require("exceljs");
const fs = require("fs");

class ExcelReader {
  constructor(rutaArchivoEX, nombre) {
    this.rutaArchivo = rutaArchivoEX;
    this.valoresColumnaB = [];
    this.valoresFiltrados = [];
    this.workbook = new ExcelJS.Workbook();
    this.valoresColumnaAB = [];
    this.valorA = [];
    this.nombre = nombre
  }

  async leerArchivo() {
    try {
      await this.workbook.xlsx.readFile(this.rutaArchivo);
      const hoja = this.workbook.getWorksheet(this.nombre);

      hoja.eachRow({ includeEmpty: false }, (row) => {
        const valorColumnaB = row.getCell("B").value; // Modificación aquí
        if (valorColumnaB !== undefined) {
          if (this.valoresColumnaB.includes(valorColumnaB)) {
            // Valor repetido encontrado
          } else {
            this.valoresColumnaB.push(valorColumnaB);
          }
        }
      });
      
      return this.valoresColumnaB;
    } catch (error) {
      console.log("Error al leer el archivo:", error.message);
    }
  } async UnionDB() {
    await this.workbook.xlsx.readFile(this.rutaArchivo);
    const hoja = this.workbook.getWorksheet(this.nombre);

    let ultimoValorColumnaA = "";

    this.valoresColumnaAB = [];

    hoja.eachRow({ includeEmpty: false }, (row) => {
      const valorA = row.getCell("F").value;
      const valorColumnaB = row.getCell("B").value;

      if (valorA === undefined || valorA === null || valorA === "") {
        row.getCell("F").value = ultimoValorColumnaA;
      } else {
        let textoAntesEspacio = "";
        if (valorA.startsWith("Z08")) {
          // Si comienza con "Z08", tomar todos los caracteres hasta el último espacio
          const ultimoEspacio = valorA.lastIndexOf(' ');
          textoAntesEspacio = ultimoEspacio !== -1 ? valorA.substring(0, ultimoEspacio) : valorA;
        } else {
          // Obtener los primeros tres caracteres
          textoAntesEspacio = valorA.substring(0, 3);
        }

        row.getCell("F").value = textoAntesEspacio;
        ultimoValorColumnaA = textoAntesEspacio;
      }

      if (valorA !== undefined && valorA !== null && valorA !== "" && valorColumnaB !== undefined) {
        this.valoresColumnaAB.push([row.getCell("F").value, valorColumnaB]);
      }
    });

    return this.valoresColumnaAB;
  }
}




module.exports = ExcelReader;
