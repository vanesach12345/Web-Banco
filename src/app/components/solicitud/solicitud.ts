import { Component, ElementRef } from '@angular/core';
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

  nombre = '';
  apellido_paterno = '';
  apellido_materno = '';
  email = '';
  cel = '';
  contrasena = '';
  rfc = '';

  ineFile: File | null = null;
  comprobanteFile: File | null = null;
  ineFileName: string | null = null;
  comprobanteFileName: string | null = null;

  resultadoGemini = { fecha: '', direccion: '' };

  constructor(private http: HttpClient, private elementRef: ElementRef) {}

  triggerFileInput(tipo: 'ine' | 'comp') {
    const inputElement = this.elementRef.nativeElement.querySelector(
      tipo === 'ine' ? '#ine' : '#comp'
    ) as HTMLInputElement;
    inputElement?.click();
  }

  onFileChange(event: any, tipo: 'ine' | 'comprobante') {
    const file = event.target.files[0];
    if (!file) return;

    if (tipo === 'ine') {
      this.ineFile = file;
      this.ineFileName = file.name;
    } else {
      this.comprobanteFile = file;
      this.comprobanteFileName = file.name;
    }

    console.log(`✅ Archivo cargado (${tipo}):`, file.name);
    this.analizarDocumento(tipo);
  }

  removeFile(tipo: 'ine' | 'comprobante') {
    if (tipo === 'ine') {
      this.ineFile = null;
      this.ineFileName = null;
    } else {
      this.comprobanteFile = null;
      this.comprobanteFileName = null;
    }
  }

  analizarDocumento(tipo: 'ine' | 'comprobante') {
    const file = tipo === 'ine' ? this.ineFile : this.comprobanteFile;
    if (!file) {
      alert(`Selecciona un archivo de tipo ${tipo}.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('rfc', this.rfc);

    console.log(`📤 Enviando ${tipo} al backend para análisis...`);

    this.http.post<any>('http://localhost:3001/api/ocr', formData).subscribe({
      next: (res) => {
        console.log(`🧠 Respuesta OCR ${tipo}:`, res);
        if (res.fecha) this.resultadoGemini.fecha = res.fecha;
        if (res.direccion) this.resultadoGemini.direccion = res.direccion;
        alert('✅ Datos detectados y guardados correctamente en la base de datos.');
      },
      error: (err) => {
        console.error('❌ Error al analizar documento:', err);
        alert('Error al analizar el documento. Revisa el backend.');
      }
    });
  }

  registrar(form: any) {
    if (form.invalid) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

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

    console.log('📨 Enviando solicitud de creación de cuenta...');

    this.http.post('http://localhost:3001/api/usuarios', formData).subscribe({
      next: () => alert('✅ Cuenta creada correctamente.'),
      error: (err) => {
        console.error('❌ Error en el registro:', err);
        alert('Error al registrar usuario.');
      }
    });
  }
}
