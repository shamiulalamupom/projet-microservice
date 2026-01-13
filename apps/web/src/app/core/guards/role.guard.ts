import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../ui/toast.service';

export const managerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (!auth.isAuthenticated()) {
    toast.error('Please login to continue.');
    return router.createUrlTree(['/login']);
  }

  if (auth.hasRole('manager')) {
    return true;
  }

  toast.error('Manager role required.');
  return router.createUrlTree(['/']);
};
