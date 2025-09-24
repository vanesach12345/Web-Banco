import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LoginHome } from './components/login/login';
import { SolicitudComponent } from './components/solicitud/solicitud';

import{ClienteComponent} from './components/cliente/usuario';
import{GerenteComponent} from'./components/gerente/gerente';
import{EjecutivoComponent} from './components/ejecutivo/ejecutivo';
//no te olvides de poner las rutas de donde vas a jalar todo


export const routes: Routes = [
    //se escribe casi igual pero ponte vrgs
{ path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: 'login', component: LoginHome  },
{path: 'solicitud', component: SolicitudComponent},
 { path: 'cliente',   component: ClienteComponent,  canActivate: [authGuard, roleGuard], data: { roles: [1] } },
  { path: 'gerente',   component: GerenteComponent,  canActivate: [authGuard, roleGuard], data: { roles: [2] } },
  { path: 'ejecutivo', component: EjecutivoComponent,canActivate: [authGuard, roleGuard], data: { roles: [3] } },

 
];
