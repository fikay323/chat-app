import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AlertComponent } from '../alert/alert.component';
import socket from '../../socket';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, LoadingSpinnerComponent, AlertComponent, RouterModule]
})
export class RegisterComponent {
  isFetching = false
  errorMessage = this.authService.errorMessage

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

  register(registerForm: NgForm) {
    if(!registerForm.valid) return
    this.isFetching = true
    const user = {
      username: registerForm.value.username,
      password: registerForm.value.password
    }
    this.authService.signUp(user, this.isFetching)
  }
  closeAlertComponent() {
    this.errorMessage = null
  }
}