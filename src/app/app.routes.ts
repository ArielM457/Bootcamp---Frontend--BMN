import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio | Bomberman Online',
    loadComponent: () => import('./features/home/welcome').then((m) => m.Welcome),
  },
  {
    path: 'entrar',
    title: 'Entrar | Bomberman Online',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Crear cuenta | Bomberman Online',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register').then((m) => m.Register),
  },
  {
    path: 'menu',
    title: 'Menú | Bomberman Online',
    canActivate: [authGuard],
    loadComponent: () => import('./features/lobby/lobby').then((m) => m.Lobby),
  },
  {
    path: 'salas',
    title: 'Salas | Bomberman Online',
    canActivate: [authGuard],
    loadComponent: () => import('./features/rooms/room-list').then((m) => m.RoomList),
  },
  {
    path: 'salas/:roomId',
    title: 'Sala de espera | Bomberman Online',
    canActivate: [authGuard],
    loadComponent: () => import('./features/rooms/room-waiting').then((m) => m.RoomWaiting),
  },
  {
    path: 'juego',
    title: 'Partida | Bomberman Online',
    canActivate: [authGuard],
    loadComponent: () => import('./features/game/game').then((m) => m.Game),
  },
  {
    path: 'ranking',
    title: 'Ranking | Bomberman Online',
    canActivate: [authGuard],
    loadComponent: () => import('./features/leaderboard/leaderboard').then((m) => m.Leaderboard),
  },
  {
    path: 'proximamente',
    title: 'Próximamente | Bomberman Online',
    loadComponent: () => import('./features/home/coming-soon').then((m) => m.ComingSoon),
  },
  { path: '**', redirectTo: '' },
];
