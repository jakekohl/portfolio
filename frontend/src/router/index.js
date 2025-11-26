import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/projects',
      component: () => import('@/views/ProjectsView.vue'),
    },
    {
      path: '/roles',
      component: () => import('@/views/RolesView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
});

export default router;
