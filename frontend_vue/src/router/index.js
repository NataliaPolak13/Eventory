import { createRouter, createWebHistory } from 'vue-router';

import Login from '../components/logowanie.vue';
import ForgotPassword from '../components/reset_hasła.vue';
import Register from '../components/rejestracja.vue';

const routes = [
  {
    path: '/logowanie',
    name: 'Logowanie',
    component: Login
  },
  {
    path: '/reset_hasła',
    name: 'ResetHasla',
    component: ForgotPassword
  },
  {
    path: '/rejestracja',
    name: 'Rejestracja',
    component: Register
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../components/dashboard/dashboard.vue')
  },
  {
    path: '/confirmEmail',
    name: 'confirmEmail',
    component: () => import('../components/confirmEmail.vue')
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
