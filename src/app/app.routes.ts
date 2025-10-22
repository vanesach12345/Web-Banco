import { Routes } from '@angular/router';
<<<<<<< HEAD

// Importa tus componentes
import { ClienteComponent } from './components/cliente/usuario';
import { TransferenciasComponent } from './components/transferencias/transferencias';
import { LoginHome } from './components/login/login';
import { SolicitudComponent } from './components/solicitud/solicitud';
import { GerenteComponent } from './components/gerente/gerente';
import { EjecutivoComponent } from './components/ejecutivo/ejecutivo';
import { AgregarContacto } from './components/agregar-contacto/agregar-contacto'; // 👈 IMPORTANTE

// Si usas guards
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Rutas públicas
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginHome },
  { path: 'solicitud', component: SolicitudComponent },

  // Panel del cliente
  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [1] }
  },

  // Transferencias
  {
    path: 'transferencias',
    component: TransferenciasComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [1] }
  },

  // Nueva ruta para "Agregar Cuenta"
  {
    path: 'agregar-contacto',          // 👈 URL
    component: AgregarContacto,        // 👈 componente
    canActivate: [authGuard, roleGuard],
    data: { roles: [1] }               // 👈 mismo rol del cliente
  },

  // Paneles gerente y ejecutivo
  {
    path: 'gerente',
    component: GerenteComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [2] }
  },
  {
    path: 'ejecutivo',
    component: EjecutivoComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [3] }
  },

  // Página no encontrada
  { path: '**', redirectTo: '/login' }
=======
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

import { LoginHome } from './components/login/login';
import { SolicitudComponent } from './components/solicitud/solicitud';
import { ClienteComponent } from './components/cliente/usuario';
import { GerenteComponent } from './components/gerente/gerente';
import { EjecutivoComponent } from './components/ejecutivo/ejecutivo';
import { Recuperacion } from './components/recuperacion/recuperacion'; 

export const routes: Routes = [
  // públicas
  { path: 'login', component: LoginHome },
  { path: 'solicitud', component: SolicitudComponent },
  { path: 'recuperacion', component: Recuperacion }, 

  // protegidas por rol
  { path: 'cliente',   component: ClienteComponent,   canActivate: [authGuard, roleGuard], data: { roles: [1] } },
  { path: 'gerente',   component: GerenteComponent,   canActivate: [authGuard, roleGuard], data: { roles: [2] } },
  { path: 'ejecutivo', component: EjecutivoComponent, canActivate: [authGuard, roleGuard], data: { roles: [3] } },

  // redirects
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
>>>>>>> 7734e7b69d439d07ee577c433058e30a36d2cc37
];
