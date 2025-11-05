import { Component } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ IMPORTANTE

@Component({
  selector: 'app-recuperacion',
  standalone: true,          // ✅ Esto permite que el componente sea independiente
  imports: [FormsModule],    // ✅ Agrega FormsModule aquí
  templateUrl: './recuperacion.html',
  styleUrls: ['./recuperacion.css']
})
export class RecuperacionComponent {
  email: string = '';
  loading = false;

  constructor(private http: HttpClient) {}

  enviarCorreo() {
    if (!this.email) {
      alert('Por favor ingresa tu correo electrónico');
      return;
    }

    this.loading = true;
    this.http.post('http://localhost:3001/api/recuperacion', { email: this.email })
      .subscribe({
        next: (res: any) => {
          alert(res.msg);
          this.loading = false;
        },
        error: (err) => {
          alert(err.error?.msg || 'Ocurrió un error');
          this.loading = false;
        }
      });
  }
}
=======
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recuperacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recuperacion.html',
  styleUrls: ['./recuperacion.css']
})
export class Recuperacion {}
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
