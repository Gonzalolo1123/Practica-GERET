const puppeteer = require("puppeteer");

class PuppeteerScraper {
  async officeDownload(userOT, passOT, compOF,navegador, rutaDescargaOT,linkOF) {
    // Configuración de opciones de Chrome
    const chromeOptions = {
      headless: false,
      executablePath: navegador,
      defaultViewport: null,
      args: [
        "--start-maximized",
        "--no-sandbox",
        "--disable-seccomp-filter-sandbox",
      ],
    };

    // Lanza el navegador con las opciones especificadas
    const browser = await puppeteer.launch(chromeOptions);

    // Abre una nueva página
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(100000);

    // Configura el comportamiento de descarga
    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: rutaDescargaOT,
      args: ["--disable-web-security"],
    });

    // Navega a Google (o cualquier otra acción que desees realizar)
    // Inicio del login
    try {
      await page.goto(linkOF);
      console.log("Ingreso OfficeTrack para descarga de archivo");
      console.log("Esto puede llevar un tiempo...");
      await this.sleep(1000);
      await page.type("#txtUserName", userOT, { delay: 0 });
      await this.sleep(1000);
      await page.type("#txtPassword", passOT, { delay: 0 });
      await this.sleep(1000);
      await page.type("#txtCompany", compOF, { delay: 0 });
      await this.sleep(1000);
      await page.click('[type="submit"]');
      await this.sleep(3000);
      const loginError = await page.$("#dError");
      if (loginError) {
        console.log("fallo dentro del if");
        await page.close();
      }
    } catch (error) {
      console.log("fallo dentro del catch");
      await page.close();
    }

    // Aviso de sesión abierta
    try {
      //console.log("popup de sesión abierta...");
      const existingSession = await page.$("#btnCloseExistingSession");
      if (existingSession) {
        await page.click("#btnCloseExistingSession");
      }
    } catch (error) {
      // await handleErrors(error, 2);
    }

    // Fin del login
    await this.sleep(3000);
    // Acceso a una página específica:
    try {
      await page.goto(
        "https://entel.officetrack.com/Help/DynamicExport.aspx?Id=5",
        { waitUntil: "domcontentloaded", timeout: 0 }
      );
    } catch (error) {
      console.error("Descarga finalizada");//lanza error por el cierre del navegador,pero no influye en el funcionamiento
    }
    console.log("esperando descarga");
    await this.sleep(60000); // 60 segundos adicionales 

    // Cierra el navegador
    await page.close();
    await browser.close();
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = PuppeteerScraper;
/* eslint-disable prettier/prettier */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
