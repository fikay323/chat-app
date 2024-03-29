import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Message } from '../../message.model';
import { ChatService } from '../chat.service';
import socket from '../../socket';
import { SelectedUser } from '../../selected-user.model';
import { ChatStartComponent } from '../chat-start/chat-start.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, ChatStartComponent, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {
  messages: Message[] = []
  @ViewChild('scrollMe') private scrollContainer: ElementRef
  socket = socket
  typingMessage = 'User is typing'
  user: SelectedUser
  username = this.chatService.username
  displayTyping = false
  changed = false
  isInputFocused = false

  constructor(private chatService: ChatService){}

  ngOnInit(){
    this.chatService.unRecievedMessages()
    this.chatService.getStatus().subscribe(istyping => {
      this.displayTyping = istyping
    })
    this.chatService.selectedUser.subscribe(user => {
      if(this.user !== user || this.messages.length === 0){
        this.user = user
        const filtered = this.chatService.allMessages.find(userMessages => {
          return Object.keys(userMessages)[0] === user.userID
        })
        if(filtered) {
          this.messages = filtered[user.userID]
          this.scrollToBottom()
        } else {
          this.messages = []
        }
      } else {
        console.log('idiot')
      }
    })
  }

  ngAfterViewChecked() {
    if(!this.isInputFocused) {
      this.scrollToBottom()
    }
  }

  onInputFocus() {
    this.isInputFocused = true
  }

  onInputBlur() {
    this.isInputFocused = false
  }

  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
    } catch (error) {
    }
  }

  submitForm(messageForm: NgForm) {
    let message = new Message(messageForm.value['message'], this.socket.id, this.user.userID, this.username)
    this.scrollToBottom()
    this.chatService.sendMessage(message)
    this.chatService.updateAllMessages(message, this.user)
    messageForm.setValue({
      "message": ''
    })
  }

  checkTyping(event: any) {
    const message = event
    if(message != '' && this.changed == false) {
      this.changed = true
      this.chatService.emitStatus('Typing')
    } else if(message == '' && this.changed == true) {
      this.changed = false
      this.chatService.emitStatus('Not typing')
    }
  }
}