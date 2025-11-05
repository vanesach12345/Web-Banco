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
};
