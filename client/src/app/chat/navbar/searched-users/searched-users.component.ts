import { Component, Input } from '@angular/core';
import { ChatService } from '../../chat.service';
import { SelectedUser } from '../../../selected-user.model';

@Component({
  selector: 'app-searched-users',
  standalone: true,
  imports: [],
  templateUrl: './searched-users.component.html',
  styleUrl: './searched-users.component.css'
})
export class SearchedUsersComponent {
  @Input('user') user: SelectedUser

  constructor(private chatService: ChatService) {}

  selectUser(user) {
    this.chatService.selectUser(user)
  }
}
