import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-contacto',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './agregar-contacto.html',
  styleUrls: ['./agregar-contacto.css']
})
export class AgregarContacto {

  // 🧾 Datos del formulario
  contacto = {
    id_cliente: Number(localStorage.getItem('idCliente')) || 0, // 🟣 Toma el idCliente directo del localStorage
    nombre_contacto: '',
    identificacion: '',
    banco: '',
    num_cuenta_destino: '',
    tipo_cuenta: '',
    correo: '',
    telefono: '',
    alias: ''
  };

  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  guardarContacto() {
    const c = this.contacto;

    // 🧩 Validaciones
    if (!c.id_cliente || c.id_cliente === 0) {
      this.mensaje = '⚠️ Error: No se pudo determinar el cliente actual.';
      console.warn('⚠️ No hay id_cliente válido en localStorage.');
      return;
    }

    if (!c.nombre_contacto || !c.banco || !c.num_cuenta_destino || !c.tipo_cuenta) {
      this.mensaje = '⚠️ Todos los campos obligatorios deben completarse.';
      return;
    }

    console.log('📤 Enviando contacto:', c);

    // Enviar al backend
    this.http.post('http://localhost:3001/api/contactos/agregar', c)
      .subscribe({
        next: (resp: any) => {
          console.log('✅ Contacto agregado correctamente:', resp);
          this.mensaje = '✅ Contacto guardado exitosamente.';
          setTimeout(() => this.router.navigate(['/transferencias']), 1500);
        },
        error: (err) => {
          console.error('❌ Error al guardar contacto:', err);
          this.mensaje = '❌ Error al guardar el contacto.';
        }
      });
  }

  cancelar() {
    this.router.navigate(['/cliente']);
  }
}
