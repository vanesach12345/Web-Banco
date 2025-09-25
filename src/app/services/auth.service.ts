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
    if (!this.isBrowser) return;
    localStorage.setItem('token', resp.token);
    localStorage.setItem('user', JSON.stringify(resp.user));
  }

  get user()   { return this.isBrowser ? JSON.parse(localStorage.getItem('user')||'null') : null; }
  get roleId() { const r = this.user?.id_rol; return r!=null ? Number(r) : null; }
  isLoggedIn() { return this.isBrowser && !!localStorage.getItem('token'); }
}
