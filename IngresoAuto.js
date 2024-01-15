const puppeteer = require("puppeteer");

class LoadScrapper {
  async Login(userOT, passOT, compOF, navegador, rutaDescargaOT, linkOF) {
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

    return page;
  }

  async AccessPage(page, nombreSitio, cuidad, direccion, lat, longitud, comuna, POI) {
    try {
      await page.goto(
        "https://entel.officetrack.com/PointsOfInterest/PointOfInterestProperties.aspx?Mode=New&ParentPoiId="
      );
    } catch (error) {
      console.error("Error al cargar la página:", error);
    }
    await page.type("#txtPOIName", nombreSitio, { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtCustomerNumber", nombreSitio, { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtCity", cuidad, { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtStreet", direccion, { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtX", lat, { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtY", longitud, { delay: 0 });
    await this.sleep(1000);
    await page.click("#chkTypes_ctl00");
    await this.sleep(1000);
    await page.click("#chkTypes_ctl01");
    await this.sleep(1000);
    await page.click("#cmbParentPoi");
    await this.sleep(1000);
    const inputElement = await page.$(".rddtFilterInput");
    await inputElement.type(POI);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(1000);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");
    await this.sleep(1000);
    await page.click("#lblCustomData");
    await this.sleep(1000);
    await page.type("#txtPoiUserData1", nombreSitio, { delay: 0 });
    await this.sleep(1000);
    await page.type("#txtPoiUserData29", comuna, { delay: 0 });
    await this.sleep(1000);
    await this.sleep(1000);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports=LoadScrapper;