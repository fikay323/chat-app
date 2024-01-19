import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AlertComponent } from '../alert/alert.component';

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

  constructor(private authService: AuthService) {}

  login(loginForm: NgForm) {
    if(!loginForm.valid) return
    this.isFetching = true
    const user = {
      email: loginForm.value.email,
      password: loginForm.value.password
    }
    // this.authService.login(user).then(response => {
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