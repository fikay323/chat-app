import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AlertComponent } from '../alert/alert.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, LoadingSpinnerComponent, AlertComponent, RouterModule]
})
export class RegisterComponent {
  isFetching = this.authService.isFetching
  errorMessage = this.authService.errorMessage

  constructor(private authService: AuthService){}

  register(registerForm: NgForm) {
    if(!registerForm.valid) return
    this.isFetching = true
    const user = {
      username: registerForm.value.username,
      password: registerForm.value.password
    }
    this.authService.signUp(user)
  }

  closeAlertComponent() {
    this.errorMessage = null
  }
}