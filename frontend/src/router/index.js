import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/contact',
      component: () => import('@/views/Contact.vue'),
    },
    {
      path: '/projects',
      component: () => import('@/views/Projects.vue'),
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
