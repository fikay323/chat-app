import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../chat.service';
import { Subject } from 'rxjs';
import { SearchedUsersComponent } from './searched-users/searched-users.component';

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
  usersFound = []

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.searchProduced().subscribe(users => {
      this.usersFound = users
      console.log(users)
    })
  }

  search(keyword: string) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if(keyword.trim().length > 0) {
        console.log(keyword.trim())
        this.chatService.searchUser(keyword)
      }
    },1000)
  }
};
