import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Replace this with your real auth check
  const isLoggedIn = !!localStorage.getItem('token');
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
