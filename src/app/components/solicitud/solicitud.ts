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
<<<<<<< HEAD
=======
  // Campos del formulario
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
  nombre: string = '';
  apellido_paterno: string = '';
  apellido_materno: string = '';
  email: string = '';
  cel: string = '';
<<<<<<< HEAD
  contrasena: string = '';
  rfc: string = '';

  ineFile: File | null = null;
  comprobanteFile: File | null = null;

  ineFileName: string | null = null;
  comprobanteFileName: string | null = null;

  resultadoGemini: { fecha?: string, direccion?: string } = {};

  constructor(private http: HttpClient) {}

  onFileChange(event: any, tipo: string) {
    const file = event.target.files[0];
    if (file) {
      if (tipo === 'ine') {
        this.ineFile = file;
        this.ineFileName = file.name;
      } else if (tipo === 'comprobante') {
        this.comprobanteFile = file;
        this.comprobanteFileName = file.name;
      }
    }
  }

  removeFile(tipo: string) {
    if (tipo === 'ine') {
      this.ineFile = null;
      this.ineFileName = null;
      (document.getElementById('ine') as HTMLInputElement).value = '';
    } else if (tipo === 'comprobante') {
      this.comprobanteFile = null;
      this.comprobanteFileName = null;
      (document.getElementById('comp') as HTMLInputElement).value = '';
    }
  }

  triggerFileInput(id: string) {
    document.getElementById(id)?.click();
  }

=======
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
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
  registrar(form: any) {
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido_paterno', this.apellido_paterno);
    formData.append('apellido_materno', this.apellido_materno);
    formData.append('email', this.email);
    formData.append('cel', this.cel);
<<<<<<< HEAD
    formData.append('contrasena', this.contrasena);
    formData.append('rfc', this.rfc);

    if (this.ineFile) formData.append('ine', this.ineFile);
    if (this.comprobanteFile) formData.append('comprobante_dir', this.comprobanteFile);

    this.http.post<any>('http://localhost:3001/api/usuarios', formData)
=======
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
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
      .subscribe({
        next: (res) => {
          console.log('✅ Usuario registrado', res);
          alert('Usuario registrado correctamente');

<<<<<<< HEAD
          this.resultadoGemini = {
            fecha: res.fecha_detectada,
            direccion: res.direccion_detectada
          };

          form.reset();
          this.ineFile = null;
          this.comprobanteFile = null;
          this.ineFileName = null;
          this.comprobanteFileName = null;
=======
          //  Limpiar formulario completo
          form.reset();
          this.ineFile = null;
          this.comprobanteFile = null;

          //  Limpiar también inputs de tipo file
          const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
          fileInputs.forEach(input => input.value = '');
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
        },
        error: (err) => {
          console.error('❌ Error al registrar', err);
          alert('Error al registrar usuario');
        }
      });
  }
}
