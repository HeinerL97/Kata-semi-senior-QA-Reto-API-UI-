# language: es
Característica: Login y gestión de contactos en la interfaz de usuario
  Como usuario de la aplicación
  Quiero validar el flujo de autenticación y creación de contactos
  Para cubrir los escenarios principales de regresión

  Escenario: Validar login inválido, login válido, errores del formulario, creación de contacto y cierre de sesión
    Dado que el usuario abre la página de login
    Cuando intenta iniciar sesión con credenciales inválidas
    Entonces se debe mostrar el mensaje de login inválido
    Cuando inicia sesión con las credenciales generadas por la API
    Entonces se debe mostrar el mensaje de detalle de contactos
    Cuando envía el formulario de contacto sin los campos obligatorios
    Entonces se debe mostrar el mensaje de validación del contacto
    Cuando cancela el formulario de contacto
    Entonces se debe mostrar nuevamente el mensaje de detalle de contactos
    Cuando crea un contacto válido
    Entonces se debe mostrar nuevamente el mensaje de detalle de contactos
    Cuando selecciona el contacto creado
    Y edita el contacto con nuevos datos
    Entonces se debe mostrar la información actualizada en los detalles del contacto
    Cuando elimina el contacto
    Entonces el contacto ya no debe aparecer en la lista
    Cuando cierra la sesión
    Entonces se debe mostrar el mensaje de bienvenida