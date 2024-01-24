import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const chatGuard = (route, state) => {
  return inject(AuthService).isConnected.subscribe(value => {
    console.log(value)
    if(value === true) {
      return true
    } else {
      return true
      return inject(Router).navigate(['auth/login'])
    }
  })
};
