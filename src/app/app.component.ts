import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services/auth.service';
import { User, UserRole } from './core/models/user.model';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'RentalManager';
  isSidebarCollapsed = false;
  currentUser: User | null = null;
  isAuthenticated = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Token presence is the source of truth for authenticated shell.
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = this.authService.isAuthenticated();
    });

    // Close sidebar by default on home page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/home') {
          this.isSidebarCollapsed = true;
        }
      });

    // Check initial route
    if (this.router.url === '/home') {
      this.isSidebarCollapsed = true;
    }
  }

  get isHomePage(): boolean {
    return this.router.url === '/home';
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const firstInitial = this.currentUser.firstName?.charAt(0) || '';
    const lastInitial = this.currentUser.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  getUserFullName(): string {
    if (!this.currentUser) return 'User';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`.trim() || this.currentUser.email;
  }

  getRoleDisplay(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role === UserRole.OWNER ? 'Property Owner' : 'Tenant';
  }

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  get isAuthPage(): boolean {
    const url = this.router.url;
    return url === '/login' || url === '/signup' || url === '/forgot-password';
  }
}
