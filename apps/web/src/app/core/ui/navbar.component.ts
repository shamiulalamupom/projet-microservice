import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="brand">
        <a routerLink="/trips" routerLinkActive="active">TP Autonomie</a>
      </div>
      <div class="links">
        <a routerLink="/trips" routerLinkActive="active">Trips</a>
        @if (isLoggedIn()) {
          <a routerLink="/reservations/me" routerLinkActive="active">My reservations</a>
        }
        @if (isManager()) {
          <a routerLink="/manager/trips/create" routerLinkActive="active">Manager</a>
        }
      </div>
      <div class="actions">
        @if (!isLoggedIn()) {
          <a class="btn secondary" routerLink="/login">Login</a>
          <a class="btn" routerLink="/register">Register</a>
        } @else {
          <span class="user">{{ currentUser()?.email }}</span>
          <button type="button" class="btn secondary" (click)="logout()">Logout</button>
        }
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1.25rem;
        background: #111827;
        color: #e5e7eb;
        gap: 1rem;
      }
      .brand a {
        color: #f9fafb;
        font-weight: 700;
        font-size: 1.1rem;
      }
      .links {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }
      .links a {
        color: #e5e7eb;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .btn.secondary {
        background: #e5e7eb;
        color: #111827;
        padding: 0.35rem 0.8rem;
      }
      .btn {
        padding: 0.4rem 0.95rem;
      }
      .user {
        font-size: 0.9rem;
        color: #cbd5e1;
      }
      a.active {
        text-decoration: underline;
      }
    `,
  ],
})
export class NavbarComponent {
  readonly currentUser = computed(() => this.auth.user());
  readonly isLoggedIn = computed(() => this.auth.isAuthenticated());

  constructor(private readonly auth: AuthService) {}

  isManager() {
    return this.auth.hasRole('manager');
  }

  logout() {
    this.auth.logout();
  }
}
