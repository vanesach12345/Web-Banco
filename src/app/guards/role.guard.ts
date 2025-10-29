import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Si no estamos en el navegador (SSR), permite pasar
  if (!isPlatformBrowser(platformId)) return true;

  const allowed: number[] = route.data?.['roles'] ?? []; // Roles permitidos para la ruta
  const role = auth.roleId; // Obtenemos el rol del usuario desde el servicio AuthService

  // Verificamos si el usuario está autenticado y si su rol está permitido para esta ruta
  return (auth.isLoggedIn() && role != null && allowed.includes(role))
    ? true
    : router.createUrlTree(['/login']);
};
