import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import socket from '../socket';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isFetching: BehaviorSubject<boolean> = new BehaviorSubject(false)
  errorMessage: BehaviorSubject<string> = new BehaviorSubject(null)
  isConnected = new BehaviorSubject<boolean>(false)
  userConnected = new BehaviorSubject<User>(null)


  constructor(private router: Router) {}
  
  signUp(user: any) {
    const userToSend = {...user, auth: 'register'}
    socket.auth = { ...userToSend }
    socket.connect()
  }
  
  login(user: any) {
    socket.auth = {...user, auth: 'login'}
    socket.connect()
  }

  logOut() {
    this.isFetching.next(false)
    localStorage.removeItem('userID')
    this.isConnected.next(false)
    this.router.navigate(['auth/login'])
  }

  autoLogin() {
    const isUserIDPresent = localStorage['userID']
    if (isUserIDPresent) {
      const userID = localStorage.getItem('userID');
      socket.auth = { userID: userID, auth: 'auto-login' };
      socket.connect();
    }
    this.userConnected.pipe(tap(user => {
    socket.on('connect', () => {
      if(socket.connected && user) {
       this.router.navigate(['chat']);
      }
    })
  }))
  }
}