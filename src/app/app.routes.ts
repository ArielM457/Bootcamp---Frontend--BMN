import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio | Bomberman Online',
    loadComponent: () => import('./features/home/welcome').then((m) => m.Welcome),
  },
  {
    path: 'proximamente',
    title: 'Próximamente | Bomberman Online',
    loadComponent: () => import('./features/home/coming-soon').then((m) => m.ComingSoon),
  },
  { path: '**', redirectTo: '' },
];
