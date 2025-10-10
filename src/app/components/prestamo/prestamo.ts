import { Component } from '@angular/core';

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [],
  templateUrl: './prestamo.html',
  styleUrls: ['./prestamo.component.css'],
})
export class PrestamoComponent {
   solicitudEnviada = false;

  enviarSolicitud() {
    if (this.solicitudEnviada) {
      alert('Ya envió una solicitud. Por favor espere la confirmación antes de enviar otra.');
      return;
    }

    this.solicitudEnviada = true;
    alert('Su préstamo será confirmado dentro de una o dos semanas.');
  }
}