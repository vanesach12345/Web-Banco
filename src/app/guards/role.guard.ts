<<<<<<< HEAD
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = new Router();

  // 📦 Recupera el rol guardado en localStorage
  const userRole = Number(localStorage.getItem('rol')); // 1 = cliente, 2 = gerente, 3 = ejecutivo
  const allowedRoles = route.data?.['roles'] as number[];

  console.log('🔎 Verificando acceso...', { userRole, allowedRoles });

  // Si no hay rol o no está permitido, lo sacamos del módulo
  if (!userRole || !allowedRoles.includes(userRole)) {
    console.warn('⛔ Acceso denegado, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  // ✅ Todo bien
  return true;
=======
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
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
};
