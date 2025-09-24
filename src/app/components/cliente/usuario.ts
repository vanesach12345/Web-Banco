import { Component } from '@angular/core';
//no te olvides de estas dos pedo
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login-home',
  standalone: true,    
  //poner librerias se utilizan pal boton redireccionamiento
  imports: [CommonModule],
  templateUrl: './usuario.html',
  styleUrls: ['./cliente.css']
  
})
//otorgar nombre diferente a los demas para que en app.router.ts le digas de donde vas a agarrar
//la redireccion
export class ClienteComponent {}

