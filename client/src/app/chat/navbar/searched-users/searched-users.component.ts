import { Component, Input } from '@angular/core';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-searched-users',
  standalone: true,
  imports: [],
  templateUrl: './searched-users.component.html',
  styleUrl: './searched-users.component.css'
})
export class SearchedUsersComponent {
  @Input('user') user: {username: string, userID: string}

  constructor(private chatService: ChatService) {}

  selectUser(user) {
    this.chatService.selectUser(user)
  }
}
