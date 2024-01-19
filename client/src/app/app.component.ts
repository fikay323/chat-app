import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import socket from './socket'
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule],
  standalone: true
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit() {
    this.authService.autoLogin()
    socket.on('connect_error', err => {
      this.authService.is = false
      localStorage.removeItem('userID')
      this.router.navigate(['auth/login'])
    })
  }
}