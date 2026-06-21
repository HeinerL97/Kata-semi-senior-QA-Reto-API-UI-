# Prueba técnica QA - Automatización con Playwright y Cucumber (BDD)

Este proyecto automatiza el flujo de regresión para la aplicación demo utilizando:
- **Playwright** como motor de automatización para API y UI.
- **Cucumber (Gherkin en español)** para describir y modelar los escenarios de prueba desde una perspectiva de negocio.
- **Allure** para generar reportes interactivos de las ejecuciones, incluyendo las evidencias.

> **Coherencia e Idioma:** El framework de automatización está codificado **100% en español** (archivos de objetos de página, nombres de clases, funciones auxiliares, selectores y variables del contexto de Cucumber) para garantizar coherencia completa con la especificación Gherkin.

---

## Requisitos

- **Node.js 18** o superior
- **npm** (instalado con Node.js)
- **Java 8 o superior** (JRE o JDK)
---

## Instalación

### Paso a paso para preparar y ejecutar el proyecto

1. **Requisitos previos**
   - **Node.js 18** o superior (incluye npm). Descárgalo desde https://nodejs.org/.
   - Terminal (PowerShell, CMD o Bash).
2. **Clonar el repositorio** (si aún no lo tienes localmente):
   ```bash
   git clone https://github.com/HeinerL97/Kata-semi-senior-QA-Reto-API-UI-.git
   cd Kata-semi-senior-QA-Reto-API-UI-
   ```
3. **Instalar dependencias** del proyecto:
   ```bash
   npm install
   ```
4. **Configurar variables de entorno**
   - Copia el archivo de ejemplo y edita los valores necesarios:
   ```bash
   cp .env.example .env
   # editar .env con tu AUTH_TOKEN u otros valores
   ```
5. **Ejecutar pruebas**
   - Todas las pruebas (API + UI):
   ```bash
   npm run test
   ```
   - Sólo API:
   ```bash
   npm run test:bdd:api
   ```
   - Sólo UI:
   ```bash
   npm run test:bdd:ui
   ```
6. **Generar y visualizar reportes Allure**
   ```bash
   npm run allure:generate   # crea el reporte en ./allure-report
   npm run allure:open      # abre el reporte en el navegador
   ```

Una vez completados estos pasos tendrás el entorno listo y podrás validar la automatización completa.

---

## Variables de Entorno

- **Petición API:** La prueba API requiere la variable de entorno `AUTH_TOKEN` definida. Se puede configurar en un archivo `.env` tomando como base [.env.example](.env.example).
- **Ejecución UI:** La prueba de interfaz de usuario lee de forma automática las credenciales del usuario recién creado mediante la ejecución de la API, las cuales se almacenan dinámicamente en `test-data/user-data.env`.

---

## Estructura del Proyecto

- [features/api-users.feature](features/api-users.feature): Escenario Gherkin para la creación de usuarios mediante API REST.
- [features/ui-contact.feature](features/ui-contact.feature): Escenario Gherkin para el flujo completo de autenticación, validación de formularios y gestión (CRUD completo) de contactos.
- [features/steps/api.steps.js](features/steps/api.steps.js): Implementación en JavaScript para los pasos del escenario de API (traducido a español).
- [features/steps/ui.steps.js](features/steps/ui.steps.js): Implementación en JavaScript para los pasos de interfaz de usuario (traducido a español).
- [features/support/hooks.js](features/support/hooks.js): Configuración del ciclo de vida de Playwright (lanzamiento de navegadores y limpieza en español).
- [pages/PaginaLogin.js](pages/PaginaLogin.js): Objeto de página (POM) correspondiente al login de la plataforma (en español).
- [pages/PaginaContacto.js](pages/PaginaContacto.js): Objeto de página (POM) correspondiente al dashboard y CRUD de contactos (en español).
- [test-data/](test-data/): Carpeta con evidencias dinámicas generadas durante la ejecución (`user-data.json` y `user-data.env`).


---

## Ejecución de Pruebas (BDD)

> **Importante:** Las pruebas de UI dependen directamente de la API, ya que esta genera las credenciales válidas en cada ejecución.

### Ejecutar todas las pruebas (Recomendado)
Ejecuta la suite completa de Cucumber en el orden correcto (API seguido de UI):
```bash
npm run test
```
o alternativamente:
```bash
npm run test:bdd
```

### Ejecutar solo la automatización de API
```bash
npm run test:bdd:api
```

### Ejecutar solo la automatización de la Interfaz (UI)
```bash
npm run test:bdd:ui
```

---

## Generación de Reportes con Allure

### 1. Generar reporte
Procesa los resultados de ejecución y genera un reporte HTML interactivo dentro de la carpeta `./allure-report`:
```bash
npm run allure:generate
```

### 2. Abrir reporte en el navegador
Levanta un servidor web local para visualizar el reporte generado:
```bash
npm run allure:open
```


