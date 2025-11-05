import { Routes } from '@angular/router';

// Importa tus componentes
import { ClienteComponent } from './components/cliente/usuario';
import { TransferenciasComponent } from './components/transferencias/transferencias';
import { LoginHome } from './components/login/login';
import { SolicitudComponent } from './components/solicitud/solicitud';
import { GerenteComponent } from './components/gerente/gerente';
import { EjecutivoComponent } from './components/ejecutivo/ejecutivo';
import { AgregarContacto } from './components/agregar-contacto/agregar-contacto';
import { ConsultasEjeComponent } from './components/consultas_eje/consultas_eje';
import { RecuperacionComponent } from './components/recuperacion/recuperacion';
import { RestablecerComponent } from './components/restablecer/restablecer';

// Guards
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  //  Página inicial → redirige a login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  //  Login y solicitud de cuenta
  { path: 'login', component: LoginHome },
  { path: 'solicitud', component: SolicitudComponent },

  //  Recuperación y restablecimiento de contraseña
  { path: 'recuperacion', component: RecuperacionComponent },
  { path: 'restablecer', component: RestablecerComponent },

  //  Panel de ejecutivo
  { path: 'consultas', component: ConsultasEjeComponent, data: { roles: [3] } },

  //  Transferencias (solo cliente)
  {
    path: 'transferencias',
    component: TransferenciasComponent,
    data: { roles: [1] }
  },

  //  Agregar contacto (solo cliente)
  {
    path: 'agregar-contacto',
    component: AgregarContacto,
    data: { roles: [1] }
  },

  // Roles principales
  { path: 'cliente', component: ClienteComponent, data: { roles: [1] } },
  { path: 'gerente', component: GerenteComponent, data: { roles: [2] } },
  { path: 'ejecutivo', component: EjecutivoComponent, data: { roles: [3] } },
  {
  path: 'cliente',
  component: ClienteComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: [1] },
},
{
  path: 'gerente',
  component: GerenteComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: [2] },
},
{
  path: 'ejecutivo',
  component: EjecutivoComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: [3] },
},
{
  path: 'consultas',
  component: ConsultasEjeComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: [3] },
},


  // ❌ Ruta por defecto (404)
  { path: '**', redirectTo: '/login' }
];
