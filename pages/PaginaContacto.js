// Objeto de Página (POM) para la administración de contactos.
class PaginaContacto {

    // Almacena los selectores de la lista de contactos y formularios.
    constructor(pagina) {
        this.pagina = pagina;

        this.botonAgregarContacto = pagina.getByRole('button', { name: 'Add a New Contact' });
        this.mensajeDetallesContacto = pagina.getByText('Click on any contact to view the Contact Details');
        this.mensajeValidacion = pagina.getByText('Contact validation failed');

        this.primerNombre = pagina.getByRole('textbox', { name: '* First Name:' });
        this.apellido = pagina.getByRole('textbox', { name: '* Last Name:' });
        this.fechaNacimiento = pagina.getByRole('textbox', { name: 'Date of Birth:' });
        this.correo = pagina.getByRole('textbox', { name: 'Email:' });
        this.telefono = pagina.getByRole('textbox', { name: 'Phone:' });
        this.direccionCalle1 = pagina.getByRole('textbox', { name: 'Street Address 1:' });
        this.direccionCalle2 = pagina.getByRole('textbox', { name: 'Street Address 2:' });
        this.ciudad = pagina.getByRole('textbox', { name: 'City:' });
        this.estadoProvincia = pagina.getByRole('textbox', { name: 'State or Province:' });
        this.codigoPostal = pagina.getByRole('textbox', { name: 'Postal Code:' });
        this.pais = pagina.getByRole('textbox', { name: 'Country:' });

        this.botonEnviar = pagina.getByRole('button', { name: 'Submit' });
        this.botonCancelar = pagina.getByRole('button', { name: 'Cancel' });
        this.botonCerrarSesion = pagina.getByRole('button', { name: 'Logout' });

        // Elementos de la vista detallada y edición
        this.botonEditarContacto = pagina.getByRole('button', { name: 'Edit Contact' });
        this.botonEliminarContacto = pagina.getByRole('button', { name: 'Delete Contact' });
        this.botonVolverListaContactos = pagina.getByRole('button', { name: 'Return to Contact List' });

        // Selectores específicos de edición (sin asterisco en su label)
        this.editarPrimerNombre = pagina.getByRole('textbox', { name: 'First Name:' });
        this.editarApellido = pagina.getByRole('textbox', { name: 'Last Name:' });
    }

    // Abre el formulario y registra un contacto.
    async crearContacto(contacto) {
        await this.botonAgregarContacto.click();

        await this.primerNombre.fill(contacto.primerNombre);
        await this.apellido.fill(contacto.apellido);
        await this.fechaNacimiento.fill(contacto.fechaNacimiento);
        await this.correo.fill(contacto.correo);
        await this.telefono.fill(contacto.telefono);
        await this.direccionCalle1.fill(contacto.direccionCalle1 || '');
        await this.direccionCalle2.fill(contacto.direccionCalle2 || '');
        await this.ciudad.fill(contacto.ciudad || '');
        await this.estadoProvincia.fill(contacto.estadoProvincia || '');
        await this.codigoPostal.fill(contacto.codigoPostal || '');
        await this.pais.fill(contacto.pais || '');

        await this.botonEnviar.click();
    }

    // Abre el detalle de un contacto.
    async abrirContacto(nombreCompleto) {
        await this.pagina.getByRole('cell', { name: nombreCompleto }).click();
    }

    // Edita la información del contacto actual.
    async editarContacto(nuevosDatos) {
        await this.botonEditarContacto.click();

        if (nuevosDatos.primerNombre !== undefined) await this.editarPrimerNombre.fill(nuevosDatos.primerNombre);
        if (nuevosDatos.apellido !== undefined) await this.editarApellido.fill(nuevosDatos.apellido);
        if (nuevosDatos.fechaNacimiento !== undefined) await this.fechaNacimiento.fill(nuevosDatos.fechaNacimiento);
        if (nuevosDatos.correo !== undefined) await this.correo.fill(nuevosDatos.correo);
        if (nuevosDatos.telefono !== undefined) await this.telefono.fill(nuevosDatos.telefono);
        if (nuevosDatos.direccionCalle1 !== undefined) await this.direccionCalle1.fill(nuevosDatos.direccionCalle1);
        if (nuevosDatos.direccionCalle2 !== undefined) await this.direccionCalle2.fill(nuevosDatos.direccionCalle2);
        if (nuevosDatos.ciudad !== undefined) await this.ciudad.fill(nuevosDatos.ciudad);
        if (nuevosDatos.estadoProvincia !== undefined) await this.estadoProvincia.fill(nuevosDatos.estadoProvincia);
        if (nuevosDatos.codigoPostal !== undefined) await this.codigoPostal.fill(nuevosDatos.codigoPostal);
        if (nuevosDatos.pais !== undefined) await this.pais.fill(nuevosDatos.pais);

        await this.botonEnviar.click();
    }

    // Elimina el contacto y aprueba el diálogo de confirmación.
    async eliminarContacto() {
        this.pagina.once('dialog', dialogo => {
            dialogo.accept().catch(() => {});
        });
        await this.botonEliminarContacto.click();
    }

    // Vuelve al listado general de contactos.
    async volverALista() {
        await this.botonVolverListaContactos.click();
    }

    // Cancela la creación o edición actual.
    async cancelarContacto() {
        await this.botonCancelar.click();
    }

    // Cierra la sesión del usuario activo.
    async cerrarSesion() {
        await this.botonCerrarSesion.click();
    }
}

module.exports = PaginaContacto;
