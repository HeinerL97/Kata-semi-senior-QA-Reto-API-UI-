# language: es
Característica: Creación de usuario mediante API
  Como automatizador de pruebas
  Quiero crear usuarios mediante la API
  Para validar la respuesta del servicio y guardar la evidencia generada

  Escenario: Crear un usuario con datos aleatorios y validar la respuesta de la API
    Dado que la URL base de la API y el token de autenticación están cargados
    Cuando envío una petición POST al endpoint de usuarios con datos aleatorios del usuario
    Entonces el código de respuesta debe ser 201
    Y la respuesta debe contener los datos del usuario creado
    Y el correo generado debe terminar en @yopmail.com
    Y los datos del usuario creado deben guardarse en la carpeta de evidencia