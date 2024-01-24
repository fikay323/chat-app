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
  allMessages: {[key: string]: Message[]}[] = []
  
  unRecievedMessages = () => {
    this.socket.on('unread_messages', (unreadMessages: Message[]) => {
      unreadMessages.map(messagesRecieved => {
        const isPresent = this.allMessages.find(uid => messagesRecieved.id in uid)
        if(isPresent) {
          Object.entries(isPresent)[0][1].push(messagesRecieved)
        } else {
          this.allMessages.push({ [messagesRecieved.id] : [messagesRecieved] })
        }
        localStorage.setItem(socket.id, JSON.stringify(this.allMessages))
        console.log(this.allMessages)
      })
    })
  }

  updateAllMessages(message: Message, id: string) {
    const isPresent = this.allMessages.find(userMessaged => id in userMessaged)
    if(isPresent) {
      Object.entries(isPresent)[0][1].push(message)
    } else {
      this.allMessages.push({ [id] : [message] })
    }
    localStorage.setItem(socket.id, JSON.stringify(this.allMessages))
  }
  
  sendMessage(message: Message) {
    this.socket.emit('send-message', message);
  }

  getNewMessage = () => {
    this.socket.on('receive-message', (message) =>{
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