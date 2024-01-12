import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public message: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {}
  
  
  // public sendMessage(message: any) {
  //   console.log(this.socket);
  //   console.log('sendMessage: ', message)
  //   this.socket.emit('message', message);
  // }

  // public getNewMessage = () => {
  //   this.socket.on('recieve-message', (message) =>{
  //     this.message.next(message);
  //   });
  //   return this.message.asObservable();
  // };
}