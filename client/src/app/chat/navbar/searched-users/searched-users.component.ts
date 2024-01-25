import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() closeSearch: EventEmitter<void> = new EventEmitter

  constructor(private chatService: ChatService) {}

  selectUser(user) {
    this.chatService.selectUser(user)
    this.closeSearch.emit()
  }
}
