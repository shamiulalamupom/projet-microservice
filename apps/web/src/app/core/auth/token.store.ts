import { Injectable } from "@angular/core";

export type UserRole = "client" | "manager";
export type AuthUser = { id: string; email: string; role: UserRole };

@Injectable({ providedIn: "root" })
export class TokenStore {
  private readonly TOKEN_KEY = "tp_token";
  private readonly USER_KEY = "tp_user";

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
  setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  clearAll(): void {
    this.clearToken();
    this.clearUser();
  }
}
