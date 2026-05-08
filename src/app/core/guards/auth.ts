// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth'; 
export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);

  if (authStore.isAuthenticated()) {
    return true;
  }

  authStore.login();
  return false;
};