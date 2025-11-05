import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/shell').then(m => m.Shell)
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth').then(m => m.Auth)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'create',
    loadComponent: () => import('./create-thesis/create-thesis').then(m => m.CreateThesis)
  },
  {
    path: 'thesis/:id',
    loadComponent: () => import('./thesis-detail/thesis-detail').then(m => m.ThesisDetail)
  },
  {
    path: '**',
    loadComponent: () => import('./shell/shell').then(m => m.Shell)
  }
];
