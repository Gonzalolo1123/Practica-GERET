const ExcelJS = require("exceljs");
const fs = require("fs");

class ExcelReader {
  constructor(rutaArchivoEX,nombre) {
    this.rutaArchivo = rutaArchivoEX;
    this.valoresColumnaB = [];
    this.valoresFiltrados = [];
    this.workbook = new ExcelJS.Workbook();
    this.valoresColumnaAB = [];
    this.valorA = [];
    this.nombre=nombre
  }

  async leerArchivo(archivoEX) {
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

      for (var i = 0; i < this.valoresColumnaB.length; i++) {
        var elemento = this.valoresColumnaB[i];

        // Expresión regular para dos o tres letras seguidas de tres números
        var regex = /^[a-zA-Z]{2,3}\d{3}$/;

        // Verificar si el elemento del arreglo cumple con la expresión regular
        if (regex.test(elemento)) {
          this.valoresFiltrados.push(elemento);
        } else {
          //no paso
        }
      }

      // Guardar el arreglo en un archivo de texto
      fs.writeFileSync(archivoEX, this.valoresColumnaB.join("\n"));

    } catch (error) {
      console.log("Error al leer el archivo:", error.message);
    }
  }
  async UnionDB() {
    await this.workbook.xlsx.readFile(this.rutaArchivo);
    const hoja = this.workbook.getWorksheet(this.nombre);
  
    let ultimoValorColumnaA = "";
  
    hoja.eachRow({ includeEmpty: false }, (row) => {
      const valorA = row.getCell("G").value;
  
      if (valorA === undefined || valorA === null || valorA === "") {
        row.getCell("F").value = ultimoValorColumnaA;
        this.valorA.push(ultimoValorColumnaA.slice(0, 3));
      } else {
        ultimoValorColumnaA = valorA;
        this.valorA.push(ultimoValorColumnaA.slice(0, 3));
      }
    });
  
    for (let i = 0; i < this.valorA.length; i++) {
      const parAB = [this.valorA[i], this.valoresColumnaB[i]];
      this.valoresColumnaAB.push(parAB);
    } 
    //console.log("a",this.valoresColumnaAB) 
    return this.valoresColumnaAB;
  }
}

module.exports = ExcelReader;
