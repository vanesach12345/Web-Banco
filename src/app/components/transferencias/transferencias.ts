import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.html',
  styleUrls: ['./transferencias.css'],
  encapsulation: ViewEncapsulation.None
})
export class TransferenciasComponent {
  constructor(private router: Router) {}

  agregarCuenta() {
    this.router.navigate(['/agregar-contacto']); // 👈 Redirige manualmente
  }

  transferir() {
    alert('Transferencia enviada correctamente.');
  }
}
