import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from './token.store';
import { AuthApi, AuthResponse, LoginRequest, RegisterRequest } from '../../features/auth/auth.api';
import { tap } from 'rxjs';
import { TokenStore } from './token.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<AuthUser | null>(null);
  readonly user = computed(() => this.currentUser());
  readonly isAuthenticated = computed(() => !!this.tokenStore.getToken());

  constructor(
    private readonly authApi: AuthApi,
    private readonly tokenStore: TokenStore,
    private readonly router: Router
  ) {
    this.currentUser.set(this.tokenStore.getUser());
  }

  login(body: LoginRequest) {
    return this.authApi.login(body).pipe(tap((res) => this.persistAuth(res)));
  }

  register(body: RegisterRequest) {
    return this.authApi.register(body).pipe(tap((res) => this.persistAuth(res)));
  }

  loadProfile() {
    return this.authApi.me().pipe(tap((user) => this.setUser(user)));
  }

  logout() {
    this.tokenStore.clearAll();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  private persistAuth(res: AuthResponse) {
    if (res.token) {
      this.tokenStore.setToken(res.token);
    }
    if (res.user) {
      this.setUser(res.user);
      this.tokenStore.setUser(res.user);
    }
  }

  private setUser(user: AuthUser | null) {
    this.currentUser.set(user);
  }
}
