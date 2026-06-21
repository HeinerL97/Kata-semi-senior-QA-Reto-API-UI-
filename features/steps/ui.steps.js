const path = require('path');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
require('dotenv').config({ path: path.resolve(__dirname, '../../test-data/user-data.env') });

const PaginaLogin = require('../../pages/PaginaLogin');
const PaginaContacto = require('../../pages/PaginaContacto');

// Genera un correo aleatorio inválido.
function crearCorreoAleatorio() {
  return `invalido${Date.now()}@mail.com`;
}

// Genera un texto alfanumérico aleatorio.
function crearTextoAleatorio(longitud = 6) {
  return Math.random().toString(36).substring(2, 2 + longitud);
}

// Construye un contacto válido con datos aleatorios.
function construirContacto() {
  const unico = crearTextoAleatorio(5);
  return {
    primerNombre: `Juan${unico}`,
    apellido: `Perez${unico}`,
    fechaNacimiento: '1997-08-30',
    correo: `contacto${unico}@test.com`,
    telefono: '123456789',
    direccionCalle1: 'Calle 1',
    direccionCalle2: 'Calle 2',
    ciudad: 'Bogota',
    estadoProvincia: 'Cundinamarca',
    codigoPostal: '110111',
    pais: 'Colombia'
  };
}

Given('que el usuario abre la página de login', async function () {
  this.paginaLogin = new PaginaLogin(this.pagina);
  this.paginaContacto = new PaginaContacto(this.pagina);
  await this.paginaLogin.navegar();
});

When('intenta iniciar sesión con credenciales inválidas', async function () {
  this.correoInvalido = crearCorreoAleatorio();
  this.contrasenaInvalida = `Clave${Date.now()}`;
  await this.paginaLogin.iniciarSesion(this.correoInvalido, this.contrasenaInvalida);
});

Then('se debe mostrar el mensaje de login inválido', async function () {
  await expect(this.paginaLogin.mensajeError).toHaveText('Incorrect username or password');
});

When('inicia sesión con las credenciales generadas por la API', async function () {
  await this.paginaLogin.iniciarSesion(process.env.EMAIL, process.env.PASSWORD);
});

Then('se debe mostrar el mensaje de detalle de contactos', async function () {
  await expect(this.paginaContacto.mensajeDetallesContacto).toHaveText('Click on any contact to view the Contact Details');
});

Then('se debe mostrar nuevamente el mensaje de detalle de contactos', async function () {
  await expect(this.paginaContacto.mensajeDetallesContacto).toHaveText('Click on any contact to view the Contact Details');
});

When('envía el formulario de contacto sin los campos obligatorios', async function () {
  await this.paginaContacto.crearContacto({
    primerNombre: '',
    apellido: '',
    fechaNacimiento: '1997-08-30',
    correo: 'contacto@test.com',
    telefono: '123456789',
    direccionCalle1: 'Calle 1',
    direccionCalle2: 'Calle 2',
    ciudad: 'Bogota',
    estadoProvincia: 'Cundinamarca',
    codigoPostal: '110111',
    pais: 'Colombia'
  });
});

// Verifica que el mensaje de validación del contacto se muestra cuando faltan campos obligatorios
Then('se debe mostrar el mensaje de validación del contacto', async function () {
  await expect(this.paginaContacto.mensajeValidacion).toHaveText(
    'Contact validation failed: firstName: Path `firstName` is required., lastName: Path `lastName` is required.'
  );
});

// Simula la cancelación del formulario de contacto
When('cancela el formulario de contacto', async function () {
  await this.paginaContacto.cancelarContacto();
});

// Crea un nuevo contacto válido usando datos de construcción aleatoria
When('crea un contacto válido', async function () {
  this.contactoValido = construirContacto();
  await this.paginaContacto.crearContacto(this.contactoValido);
});

// Selecciona el contacto previamente creado en la lista
When('selecciona el contacto creado', async function () {
  const nombreCompleto = `${this.contactoValido.primerNombre} ${this.contactoValido.apellido}`;
  await this.paginaContacto.abrirContacto(nombreCompleto);
});

// Edita el contacto con datos actualizados para verificar cambios
When('edita el contacto con nuevos datos', async function () {
  this.contactoActualizado = {
    primerNombre: this.contactoValido.primerNombre + 'Mod',
    apellido: this.contactoValido.apellido + 'Mod',
    telefono: '987654321',
    ciudad: 'Medellin'
  };
  await this.paginaContacto.editarContacto(this.contactoActualizado);
});

// Verifica que los detalles del contacto reflejan la información actualizada
Then('se debe mostrar la información actualizada en los detalles del contacto', async function () {
  await expect(this.pagina.locator('#firstName')).toHaveText(this.contactoActualizado.primerNombre);
  await expect(this.pagina.locator('#lastName')).toHaveText(this.contactoActualizado.apellido);
  await expect(this.pagina.locator('#phone')).toHaveText(this.contactoActualizado.telefono);
  await expect(this.pagina.locator('#city')).toHaveText(this.contactoActualizado.ciudad);
});

When('elimina el contacto', async function () {
  await this.paginaContacto.eliminarContacto();
});

Then('el contacto ya no debe aparecer en la lista', async function () {
  await expect(this.paginaContacto.mensajeDetallesContacto).toBeVisible();
  const nombreCompletoActualizado = `${this.contactoActualizado.primerNombre} ${this.contactoActualizado.apellido}`;
  await expect(this.pagina.getByRole('cell', { name: nombreCompletoActualizado })).toHaveCount(0);
});

When('cierra la sesión', async function () {
  await this.paginaContacto.cerrarSesion();
});

Then('se debe mostrar el mensaje de bienvenida', async function () {
  await expect(this.paginaLogin.mensajeBienvenida).toHaveText(
    'Welcome! This application is for testing purposes only. The database will be purged as needed to keep costs down.'
  );
});
