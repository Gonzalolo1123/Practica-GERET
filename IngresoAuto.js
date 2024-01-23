const puppeteer = require("puppeteer");

class LoadScrapper {
  // Método para iniciar sesión en el sitio web.
  async Login(userOT, passOT, compOF, navegador, rutaDescargaOT, linkOF) {
    const chromeOptions = {
      headless: false,
      executablePath: navegador,
      defaultViewport: null,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--headless",  // Agrega esto
      ],
    };

    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(100000);

    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: rutaDescargaOT,
      args: ["--disable-web-security"],
    });

    try {
      await page.goto(linkOF);
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
        console.log("Fallo en el inicio de sesión");
        await browser.close();
        return null; // Retornar null para indicar que la sesión no fue exitosa
      }
    } catch (error) {
      console.log("Error durante el inicio de sesión:", error);
      await browser.close();
      return null;
    }

    try {
      const existingSession = await page.$("#btnCloseExistingSession");
      if (existingSession) {
        await page.click("#btnCloseExistingSession");
      }
    } catch (error) {
      console.log("Error al manejar sesión existente:", error);
    }

    await this.sleep(3000);

    return { page, browser };
  }

  // Método para acceder a una página específica y realizar ciertas acciones.
  async AccessPage(
    page,
    browser,
    nombreSitio,
    cuidad,
    direccion,
    lat,
    longitud,
    comuna,
    POI
  ) {
    try {
      await page.goto(
        "https://entel.officetrack.com/PointsOfInterest/PointOfInterestProperties.aspx?Mode=New&ParentPoiId="
      );
    } catch (error) {
      console.error("Error al cargar la página:", /*error*/);
    }

    // Utilizando operadores ternarios para verificar y establecer valores predeterminados
    await page.type("#txtPOIName", nombreSitio ? nombreSitio : "", {
      delay: 0,
    });
    await this.sleep(1000);
    await page.type("#txtCustomerNumber", nombreSitio ? nombreSitio : "", {
      delay: 0,
    });
    await this.sleep(1000);
    await page.type("#txtCity", cuidad ? cuidad : "", { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtStreet", direccion ? direccion : "", { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtX", lat ? lat : "", { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtY", longitud ? longitud : "", { delay: 0 });
    await this.sleep(1000);
    await page.click("#chkTypes_ctl00");
    await this.sleep(1000);
    await page.click("#chkTypes_ctl01");
    await this.sleep(1000);
    await page.click("#cmbParentPoi");
    await this.sleep(1000);
    const inputElement = await page.$(".rddtFilterInput");
    await inputElement.type(POI ? POI : "");
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(1000);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");
    await this.sleep(1000);
    await page.click("#lblCustomData");
    await this.sleep(1000);
    await page.type("#txtPoiUserData1", nombreSitio ? nombreSitio : "", {
      delay: 0,
    });
    await this.sleep(1000);
    await page.type("#txtPoiUserData29", comuna ? comuna : "", { delay: 0 });
    await this.sleep(5000);
    
    // Espera a que el botón esté disponible en el DOM
    await page.waitForSelector(".rtbButton");

    // Haz clic en el botón
    await page.click(".rtbButton");
    await this.sleep(5000);
    
    // Esperar a que el modal esté presente en el DOM
    await page.waitForSelector("#AuditPrompt");

    // Hacer clic en el botón "Guardar" usando el atributo onclick
    await page.evaluate(() => {
      const guardarButton = document.querySelector("#AuditPrompt .btn-primary");
      guardarButton.click();
    });
    await this.sleep(15000);
    console.log(["NombreSitio/Codigo: " + nombreSitio, "POI Padre: " + POI]);
    return { page, browser };
  }

  // Método para pausar la ejecución por una cantidad de milisegundos.
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = LoadScrapper; // Exporta la clase LoadScrapper para su uso en otros archivos.

