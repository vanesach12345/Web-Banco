import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario.html',
  styleUrls: ['./cliente.css']
})
export class ClienteComponent {
  constructor(private router: Router) {}

  transacciones = [
    { name: "Supermercado Central", amount: "-$45.20", date: "Hoy, 10:30 AM", type: "expense" },
    { name: "Transferencia recibida", amount: "+$500.00", date: "Ayer, 3:45 PM", type: "income" },
    { name: "Pago de servicios", amount: "-$120.00", date: "15 Ene, 9:00 AM", type: "expense" }
  ];

  promociones = [
    { img: "assets/img/img1.png", titulo: "Créditos Personales", texto: "Solicita tu crédito con aprobación inmediata y tasas preferenciales." },
    { img: "assets/img/img2.png", titulo: "Seguros Nova", texto: "Protege tu vida y tu patrimonio con seguros adaptados a ti." },
    { img: "assets/img/img3.png", titulo: "Inversiones", texto: "Haz crecer tu dinero con opciones seguras y flexibles." }
  ];

  irATransferencias() {
    this.router.navigate(['/transferencias']);
  }
}
