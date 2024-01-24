import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import socket from '../socket';
import { BehaviorSubject } from 'rxjs';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isFetching: boolean = false
  errorMessage: string = null
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

  autoLogin() {
    // if(localStorage['userID']) {
    //   const userID = localStorage.getItem('userID')
    //   socket.auth = { userID: userID, auth: 'auto-login' }
    //   socket.connect()
    // }
  }
}