import { Component } from '@angular/core';
import { Location } from '@angular/common'; // ✅ Importa Location

@Component({
  selector: 'app-agregar-contacto',
  templateUrl: './agregar-contacto.html',
  styleUrls: ['./agregar-contacto.css']
})
export class AgregarContacto {
  
  constructor(private location: Location) {} // ✅ Inyecta el servicio Location

  goBack() {
    this.location.back(); // 🔙 Regresa a la página anterior
  }
}
