const readline = require("readline");
const PuppeteerScraper = require("./officeTrackDownload");
const DatabaseReader = require("./deteccionBD");
const ExcelReader = require("./deteccionExcel");
const connectDatabase = require("./conexionMySQL");
const comparacion = require("./comparacion");
const ConsultaDB = require("./puntos_interes");
const { link } = require("fs");
const LoadScrapper = require("./IngresoAuto");


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

  } catch (error) {
    console.error("Error en la ejecución:", error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
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

    // Mostrar resultados
    console.log(
      "valores no presentes en officeTrack:",
      valoresUnicos.length
    );

    const consultaPI = new ConsultaDB(connection);
    const rowsPI = await consultaPI.executeQuery(valoresUnicos);

    const valoresColumnaAB = await excelReaderTITAN.UnionDB();

    // Resto de las operaciones comunes...

    const ListPage = await comparacion.UnionEXPI(rowsPI, valoresColumnaAB);
    console.log("ListPage: ",ListPage)
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
    console.error("Error en la ejecución sin scraper:", error);
  }
}


//GONZALO
const userOT = "test.geret1";
const passOT = "Ggg08012024";
const compOF = "entel1";
const navegador = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const rutaDescargaOT = "C:\\Users\\gonza\\Desktop\\puppeteer";
const linkOF = "https://entel.officetrack.com";

//Conexion
const host = "172.29.159.57";
const user = "geret";
const password = "g3r3t123";
const database = "RASP";

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

ejecutarScraper();