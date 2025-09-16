import { Component } from '@angular/core';
import {  RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'panel-ejecutivo',
  standalone: true,
  templateUrl: './panel-ejecutivo.html',
  styleUrls: ['./panel-ejecutivo.css'],
    imports: [RouterModule, RouterLink, RouterLinkActive],

})
export class panelejecutivo {}