import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import socket from './socket'
import { AuthService } from './auth/auth.service';
import { ChatService } from './chat/chat.service';

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
    socket.on('connect', () => {
      this.authService.isFetching.next(false)
      this.authService.isConnected.next(true)
      localStorage.setItem('userID', socket.id)
      this.router.navigate(['chat'])
    })
    socket.on('connect_error', err => {
      this.authService.errorMessage.next(err.message)
      this.authService.logOut()
    })
    socket.on('session', userData => {
      this.authService.userConnected.next(userData)
    })
  }
}