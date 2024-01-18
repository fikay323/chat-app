import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import socket from './socket'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule],
  standalone: true
})
export class AppComponent {
  constructor(private router: Router) {}
}