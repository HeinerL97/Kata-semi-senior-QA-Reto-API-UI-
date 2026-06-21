const fs = require('fs');
const path = require('path');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Carga la variable de entorno de ejemplo para el token de autenticación.
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.example') });

// URL base de la API del reto.
const URL_BASE = 'https://thinking-tester-contact-list.herokuapp.com';
// Archivos donde se va a guardar la evidencia generada.
const ARCHIVO_SALIDA_JSON = path.resolve(__dirname, '../../test-data/user-data.json');
const ARCHIVO_SALIDA_ENV = path.resolve(__dirname, '../../test-data/user-data.env');

// Genera un número entero dentro de un rango determinado.
function obtenerEnteroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

// Crea un correo válido para el reto, siempre terminando en @yopmail.com.
function crearCorreoAleatorio() {
  const numeroAleatorio = obtenerEnteroAleatorio(1000, 999999);
  const sufijoAleatorio = Math.random().toString(36).substring(2, 7);
  return `test${sufijoAleatorio}${numeroAleatorio}@yopmail.com`;
}

// Crea un usuario con datos aleatorios para la prueba.
function crearUsuarioAleatorio() {
  const numeroAleatorio = obtenerEnteroAleatorio(1000, 999999);
  return {
    firstName: `Test${numeroAleatorio}`,
    lastName: `User${numeroAleatorio}`,
    email: crearCorreoAleatorio(),
    password: `Test${numeroAleatorio}!A`
  };
}

// Guarda los datos del usuario y la respuesta en archivos JSON y .env para uso posterior.
function guardarDatosUsuario(datosGuardar) {
  fs.mkdirSync(path.dirname(ARCHIVO_SALIDA_JSON), { recursive: true });
  fs.writeFileSync(ARCHIVO_SALIDA_JSON, JSON.stringify(datosGuardar, null, 2));

  const contenidoEnv = [
    `FIRST_NAME=${datosGuardar.user.firstName}`,
    `LAST_NAME=${datosGuardar.user.lastName}`,
    `EMAIL=${datosGuardar.user.email}`,
    `PASSWORD=${datosGuardar.user.password}`,
    `TOKEN=${datosGuardar.token || ''}`
  ].join('\n');

  fs.writeFileSync(ARCHIVO_SALIDA_ENV, contenidoEnv);
}

// Paso Given: valida que la configuración necesaria exista.
Given('que la URL base de la API y el token de autenticación están cargados', function () {
  const tokenAutenticacion = process.env.AUTH_TOKEN;
  expect(tokenAutenticacion, 'AUTH_TOKEN no está definido. Crea o carga un archivo .env con la variable AUTH_TOKEN.').toBeTruthy();
  this.urlBase = URL_BASE;
  this.tokenAutenticacion = tokenAutenticacion;
});

// Paso When: envía la petición POST con el usuario aleatorio.
When('envío una petición POST al endpoint de usuarios con datos aleatorios del usuario', async function () {
  this.usuario = crearUsuarioAleatorio();

  this.respuesta = await this.peticion.post(`${this.urlBase}/users`, {
    headers: {
      Authorization: `Bearer ${this.tokenAutenticacion}`,
      'Content-Type': 'application/json'
    },
    data: this.usuario
  });

  this.cuerpoRespuesta = await this.respuesta.json().catch(() => null);

  // Adjuntar solicitud y respuesta al reporte Allure
  this.attach(JSON.stringify(this.usuario, null, 2), 'application/json');
  this.attach(JSON.stringify(this.cuerpoRespuesta, null, 2), 'application/json');
});

// Paso Then: valida que el código HTTP sea 201.
Then('el código de respuesta debe ser 201', async function () {
  expect(this.respuesta.status()).toBe(201);
});

// Paso Then: valida que la respuesta tenga la estructura esperada.
Then('la respuesta debe contener los datos del usuario creado', function () {
  expect(this.cuerpoRespuesta).toHaveProperty('user');
  expect(this.cuerpoRespuesta.user).toHaveProperty('_id');
  expect(this.cuerpoRespuesta.user.email).toBe(this.usuario.email);
  expect(this.cuerpoRespuesta.user.firstName).toBe(this.usuario.firstName);
  expect(this.cuerpoRespuesta.user.lastName).toBe(this.usuario.lastName);
});

// Paso Then: asegura que el correo cumpla la regla del reto.
Then('el correo generado debe terminar en @yopmail.com', function () {
  expect(this.usuario.email).toMatch(/@yopmail\.com$/i);
});

// Paso Then: guarda la evidencia del usuario para la ejecución UI.
Then('los datos del usuario creado deben guardarse en la carpeta de evidencia', function () {
  guardarDatosUsuario({
    generatedAt: new Date().toISOString(),
    user: this.usuario,
    token: this.cuerpoRespuesta.token,
    responseUser: this.cuerpoRespuesta.user
  });

  expect(fs.existsSync(ARCHIVO_SALIDA_JSON)).toBeTruthy();
  expect(fs.existsSync(ARCHIVO_SALIDA_ENV)).toBeTruthy();
});
