import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../../core/store/auth';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {

  navItems: NavItem[] = [
    { label: 'Productos',   icon: 'inventory_2',  route: '/products' },
    { label: 'Órdenes',     icon: 'shopping_cart', route: '/orders' },
    { label: 'Proveedores', icon: 'business',      route: '/suppliers' },
    { label: 'Stock',       icon: 'warehouse',     route: '/stock' },
    { label: 'Reportes',    icon: 'bar_chart',     route: '/reports',
      roles: ['ADMIN', 'AUDITOR', 'WAREHOUSE'] }
  ];

  constructor(public authStore: AuthStore) {}

  canShow(item: NavItem): boolean {
    if (!item.roles) return true;
    const userRoles = this.authStore.user()?.roles ?? [];
    return item.roles.some(r => userRoles.includes(r));
  }
}