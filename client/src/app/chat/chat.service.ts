import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import socket from '../socket';
import { Message } from '../message.model';


@Injectable({
  providedIn: 'root',
})

export class ChatService {
  socket = socket
  message: Subject<Message> = new Subject();
  usersFound: Subject<[]> = new Subject();
  isTyping: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedUser: Subject<{username: string, userID: string}> = new Subject()
  constructor() {}
  
  
  sendMessage(message: Message) {
    this.socket.emit('send-message', message);
  }

  getNewMessage = () => {
    this.socket.on('recieve-message', (message) =>{
      this.message.next(message);
    });
    return this.message.asObservable();
  };

  emitStatus(isTyping: string) {
    this.socket.emit('typing-info', isTyping)
  }

  getStatus = () => {
    this.socket.on('typing', isTyping => {
      if(isTyping === 'Typing') {
        this.isTyping.next(true)
      }
      else {
        this.isTyping.next(false)
      }
    })
    return this.isTyping.asObservable()
  }

  searchUser(keyword: string) {
    socket.emit('search_user', keyword)
  }
  
  searchProduced() {
    socket.on('search_produced', users => {
      this.usersFound.next(users)
    })
    return this.usersFound.asObservable()
  }

  selectUser(user) {
    console.log(user)
    this.selectedUser.next(user)
  }
}