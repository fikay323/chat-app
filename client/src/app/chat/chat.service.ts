import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import socket from '../socket';
import { Message } from '../message.model';
import { SelectedUser } from '../selected-user.model';


@Injectable({
  providedIn: 'root',
})

export class ChatService {
  socket = socket
  message: Subject<Message> = new Subject();
  usersFound: Subject<[]> = new Subject();
  isTyping: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedUser: Subject<SelectedUser> = new Subject()
  allMessages: {[key: string]: Message[]}[] = [
    { 'caf8926d-3c59-405c-a727-238dd14e6c41': [new Message('didig', '7'), new Message('rarag', '8')] },
    { '2802a62c-8d6e-43a0-b123-6003e6a1680b': [new Message('didi', '7'), new Message('rara', '8')] },
    { 'c2973128-66bc-4bdd-ac59-4030649bc6ad': [new Message('didib', '7'), new Message('rarab', '8')] },
    { '714d4762-438f-4017-a678-f3a1f0c4c8da': [new Message('didic', '7'), new Message('rarac', '8')] },
    { 'a56ec664-7705-48b8-b3c2-7b0b3c6ec0ce': [new Message('didid', '7'), new Message('rarad', '8')] },
  ]

  constructor() {
    // this.allMessages.map(entry => {
    //   const enter = Object.entries(entry)[0][1]
    //   console.log(Object.entries(entry)[0][0])
    //   console.log(enter)
    // })
    // this.allMessages.map(entry => {
    //   if(Object.keys(entry)[0] === '2802a62c-8d6e-43a0-b123-6003e6a1680b') {
    //     console.log(true)
    //   } else {
    //     console.log(false)
    //   }
    // })
    const filtered = this.allMessages.find(entry => {
      return Object.keys(entry)[0] === '2802a62c-8d6e-43a0-b123-6003e6a1680b'
    })
    // console.log(filtered['2802a62c-8d6e-43a0-b123-6003e6a1680b'])
  }
  
  
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

  selectUser(user: SelectedUser) {
    this.selectedUser.next(user)
  }
}