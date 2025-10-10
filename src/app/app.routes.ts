import { Routes } from '@angular/router';
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
];
