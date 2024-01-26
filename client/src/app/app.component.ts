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
    this.authService.isConnected.subscribe(data => {
      console.log(data)
    })
    this.authService.autoLogin()
    socket.on('connect', () => {
      this.authService.isFetching.next(false)
      this.authService.isConnected.next(true)
      // localStorage.setItem('userID', socket.id)
      this.router.navigate(['chat'])
    })
    socket.on('connect_error', err => {
      console.log('hit')
      this.authService.isFetching.next(false)
      this.authService.errorMessage.next(err.message)
      localStorage.removeItem('userID')
      this.authService.isConnected.next(false)
      this.router.navigate(['auth/login'])
    })
    socket.on('session', userData => {
      this.authService.userConnected.next(userData)
    })
  }
}