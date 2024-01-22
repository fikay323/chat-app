import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Message } from '../../message.model';
import { AuthService } from '../../auth/auth.service';
import { ChatService } from '../chat.service';
import socket from '../../socket';
import { map } from 'rxjs';

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
  username: string
  displayTyping = false
  changed = false

  constructor(private authService: AuthService, private chatService: ChatService){}

  ngOnInit(){
    this.authService.userConnected.subscribe(data => {
      this.username = data.username
    })
    this.chatService.getStatus().subscribe(istyping => {
      this.displayTyping = istyping
    })
    this.chatService.getNewMessage().subscribe(message => {
      this.messages.push(message)
    })
    this.chatService.selectedUser.subscribe(user => {
      
    })
  }

  submitForm(input: HTMLInputElement) {
    let message = new Message(input.value, this.socket.id)
    this.messages.push(message)
    this.chatService.sendMessage(message)
    this.changed = false
    input.value = ''
    this.chatService.emitStatus('Not typing')
  }

  checkTyping(event: any) {
    const message = event.target.value
    if(message != '' && this.changed == false) {
      this.changed = true
      this.chatService.emitStatus('Typing')
    } else if(message == '' && this.changed == true) {
      this.changed = false
      this.chatService.emitStatus('Not typing')
    }
  }
}
