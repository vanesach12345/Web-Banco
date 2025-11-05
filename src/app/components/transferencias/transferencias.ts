import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

<<<<<<< HEAD

=======
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
type Contacto = {
  id_contacto: number;
  nombre_contacto: string;
  banco: string;
  num_cuenta_destino: string;
  tipo_cuenta: 'corriente' | 'ahorro';
  alias?: string;
};

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './transferencias.html',
  styleUrls: ['./transferencias.css'],
  encapsulation: ViewEncapsulation.None
})
export class TransferenciasComponent implements OnInit {
  @ViewChild('comprobantePDF') comprobantePDF!: ElementRef;

  constructor(private router: Router, private http: HttpClient) {}

  // ⚙️ Variables del formulario
  cuentaOrigen: string = ''; // ← ahora inicia vacía
  tipoTransferencia = 1;
  destinatarioNombre = '';
  destinatarioCuenta = '';
  monto: number = 0;
  concepto = '';
  today = new Date();

  // 💰 Cálculos
  iva = 0;
  comision = 0;
  total = 0;
  saldoCliente: number = 0;

  // 📋 Contactos
  contactos: Contacto[] = [];

  // 📜 Datos del comprobante
  comprobante: any = null;
  mostrarModal = false;

  ngOnInit(): void {
    // 🧠 Cargar la cuenta desde localStorage
    const cuenta = localStorage.getItem('num_cuenta');
    const saldo = localStorage.getItem('saldo');

    if (cuenta) {
      this.cuentaOrigen = cuenta;
      console.log('✅ Cuenta origen cargada:', this.cuentaOrigen);
    } else {
      console.warn('⚠️ No se encontró cuenta origen en localStorage');
      this.router.navigate(['/login']);
      return;
    }

    this.saldoCliente = saldo ? parseFloat(saldo) : 0;

    // 🔹 Cargar contactos del usuario actual
    const idUsuario = localStorage.getItem('idUsuario');
    if (idUsuario) {
      this.http.get<Contacto[]>(`http://localhost:3001/api/contactos/${idUsuario}`).subscribe({
        next: (rows) => this.contactos = rows,
        error: (e) => console.error('❌ Error cargando contactos', e)
      });
    }
  }

  seleccionarContacto(c: Contacto) {
    this.destinatarioNombre = c.nombre_contacto;
    this.destinatarioCuenta = c.num_cuenta_destino;
  }

  onMontoChange() {
    const m = isNaN(this.monto) ? 0 : this.monto;
    this.iva = +(m * 0.07).toFixed(2);
    this.total = +(m + this.iva + this.comision).toFixed(2);
  }

  agregarCuenta() {
    this.router.navigate(['/agregar-contacto']);
  }

  transferir() {
    // 🧩 Validaciones antes de enviar
    if (!this.cuentaOrigen || !this.destinatarioCuenta) {
      alert('Completa los datos de la transferencia.');
      return;
    }

    if (this.monto <= 0) {
      alert('El monto debe ser mayor a 0.');
      return;
    }

    if (this.monto > this.saldoCliente) {
      alert(`No puedes transferir más de tu saldo disponible: $${this.saldoCliente.toFixed(2)}.`);
      return;
    }

    const payload = {
      cuenta_origen: this.cuentaOrigen,
      cuenta_destino: this.destinatarioCuenta,
      monto: this.monto,
      tipo_transferencia: this.tipoTransferencia,
      descripcion: this.concepto
    };

    this.http.post<any>('http://localhost:3001/api/transferencias', payload).subscribe({
      next: (resp) => {
        if (!resp?.ok) { 
          alert(resp?.msg || 'Ocurrió un problema en la transferencia.'); 
          return; 
        }

        // 🔥 Mostrar ventana del comprobante
        this.comprobante = resp.comprobante;
        this.mostrarModal = true;

        // 🔄 Actualiza saldo local
        this.saldoCliente -= this.total;
        localStorage.setItem('saldo', this.saldoCliente.toString());
      },
      error: (e) => {
        console.error('Error en transferencia', e);
        alert(e?.error?.msg || 'No fue posible realizar la transferencia.');
      }
    });
  }

  // 📄 Descargar comprobante como PDF
  descargarPDF() {
    const DATA = this.comprobantePDF.nativeElement;
    const doc = new jsPDF('p', 'mm', 'a4');
    const options = { background: 'white', scale: 3 };

    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      const bufferX = 10;
      const bufferY = 10;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight);
      doc.save(`Comprobante_${this.comprobante?.folio || 'transferencia'}.pdf`);
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  mask(num: string): string {
    return num ? num.replace(/\d(?=\d{3})/g, '•') : '';
  }
}
