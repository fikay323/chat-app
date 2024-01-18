import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Message } from '../../message.model';
import { ChatService } from '../chat.service';
import { v4 } from 'uuid';
import socket from '../../socket';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {
  messagess: string[] = ['efdd', 'dvjdld', 'vidjdo9jdo', 'nkdjnvid', 'fdbhjf', 'sndsjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjsndsjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjsndsjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjsndsjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj']
  messages: Message[] = []
  socket = socket
  typingMessage = 'User is typing'
  displayTyping = false
  @ViewChildren('li') messageItems: QueryList<ElementRef>
  sessionID: string
  username = ''

  constructor(private chatService: ChatService){}

  ngOnInit(){
    this.sessionID = localStorage.getItem('sessionID')
    if(!this.sessionID) {
      this.sessionID = v4()
      localStorage.setItem('sessionID', this.sessionID)
    }
    console.log(socket)
    console.log(this.socket['user'])
    this.socket.on('recieve-message', message => {
      this.messages.push(message)
    })
    this.socket.on('typing', isTyping => {
      if(isTyping === 'Typing') {
        this.displayTyping = true
      }
      else {
        this.displayTyping = false
      }
    })
  }
  disconnect = true
  changeConnect() {
    if(this.disconnect) {
      this.socket.disconnect()
      this.disconnect = false
      
    } else {
      this.socket.connect()
      this.disconnect = true
    }
  }

  submitForm(input: HTMLInputElement) {
    let message = new Message(input.value, this.socket.id)
    this.messages.push(message)
    this.socket.emit('send-message', message)
    this.changed = false
    input.value = ''
    this.emitStatus('Not typing')
  }

  
  changed = false
  emitStatus(isTyping: string) {
    this.socket.emit('typing-info', isTyping)
  }

  checkTyping(event: any) {
    const message = event.target.value
    if(message != '' && this.changed == false) {
      console.log('Started Typing')
      this.changed = true
      this.emitStatus('Typing')
    } else if(message == '' && this.changed == true) {
      console.log('Stopped Typing')
      this.changed = false
      this.emitStatus('Not typing')
    }
    
  }

  joinRoom(roomId: string) {
    console.log(roomId)
    this.socket.emit('join-room', roomId)
  }
}
