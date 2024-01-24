import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { ChatService } from './chat/chat.service';
import { Message } from './message.model';
import socket from './socket';

export const ChatResolver: ResolveFn<{[key: string]: Message[]}[]> = (route, state) => {
  const chatService = inject(ChatService)
  if(localStorage[`${socket.id}`]) {
    const savedArray = JSON.parse(localStorage.getItem(`${socket.id}`))
    chatService.allMessages = savedArray
    return savedArray
  }
  return []
};
