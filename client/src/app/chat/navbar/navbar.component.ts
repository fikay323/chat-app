import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
    selector: 'app-navbar',
    styleUrls: ['navbar.component.css'],
    templateUrl: 'navbar.component.html',
    imports: [CommonModule, FormsModule],
})
export class NavbarComponent {
  searchString: string
  timer: any

  search(val) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      
    },1000)
  }
};
