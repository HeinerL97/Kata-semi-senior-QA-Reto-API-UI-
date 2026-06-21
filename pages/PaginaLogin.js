// Objeto de Página (POM) para la pantalla de inicio de sesión.
class PaginaLogin {

    // Almacena los selectores principales de la interfaz.
    constructor(pagina) {
        this.pagina = pagina;

        this.correo = pagina.getByRole('textbox', { name: 'Email' });
        this.contrasena = pagina.getByRole('textbox', { name: 'Password' });
        this.botonEnviar = pagina.getByRole('button', { name: 'Submit' });
        this.mensajeError = pagina.getByText('Incorrect username or password');
        this.mensajeBienvenida = pagina.getByText(
            'Welcome! This application is for testing purposes only. The database will be purged as needed to keep costs down.'
        );
    }

    // Abre la dirección web de la aplicación.
    async navegar() {
        await this.pagina.goto('https://thinking-tester-contact-list.herokuapp.com/');
    }

    // Realiza el flujo de inicio de sesión.
    async iniciarSesion(correo, contrasena) {
        await this.correo.fill(correo);
        await this.contrasena.fill(contrasena);
        await this.botonEnviar.click();
    }
}

module.exports = PaginaLogin;
