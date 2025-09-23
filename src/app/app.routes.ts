import { Routes } from '@angular/router';
import { LoginHome} from './components/login/login';
import { SolicitudComponent } from './components/solicitud/solicitud';
//no te olvides de poner las rutas de donde vas a jalar todo


export const routes: Routes = [
    //se escribe casi igual pero ponte vrgs
{ path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: 'login', component: LoginHome },
{path: 'solicitud', component: SolicitudComponent}

 
];
