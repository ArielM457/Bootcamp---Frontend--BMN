import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from './auth.facade';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  return (await auth.ensureSession()) ? true : router.createUrlTree(['/entrar']);
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  return (await auth.ensureSession()) ? router.createUrlTree(['/menu']) : true;
};
