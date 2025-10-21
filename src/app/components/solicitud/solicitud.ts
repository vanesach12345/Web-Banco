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
  nombre: string = '';
  apellido_paterno: string = '';
  apellido_materno: string = '';
  email: string = '';
  cel: string = '';
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

  registrar(form: any) {
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido_paterno', this.apellido_paterno);
    formData.append('apellido_materno', this.apellido_materno);
    formData.append('email', this.email);
    formData.append('cel', this.cel);
    formData.append('contrasena', this.contrasena);
    formData.append('rfc', this.rfc);

    if (this.ineFile) formData.append('ine', this.ineFile);
    if (this.comprobanteFile) formData.append('comprobante_dir', this.comprobanteFile);

    this.http.post<any>('http://localhost:3001/api/usuarios', formData)
      .subscribe({
        next: (res) => {
          console.log('✅ Usuario registrado', res);
          alert('Usuario registrado correctamente');

          this.resultadoGemini = {
            fecha: res.fecha_detectada,
            direccion: res.direccion_detectada
          };

          form.reset();
          this.ineFile = null;
          this.comprobanteFile = null;
          this.ineFileName = null;
          this.comprobanteFileName = null;
        },
        error: (err) => {
          console.error('❌ Error al registrar', err);
          alert('Error al registrar usuario');
        }
      });
  }
}
