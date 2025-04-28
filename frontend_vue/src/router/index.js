import { createRouter, createWebHistory } from 'vue-router';

// Importuj swoje komponenty
import Login from '../components/logowanie.vue';
import ForgotPassword from '../components/reset_hasła.vue';
import Register from '../components/formularz_rejestracyjny.vue';

// Tworzymy router i konfigurujemy ścieżki
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
    path: '/formularz_rejstracyjny',
    name: 'Rejestracja',
    component: Register

}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
