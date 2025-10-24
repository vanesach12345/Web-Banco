import { Routes } from '@angular/router';

// Importa tus componentes
import { ClienteComponent } from './components/cliente/usuario';
import { TransferenciasComponent } from './components/transferencias/transferencias';
import { LoginHome } from './components/login/login';
import { SolicitudComponent } from './components/solicitud/solicitud';
import { GerenteComponent } from './components/gerente/gerente';
import { EjecutivoComponent } from './components/ejecutivo/ejecutivo';
import { AgregarContacto } from './components/agregar-contacto/agregar-contacto';

export const routes: Routes = [
  // Página inicial
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Login y solicitud
  { path: 'login', component: LoginHome },
  { path: 'solicitud', component: SolicitudComponent },

  // Panel del cliente
  {
    path: 'cliente',
    component: ClienteComponent,
    data: { roles: [1] }
  },

  // Transferencias
  {
    path: 'transferencias',
    component: TransferenciasComponent,
    data: { roles: [1] }
  },

  // ✅ Nueva ruta: comprobante de transferencia


  // Agregar contacto / cuenta
  {
    path: 'agregar-contacto',
    component: AgregarContacto,
    data: { roles: [1] }
  },

  // Panel del gerente
  {
    path: 'gerente',
    component: GerenteComponent,
    data: { roles: [2] }
  },

  // Panel del ejecutivo
  {
    path: 'ejecutivo',
    component: EjecutivoComponent,
    data: { roles: [3] }
  },

  // Página no encontrada
  { path: '**', redirectTo: '/login' }
];
