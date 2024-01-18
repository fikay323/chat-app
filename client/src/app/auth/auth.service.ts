import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import socket from '../socket';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  loader: boolean
  errorMessage: string = null
  isConnected = new BehaviorSubject<boolean>(false)
  constructor(private router: Router) {
    socket.on('connect', () => {
      this.isConnected.next(true)
    })
    socket.on('disconnect', () => {
      this.isConnected.next(false)
    })
  }

  ngOnInit() {
  }
  
  signUp(user: any, isLoading: boolean) {
    this.loader = isLoading
    const userToSend = {...user, auth: 'register'}
    socket.auth = { ...userToSend }
    socket.connect()
  }
  
  // login(user: any) {
  //   return this.afs.signInWithEmailAndPassword(user.email, user.password)
  // }

  // logout() {
  //   clearTimeout(this.logoutTimer)
  //   this.afs.signOut().then(() => {  
  //     this.User.next(null)
  //     localStorage.removeItem('userData')
  //     this.router.navigate(['/auth', 'login'])
  //   })
  // }

  // autoLogin() {
  //   if(localStorage['userData']) {
  //     const userData: {
  //       email: string,
  //       id: string,
  //       expiryDate: Date,
  //       _token: string,
  //     } = JSON.parse(localStorage.getItem('userData'))
  //     const user = new User(userData.email, userData.id, userData.expiryDate, userData._token)
  //     if(user.token) {
  //       const expiresIn = new Date(new Date(userData.expiryDate).getTime() - new Date().getTime())
  //       this.User.next(user)
  //       this.autoLogout(expiresIn.getTime())
  //     }
  //   }
  // }
    
  handleAuthentication(userdata, isFetching) {
    let currentDate = new Date();
    let newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 2)
    isFetching = false
    this.router.navigate(['/tasks/today'])
  }

  // handleError(error) {
  //   let errorMesssage = 'An unknown error occurred. Pls check your network connection and try again'
  //   switch(error.code){
  //     case ('auth/invalid-credential'): 
  //      errorMesssage = 'Username or password incorrect'
  //     break;
  //     case ('auth/too-many-requests'): 
  //      errorMesssage = 'To many requests, try again later'
  //     break;
  //     case ('auth/email-already-in-use'): 
  //      errorMesssage = 'An account has registered with this email address, try signing in'
  //     break;
  //   }
  //   return errorMesssage
  // }
}