import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-searched-users',
  standalone: true,
  imports: [],
  templateUrl: './searched-users.component.html',
  styleUrl: './searched-users.component.css'
})
export class SearchedUsersComponent {
  @Input('user') user
}
