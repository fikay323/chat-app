import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ChatPageComponent } from './chat-page/chat-page.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NavbarComponent, ChatPageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

}
