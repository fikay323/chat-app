import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../chat.service';
import { SearchedUsersComponent } from './searched-users/searched-users.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: true,
    selector: 'app-navbar',
    styleUrls: ['navbar.component.css'],
    templateUrl: 'navbar.component.html',
    imports: [CommonModule, FormsModule, SearchedUsersComponent],
})
export class NavbarComponent {
  searchString: string
  timer: any
  username: string
  usersFound: {username: string, userID: string}[] = []

  constructor(private authService: AuthService, private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.searchProduced().subscribe(users => {
      this.usersFound = users
    })
    this.authService.userConnected.subscribe(data => {
      this.username = data.username
    })
    this.search('a')
  }

  search(keyword: string) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if(keyword.trim().length > 0) {
        this.chatService.searchUser(keyword)
      }
    },1000)
  }
};
