
const { Before, After, AfterStep } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { request } = require('@playwright/test');

// Se ejecuta antes de cada escenario para preparar navegador y cliente HTTP.
Before(async function () {
  // Navegador headless para ejecutar la UI sin mostrar la interfaz gráfica.
  this.navegador = await chromium.launch({ headless: true });
  this.contexto = await this.navegador.newContext();
  this.pagina = await this.contexto.newPage();

  // Cliente HTTP reutilizable para realizar las peticiones API del escenario.
  this.peticionApi = await request.newContext();
  this.peticion = this.peticionApi;
});

// Se ejecuta después de cada escenario para limpiar recursos.
After(async function () {
  if (this.pagina) {
    await this.pagina.close().catch(() => { });
  }
  if (this.contexto) {
    await this.contexto.close().catch(() => { });
  }
  if (this.navegador) {
    await this.navegador.close().catch(() => { });
  }
  if (this.peticionApi) {
    await this.peticionApi.dispose().catch(() => { });
  }
});
AfterStep(async function (scenario) {
  // No capturar screenshots en escenarios de API para evitar información sensible
  const isApiScenario = scenario.pickle.name.toLowerCase().includes('api');
  if (!isApiScenario && this.pagina) {
    const timestamp = Date.now();
    const safeTitle = scenario.pickle.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `./allure-results/${timestamp}-${safeTitle}.png`;
    const screenshotBuffer = await this.pagina.screenshot({ path: filePath });
    this.attach(screenshotBuffer, 'image/png');
  }
});
