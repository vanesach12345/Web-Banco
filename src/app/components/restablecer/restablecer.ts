import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ IMPORTANTE

@Component({
  selector: 'app-restablecer',
  standalone: true,          // ✅ Componente independiente
  imports: [FormsModule],    // ✅ Activa [(ngModel)]
  templateUrl: './restablecer.html',
  styleUrls: ['./restablecer.css']
})
export class RestablecerComponent {
  nueva: string = '';
  token: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  cambiarPassword() {
    if (!this.nueva) {
      alert('Por favor ingresa tu nueva contraseña');
      return;
    }

    this.http.post('http://localhost:3001/api/restablecer', {
      token: this.token,
      nueva: this.nueva
    }).subscribe({
      next: (res: any) => {
        alert(res.msg);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.msg || 'Error al restablecer contraseña');
      }
    });
  }
}
