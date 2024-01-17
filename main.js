const readline = require("readline");
const PuppeteerScraper = require("./officeTrackDownload");
const DatabaseReader = require("./deteccionBD");
const ExcelReader = require("./deteccionExcel");
const connectDatabase = require("./conexionMySQL");
const comparacion = require("./comparacion");
const ConsultaDB = require("./puntos_interes");
const { link } = require("fs");
const LoadScrapper = require("./IngresoAuto");

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

async function ejecutarOperacionesComunes(
  connection,
  archivoDB,
  archivoEX,
  rutaTITAN
) {
  try {
    const dbReader = new DatabaseReader(connection);
    await dbReader.executeQuery(archivoDB);

    const excelReader = new ExcelReader(rutaArchivoEX, "Puntos de interés");
    await excelReader.leerArchivo(archivoEX);

    const excelReaderTITAN = new ExcelReader(rutaTITAN, "Worksheet");
    await excelReaderTITAN.leerArchivo(archivoTITAN);

    // Llama a la función encontrarValoresUnicos aquí si es necesario
    const valoresUnicos = await comparacion.encontrarValoresUnicos(
      archivoDB,
      archivoEX
    );

    const consultaPI = new ConsultaDB(connection);
    const rowsPI = await consultaPI.executeQuery(valoresUnicos);

    const valoresColumnaAB = await excelReaderTITAN.UnionDB();

    // Resto de las operaciones comunes...

    const ListPage = await comparacion.UnionEXPI(rowsPI, valoresColumnaAB);

    const classIngreso = new LoadScrapper();
    const { page: pageInstance, browser: browserInstance } =
      await classIngreso.Login(
        userOT,
        passOT,
        compOF,
        navegador,
        rutaDescargaOT,
        linkOF
      );
    // Tamaño del lote
    const tamanoLote = 5;

    // Crear una función asincrónica para procesar un lote
    const procesarLote = async (lote) => {
      if (!pageInstance) {
        console.log("Error al iniciar sesión.");
        return;
      }

      // Procesar cada elemento del lote
      for (const item of lote) {
        const nombreSitio = item.SITIO;
        const cuidad = item.COMUNA;
        const direccion = item.DIRECCION;
        const lat = item.LAT;
        const longitud = item.LONGITUD;
        const comuna = item.COMUNA;
        const POI = item.valorPOI;

        var { page: page2Instance, browser: browser2Instance } =
          await classIngreso.AccessPage(
            pageInstance,
            browserInstance,
            nombreSitio,
            cuidad,
            direccion,
            lat,
            longitud,
            comuna,
            POI
          );
      }
      try {
        await browser2Instance.close();
      } catch (error) {
        console.error("Automatizador cerrado");
      }
    };

    // Procesar por lotes
    for (let i = 0; i < ListPage.length; i += tamanoLote) {
      const loteActual = ListPage.slice(i, i + tamanoLote);

      // Procesar el lote actual
      await procesarLote(loteActual);
    }
    //errores y cierre
  } catch (error) {
    console.error("Error en la ejecución sin scraper:",error);
  }
}

async function ejecutarScraper() {
  let connection;
  try {
    const scraper = new PuppeteerScraper();
    await scraper.officeDownload(
      userOT,
      passOT,
      compOF,
      navegador,
      rutaDescargaOT,
      linkOF
    );

    connection = await connectDatabase(host, user, password, database);
    await ejecutarOperacionesComunes(
      connection,
      archivoDB,
      archivoEX,
      rutaTITAN
    );

    // Operaciones específicas de ejecutarScraper...

    rl.close();
  } catch (error) {
    console.error("Error en la ejecución:", error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

async function ejecutarSinScraper() {
  let connection;
  try {
    connection = await connectDatabase(host, user, password, database);
    await ejecutarOperacionesComunes(
      connection,
      archivoDB,
      archivoEX,
      rutaTITAN
    );

    // Operaciones específicas de ejecutarSinScraper...

    //errores y cierre
  } catch (error) {
    console.error("Error en la ejecución:", error);
  } finally {
    if (connection) {
      connection.end();
    }
    rl.close();
  }
}

// Inicia preguntando al usuario
preguntarUsuario();
//GONZALO
const userOT = "test.geret1";
const passOT = "Ggg08012024";
const compOF = "entel1";
const navegador = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const rutaDescargaOT = "C:\\Users\\gonza\\Desktop\\puppeteer";
const linkOF = "https://entel.officetrack.com";

//Conexion
const host = "localhost";
const user = "root";
const password = "hola1234";
const database = "rasp_integracion";

//deteccionDB
//este const asigna el nombre al archivo
const archivoDB = "sitios.txt";
//aksdjladjsal

//deteccionExcel
//este const asigna el nombre al archivo
const rutaArchivoEX = rutaDescargaOT + "\\Puntos de interés.xlsx";
const rutaTITAN = rutaDescargaOT + "\\TITAN.xlsx";
const archivoEX = "nombres.txt";
const archivoTITAN = "TITANasda.xlxs";
