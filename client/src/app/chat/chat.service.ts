import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import socket from '../socket';
import { Message } from '../message.model';
import { SelectedUser } from '../selected-user.model';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root',
})

export class ChatService {
  socket = socket
  username: string
  message: Subject<Message> = new Subject();
  usersFound: Subject<[]> = new Subject();
  isTyping: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedUser: Subject<SelectedUser> = new Subject()
  allMessages: {[key: string]: Message[]}[] = []
  allUsers: SelectedUser[] = []

  constructor(private authService: AuthService) {
    this.authService.userConnected.subscribe(data => {
      this.username = data.username
    })
  }
  
  unRecievedMessages = () => {
    this.socket.on('unread_messages', (unreadMessages: Message[]) => {
      unreadMessages.map(messagesRecieved => {
        const isPresent = this.allMessages.find(uid => messagesRecieved.id in uid)
        if(isPresent) {
          Object.entries(isPresent)[0][1].push(messagesRecieved)
        } else {
          this.allMessages.push({ [messagesRecieved.id] : [messagesRecieved] })
        }
        const chatPresent = this.allUsers.find(uid => messagesRecieved.id === uid.userID)
        if(chatPresent) {
          const index = this.allUsers.indexOf(chatPresent)
          this.allUsers.splice(index, 1)
          this.allUsers.unshift(chatPresent)
        } else {
          this.allUsers.unshift(new SelectedUser(messagesRecieved.from, messagesRecieved.id))
        }
        // this.saveToLocalStorage()
      })
    })
  }

  saveToLocalStorage() {
    const allData  = [{allMessages: this.allMessages}, {usersChatted: this.allUsers}]
    localStorage.setItem(`${socket.id}`, JSON.stringify(allData))
  }

  updateAllMessages(message: Message, user: SelectedUser) {
    const isPresent = this.allMessages.find(userMessaged => user.userID in userMessaged)
    if(isPresent) {
      Object.entries(isPresent)[0][1].push(message)
    } else {
      this.allMessages.push({ [user.userID] : [message] })
      this.selectedUser.next(user)
    }
    this.updateAllUsers(user)
  }

  updateAllUsers(user: SelectedUser){
    const userFound = this.allUsers.find((users) => users.userID === user.userID)
    if(userFound) {
      const index = this.allUsers.indexOf(userFound)
      this.allUsers.splice(index, 1)
      this.allUsers.unshift(user)
    } else {
      this.allUsers.unshift(user)
    }
    // this.saveToLocalStorage()
  }
  
  sendMessage(message: Message) {
    this.socket.emit('send-message', message);
  }

  getNewMessage = () => {
    this.socket.on('receive-message', (message: Message) =>{
      this.message.next(message);
      console.log(message)
      const isPresent = this.allMessages.find(userMessaged => message.id in userMessaged)
      if(isPresent) {
        Object.entries(isPresent)[0][1].push(message)
      } else {
        this.allMessages.push({ [message.id] : [message] })
      }
      const user: SelectedUser = new SelectedUser(message.from, message.id)
      this.updateAllUsers(user)
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