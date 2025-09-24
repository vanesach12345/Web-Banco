// src/app/guards/role.guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const a = inject(AuthService);
  const r = inject(Router);
  const plat = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(plat);

  if (!isBrowser) return true;           // 👈 evita tocar storage en SSR
  const allowed: number[] = route.data?.['roles'] ?? [];
  const role = a.roleId;

  if (a.isLoggedIn() && role && allowed.includes(role)) return true;
  r.navigate(['/login']);
  return false;
};
