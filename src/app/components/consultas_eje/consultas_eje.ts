import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'panel-consultas-eje',
  standalone: true,
  templateUrl: './consultas_eje.html',
  styleUrls: ['./consultas_eje.css'],
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [DatePipe, CurrencyPipe],
})
export class ConsultasEjeComponent {
  transacciones: any[] = [];
  transaccionSeleccionada: any = null;
  isTransaccionVisible: boolean = false;
  
  // Datos para las tarjetas
  totalCuentas: number = 0;
  solicitudesPendientes: number = 0;
  cuentasCerradas: number = 0;
  totalMovimientos: number = 0;

  filter = {
    tipoMovimiento: '',
    numeroCuenta: '',
    usuario: '',
    fecha: ''
  };

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTransacciones();
    this.getDashboardData(); // Llamar a la función para obtener los datos de las tarjetas
  }
// Componente Angular para el dashboard
getDashboardData(): void {
  this.http.get<any>('http://localhost:3001/api/dashboard').subscribe(
    (data) => {
      this.totalCuentas = data.totalCuentas || 0;
      this.solicitudesPendientes = data.solicitudesPendientes || 0;
      this.cuentasCerradas = data.cuentasCerradas || 0;
      this.totalMovimientos = data.totalMovimientos || 0;
      
    },
    (error) => {
      console.error('Error al obtener los datos del dashboard:', error);
    }
  );
}

  // Obtener transacciones con los filtros aplicados
  getTransacciones(): void {
    const apiUrl = 'http://localhost:3001/api/transacciones'; 
    let url = apiUrl;
    let params = [];

    if (this.filter.tipoMovimiento) params.push(`tipoMovimiento=${this.filter.tipoMovimiento}`);
    if (this.filter.numeroCuenta) params.push(`numeroCuenta=${this.filter.numeroCuenta}`);
    if (this.filter.usuario) params.push(`usuario=${this.filter.usuario}`);
    if (this.filter.fecha) params.push(`fecha=${this.filter.fecha}`);

    if (params.length > 0) {
      url = `${apiUrl}?${params.join('&')}`;
    }

    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.transacciones = data;
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error al obtener las transacciones:', error);
      }
    );
  }

  // Método para aplicar los filtros
  aplicarFiltros(): void {
    this.getTransacciones();
  }

  limpiarFiltros(): void {
    this.filter = {
      tipoMovimiento: '',
      numeroCuenta: '',
      usuario: '',
      fecha: ''
    };
    this.getTransacciones(); 
  }

  seleccionarTransaccion(transaccion: any): void {
    if (this.transaccionSeleccionada === transaccion) {
      this.isTransaccionVisible = !this.isTransaccionVisible;
    } else {
      this.transaccionSeleccionada = transaccion;
      this.isTransaccionVisible = true;
    }
    this.cdRef.detectChanges();
  }

  // Generar PDF para la transacción seleccionada
  exportToPDF(): void {
    if (!this.transaccionSeleccionada) {
      console.log('Por favor, selecciona una transacción');
      return;
    }

    const doc = new jsPDF();
    const headers = ['Descripción', 'Fecha', 'Categoría', 'Cuenta de Origen', 'Monto', 'Estado'];

    (doc as any).autoTable({
      head: [headers],
      body: [
        [
          this.transaccionSeleccionada.descripcion,
          this.transaccionSeleccionada.fecha,
          this.transaccionSeleccionada.tipo_movimiento,
          this.transaccionSeleccionada.id_cuenta_origen,
          this.transaccionSeleccionada.monto,
          this.transaccionSeleccionada.estado
        ]
      ]
    });

    doc.save(`comprobante_transaccion_${new Date().getTime()}.pdf`);
  }
  
}
