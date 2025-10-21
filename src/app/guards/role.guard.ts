import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true;

  const allowed: number[] = route.data?.['roles'] ?? [];
  const role = auth.roleId;
  return (auth.isLoggedIn() && role != null && allowed.includes(role))
    ? true
    : router.createUrlTree(['/login']);
};
