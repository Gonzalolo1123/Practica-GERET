const puppeteer = require("puppeteer");

class PuppeteerScraper {
  async officeDownload() {
    // Configuración de opciones de Chrome
    const chromeOptions = {
      headless: false,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
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
      downloadPath: "C:\\Users\\gonza\\Desktop\\puppeteer",
      args: ["--disable-web-security"],
    });

    // Navega a Google (o cualquier otra acción que desees realizar)
    // Inicio del login
    try {
      await page.goto("https://entel.officetrack.com");
      console.log("Ingreso de datos..");
      await this.sleep(1000);
      await page.type("#txtUserName", "test.geret1", { delay: 0 });
      await this.sleep(1000);
      await page.type("#txtPassword", "Ggg08012024", { delay: 0 });
      await this.sleep(1000);
      await page.type("#txtCompany", "entel1", { delay: 0 });
      await this.sleep(1000);
      await page.click('[type="submit"]');
      await this.sleep(3000);
      const loginError = await page.$("#dError");
      if (loginError) {
        console.log("fallo dentro del if");
        await browser.close();
      }
    } catch (error) {
      console.log("fallo dentro del catch");
      await browser.close();
    }

    // Aviso de sesión abierta
    try {
      console.log("popup de sesión abierta...");
      const existingSession = await page.$("#btnCloseExistingSession");
      if (existingSession) {
        await page.click("#btnCloseExistingSession");
      }
    } catch (error) {
      // await handleErrors(error, 2);
    }

    // Fin del login
    await this.sleep(3000);
    console.log("1");
    // Acceso a una página específica:
    try {
      await page.goto(
        "https://entel.officetrack.com/Help/DynamicExport.aspx?Id=5",
        { waitUntil: "domcontentloaded", timeout: 0 }
      );
    } catch (error) {
      console.error("Error pero descarga:", error);
    }
    console.log("esperando descarga");
    await this.sleep(60000); // 30 segundos adicionales (ajusta según sea necesario)
    console.log("3");

    // Cierra el navegador
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
