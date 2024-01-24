import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import socket from './socket';
import { Message } from './message.model';
import { ChatService } from './chat/chat.service';

export const ChatResolver: ResolveFn<{[key: string]: Message[]}[]> = (route, state) => {
  const chatService = inject(ChatService)
  if(localStorage[`${socket.id}`]) {
    const savedArray = JSON.parse(localStorage.getItem(`${socket.id}`))
    chatService.allMessages = savedArray
    return savedArray
  }
  return []
};
