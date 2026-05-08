import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (requiredRoles.length === 0) return true;

  const userRoles = authStore.user()?.roles ?? [];
  const hasRole = requiredRoles.some(r => userRoles.includes(r));

  if (!hasRole) {
    router.navigate(['/products']);
    return false;
  }

  return true;
};