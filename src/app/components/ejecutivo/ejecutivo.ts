import { Component } from '@angular/core';
import {  RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'panel-ejecutivo',
  standalone: true,
  templateUrl: './ejecutivo.html',
  styleUrls: ['./ejecutivo.css'],
    imports: [RouterModule,],


})
export class EjecutivoComponent {
constructor(private Router:Router){}
  consuktasclick(): void{this.Router.navigate(['/consultas']);}
}