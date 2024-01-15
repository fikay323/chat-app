import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {
  isFetching = false
  errorMessage = null

  constructor(private authService: AuthService) {}

  register(registerForm: NgForm) {
    if(!registerForm.valid) return
    this.isFetching = true
    const user = {
      email: registerForm.value.email,
      password: registerForm.value.password
    }
    // this.authService.signUp(user).then(response => {
    //   this.authService.handleAuthentication(response.user, this.isFetching)
    // })
    // .catch(error => {
    //   this.isFetching = false
    //   this.errorMessage = this.authService.handleError(error)
    // })
  }
  closeAlertComponent() {
    this.errorMessage = null
  }
}