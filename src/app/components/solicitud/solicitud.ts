import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Solicitud.html',
  styleUrls: ['./Solicitud.css']
})
export class SolicitudComponent {
  // Campos del formulario
  nombre: string = '';
  apellido_paterno: string = '';
  apellido_materno: string = '';
  email: string = '';
  cel: string = '';
  direccion: string = '';
  fecha_nac: string = '';
  contrasena: string = '';
  rfc: string = '';  

  // Archivos opcionales
  ineFile: File | null = null;
  comprobanteFile: File | null = null;

  constructor(private http: HttpClient) {}

  // Captura de archivos
  onFileChange(event: any, tipo: string) {
    const file = event.target.files[0];
    if (tipo === 'ine') {
      this.ineFile = file;
    } else if (tipo === 'comprobante') {
      this.comprobanteFile = file;
    }
  }

  // Envío del formulario
  registrar(form: any) {
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido_paterno', this.apellido_paterno);
    formData.append('apellido_materno', this.apellido_materno);
    formData.append('email', this.email);
    formData.append('cel', this.cel);
    formData.append('direccion', this.direccion);
    formData.append('fecha_nac', this.fecha_nac);
    formData.append('contrasena', this.contrasena);
    formData.append('rfc', this.rfc); 

    if (this.ineFile) {
      formData.append('ine', this.ineFile);
    }
    if (this.comprobanteFile) {
      formData.append('comprobante_dir', this.comprobanteFile);
    }

    this.http.post('http://localhost:3001/api/usuarios', formData)
      .subscribe({
        next: (res) => {
          console.log('✅ Usuario registrado', res);
          alert('Usuario registrado correctamente');

          //  Limpiar formulario completo
          form.reset();
          this.ineFile = null;
          this.comprobanteFile = null;

          //  Limpiar también inputs de tipo file
          const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
          fileInputs.forEach(input => input.value = '');
        },
        error: (err) => {
          console.error('❌ Error al registrar', err);
          alert('Error al registrar usuario');
        }
      });
  }
}
