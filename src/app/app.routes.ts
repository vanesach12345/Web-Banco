import { Routes } from '@angular/router';

// Importa tus componentes
import { ClienteComponent } from './components/cliente/usuario';
import { TransferenciasComponent } from './components/transferencias/transferencias';
import { LoginHome } from './components/login/login';
import { SolicitudComponent } from './components/solicitud/solicitud';
import { GerenteComponent } from './components/gerente/gerente';
import { EjecutivoComponent } from './components/ejecutivo/ejecutivo';
import { AgregarContacto } from './components/agregar-contacto/agregar-contacto';
import{ ConsultasEjeComponent } from './components/consultas_eje/consultas_eje';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';


export const routes: Routes = [
  // Página inicial
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {path: 'consultas',component: ConsultasEjeComponent,
  data: { roles: [3] }},



  // Login y solicitud
  { path: 'login', component: LoginHome },
  { path: 'solicitud', component: SolicitudComponent },

 

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

  { path: 'cliente',   component: ClienteComponent, data: { roles: [1] } },
{ path: 'gerente',   component: GerenteComponent, data: { roles: [2] } },
{ path: 'ejecutivo', component: EjecutivoComponent, data: { roles: [3] } },



  // Página no encontrada
  { path: '**', redirectTo: '/login' }
];
