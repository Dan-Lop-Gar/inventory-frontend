import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthStore } from '../../../core/store/auth';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    //RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDivider
],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  constructor(public authStore: AuthStore) {}

  logout(): void {
    this.authStore.logout();
  }
}