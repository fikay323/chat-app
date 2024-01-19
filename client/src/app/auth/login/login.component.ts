import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AlertComponent } from '../alert/alert.component';
import socket from '../../socket';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, RouterModule, LoadingSpinnerComponent, AlertComponent]
})
export class LoginComponent {
  isFetching = false
  errorMessage = null

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    socket.on('connect', () => {
      this.isFetching = false
      this.router.navigate(['chat'])
    })
    socket.on('connect_error', (message) => {
      this.errorMessage = message.message
    })
  }

  login(loginForm: NgForm) {
    if(!loginForm.valid) return
    this.isFetching = true
    const user = {
      email: loginForm.value.username,
      password: loginForm.value.password
    }
    this.authService.login(user, this.isFetching)
  }

  closeAlertComponent() {
    this.errorMessage = null
  }

}