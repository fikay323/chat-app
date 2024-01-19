import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const chatGuard = (route, state) => {
  return inject(AuthService).isConnected.subscribe(value => {
    if(value === true) {
      console.log(value)
      return true
    } else {
      console.log(value)
      return inject(Router).navigate(['auth/login'])
    }
  })
};
