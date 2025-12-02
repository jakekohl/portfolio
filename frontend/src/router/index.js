import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/contact',
      component: () => import('@/views/ContactView.vue'),
      meta: {
        title: 'Contact',
      },
    },
    {
      path: '/projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: {
        title: 'Projects',
      },
    },
    {
      path: '/roles',
      component: () => import('@/views/RolesView.vue'),
      meta: {
        title: 'Career',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: 'Not Found',
      },
    },
  ],
});

export default router;

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Jake Kohl';
  next();
});
