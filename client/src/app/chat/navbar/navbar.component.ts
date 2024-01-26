import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../chat.service';
import { SearchedUsersComponent } from './searched-users/searched-users.component';
import { AuthService } from '../../auth/auth.service';
import { SelectedUser } from '../../selected-user.model';

@Component({
  standalone: true,
    selector: 'app-navbar',
    styleUrls: ['navbar.component.css'],
    templateUrl: 'navbar.component.html',
    imports: [CommonModule, FormsModule, SearchedUsersComponent],
})
export class NavbarComponent {
  searchString: string = ''
  isSearching: boolean = false
  isSearchFound: boolean = false
  timer: any
  username: string = this.chatService.username
  usersFound: SelectedUser[] = []
  usersChatted: SelectedUser[] = this.chatService.allUsers

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.searchProduced().subscribe(users => {
      if(users.length > 0) {
        this.usersFound = users
        this.isSearchFound = true
      } else {
        this.isSearchFound = false
      }
      this.isSearching = false
    })
    this.search('ai')
  }

  clearSearch() {
    this.isSearchFound = false
    this.isSearching = false
    this.usersFound = []
    this.searchString = ''
  }

  search(keyword: string) {
    clearTimeout(this.timer)
    this.isSearching = true
    this.timer = setTimeout(() => {
      if(keyword.trim().length > 0) {
        this.chatService.searchUser(keyword)
      } else {
        this.isSearching = false
      }
    },1000)
  }
};
