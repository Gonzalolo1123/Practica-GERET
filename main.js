const readline = require("readline");
const PuppeteerScraper = require("./officeTrackDownload");
const DatabaseReader = require("./deteccionBD");
const ExcelReader = require("./deteccionExcel");
const connectDatabase = require("./conexionMySQL");
const comparacion = require("./comparacion");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para preguntar al usuario
function preguntarUsuario() {
  rl.question(
    "¿Quiere descargar un archivo mas actualizado del excel? (s/n): ",
    async (respuesta) => {
      if (respuesta.toLowerCase() === "s") {
        await ejecutarScraper();
      } else if (respuesta.toLowerCase() !== "n") {
        console.log('Respuesta no válida. Por favor, ingrese "s" o "n".');
        preguntarUsuario(); // Vuelve a preguntar en caso de respuesta no válida
      } else {
        console.log(
          "Se ejecutara el codigo el ultimo archivo descargado sin actualizarlo."
        );
        ejecutarSinScraper();
        rl.close();
      }
    }
  );
}

// Función para ejecutar el scraper
async function ejecutarScraper() {
    const scraper = new PuppeteerScraper();
    await scraper.officeDownload();
  
    const dbReader = new DatabaseReader(archivoDB);
    try {
      await dbReader.connect();
      await dbReader.executeQuery();
    } catch (error) {
      console.error("Error en la ejecución de la base de datos:", error);
    }
  
    const excelReader = new ExcelReader(
      "C:\\Users\\gonza\\Desktop\\puppeteer\\Puntos de interés.xlsx"
    );
    await excelReader.leerArchivo();
  
    console.log("Comenzó la comparación de datos.");
    // Llama a la función encontrarValoresUnicos aquí si es necesario
    // encontrarValoresUnicos();
    await comparacion.encontrarValoresUnicos("sitios.txt","valoresColumnaB.txt");
  
    rl.close();
  }
  
  // Función para ejecutar sin scraper
  async function ejecutarSinScraper() {
    let connection;
    try {
      connection = await connectDatabase(host,user,password,database);
      const dbReader = new DatabaseReader(connection);
      
      await dbReader.executeQuery();
    } catch (error) {
      console.error("Error en la ejecución de la base de datos:", error);
    } finally {
      if (connection) {
        connection.end();
      }
    }
  
    const excelReader = new ExcelReader(
      "C:\\Users\\gonza\\Desktop\\puppeteer\\Puntos de interés.xlsx"
    );
    await excelReader.leerArchivo();
  
    console.log("Comenzó la comparación de datos.");
    // Llama a la función encontrarValoresUnicos aquí si es necesario
    await comparacion.encontrarValoresUnicos("sitios.txt","valoresColumnaB.txt");
    
  
    rl.close();
  }
  
// Inicia preguntando al usuario
preguntarUsuario();


//Llamado de datos 
//Conexion
const host= 'localhost';
const user= 'root';
const password= 'hola1234';
const database= 'rasp_integracion';

//deteccionDB
//este const asigna el nombre al archivo
const archivoDB='sitios.txt';
//aksdjladjsal