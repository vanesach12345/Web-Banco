// src/app/services/auth.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

type LoginResponse = { token: string; user: any };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:3001/api/auth';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.api}/login`, { email, password });
  }

  saveSession(resp: LoginResponse) {
    if (!this.isBrowser) return;                 // 👈 evita SSR
    localStorage.setItem('token', resp.token);
    localStorage.setItem('user', JSON.stringify(resp.user));
  }

  get token(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null; // 👈
  }

  get user(): any | null {
    if (!this.isBrowser) return null;            // 👈
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  }

  get roleId(): number | null {
    return this.user?.id_rol ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}
