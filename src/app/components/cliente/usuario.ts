import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './usuario.html',
  styleUrls: ['./cliente.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClienteComponent implements OnInit {

  // 🧩 Variables que vienen del backend o del almacenamiento local
  nombre: string = '';
  apellido_paterno: string = '';
  apellido_materno: string = '';
  num_cuenta: string = '';
  saldo: number = 0;

  // 💰 Movimientos (cargados desde la BD)
  transacciones: any[] = [];

  // 🌟 Promociones
  promociones = [
    { img: "assets/img/img1.png", titulo: "Créditos Personales", texto: "Solicita tu crédito con aprobación inmediata y tasas preferenciales." },
    { img: "assets/img/img2.png", titulo: "Seguros Nova", texto: "Protege tu vida y tu patrimonio con seguros adaptados a ti." },
    { img: "assets/img/img3.png", titulo: "Inversiones", texto: "Haz crecer tu dinero con opciones seguras y flexibles." }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  // 🔹 Cargar datos del cliente y movimientos
  ngOnInit(): void {
    if (typeof window === 'undefined') {
      console.warn('⚠️ Entorno SSR detectado, localStorage no disponible.');
      return;
    }

    const idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario) {
      console.warn('⚠️ No hay sesión activa, redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    console.log('🧠 Solicitando datos del cliente con id:', idUsuario);

    // ✅ 1️⃣ Cargar primero los datos guardados localmente
    this.nombre = localStorage.getItem('nombre') || '';
    this.apellido_paterno = localStorage.getItem('apellido_paterno') || '';
    this.apellido_materno = localStorage.getItem('apellido_materno') || '';
    this.num_cuenta = localStorage.getItem('num_cuenta') || '';
    this.saldo = Number(localStorage.getItem('saldo')) || 0;

    // ✅ 2️⃣ Obtener los datos más recientes del backend y actualizar la vista
    this.http.get<any>(`http://localhost:3001/api/cliente/${idUsuario}`).subscribe({
      next: (data) => {
        console.log('✅ Datos obtenidos del cliente:', data);
        this.nombre = data.nombre;
        this.apellido_paterno = data.apellido_paterno;
        this.apellido_materno = data.apellido_materno;
        this.num_cuenta = data.num_cuenta;
        this.saldo = parseFloat(data.saldo);

        // 🟣 Guarda el id_cliente para otros componentes (como agregar-contacto)
        localStorage.setItem('idCliente', String(data.id_cliente));

        // 🔁 Guardar datos actualizados en localStorage (persistentes)
        localStorage.setItem('nombre', this.nombre);
        localStorage.setItem('apellido_paterno', this.apellido_paterno);
        localStorage.setItem('apellido_materno', this.apellido_materno);
        localStorage.setItem('num_cuenta', this.num_cuenta);
        localStorage.setItem('saldo', this.saldo.toString());

        // 👇 Forzar actualización inmediata en pantalla
        this.cd.detectChanges();
      },
      error: (err) => console.error('❌ Error al obtener datos del cliente:', err)
    });

    // ✅ 3️⃣ Cargar los movimientos del cliente
    this.http.get<any[]>(`http://localhost:3001/api/movimientos/${idUsuario}`).subscribe({
      next: (rows) => {
        console.log('✅ Movimientos cargados:', rows);
        this.transacciones = rows.map(t => ({
          ...t,
          monto: Number(t.monto),
          total_final: Number(t.total_final),
          iva: Number(t.iva)
        }));
        this.cd.detectChanges();
      },
      error: (err) => console.error('❌ Error al obtener movimientos:', err)
    });
  }

  // 🔁 Redirige a la pantalla de transferencias
  irATransferencias(): void {
    this.router.navigate(['/transferencias']);
  }

  // 🚪 Cierra sesión
  cerrarSesion(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }

  // 📄 Descargar comprobante PDF
  descargarComprobante(trans: any): void {
    const doc = new jsPDF('p', 'mm', 'a4');

    const contenido = `
      NOVA CAPITAL - Comprobante de Transferencia
      --------------------------------------------
      Folio: ${trans.folio || 'N/A'}
      Fecha: ${trans.fecha}

      Desde cuenta: ${trans.id_cuenta_origen}
      Hacia cuenta: ${trans.id_cuenta_destino}

      Monto: $${trans.monto.toFixed(2)}
      IVA (7%): $${trans.iva?.toFixed(2) || '0.00'}
      Total: $${trans.total_final?.toFixed(2) || trans.monto.toFixed(2)}

      Descripción: ${trans.descripcion || 'Sin descripción'}
    `;

    doc.setFont('helvetica', 'normal');
    doc.text(contenido, 15, 30);
    doc.save(`Comprobante_${trans.folio || 'transferencia'}.pdf`);
  }
}
