import { ResolveFn, Router } from '@angular/router';
import socket from './socket';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';

export const authResolver: ResolveFn<boolean> = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  console.log(route)
  console.log(state)
  const isUserIDPresent = localStorage['userID']
  if(state.url === '/auth/login' || state.url === '/auth/register'){
    if (isUserIDPresent) {
      const userID = localStorage.getItem('userID');
      socket.auth = { userID: userID, auth: 'auto-login' };
      socket.connect();
      socket.on('connect', () => {
        if(socket.connected) {
          return router.navigate(['chat']);
        } else {
          return true
        }
      })
    } else {
      return true
    }
  } else {
    if (isUserIDPresent) {
      const userID = localStorage.getItem('userID');
      socket.auth = { userID: userID, auth: 'auto-login' };
      socket.connect()
      socket.on('connect', () => {
        if(socket.connected) {
          return true
        } else {
          return router.navigate(['auth/login']);
        }
      })
    } else {
      return router.navigate(['auth/login']);
    }
  }
  console.log(true)
  return true
};
