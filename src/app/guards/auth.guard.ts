import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En SSR permite pasar; en cliente evalúa sesión
  if (!isPlatformBrowser(platformId)) return true;

  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
