// src/app/guards/auth.guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const a = inject(AuthService);
  const r = inject(Router);
  const plat = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(plat);

  if (!isBrowser) return true;           // 👈 durante SSR, permite y que el cliente redirija
  if (a.isLoggedIn()) return true;

  r.navigate(['/login']);
  return false;
};
