import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/index.vue'),
      },
      {
        path: 'courses',
        component: () => import('pages/courses.vue'),
      },
      {
        path: ':course',
        component: () => import('pages/courses/_course.vue'),
      },
      {
        path: 'login',
        component: () => import('pages/login.vue'),
      },
      {
        path: 'logout',
        component: () => import('pages/logout.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: 'users',
        component: () => import('pages/admin/users.vue'),
      },
      {
        path: 'course',
        component: () => import('pages/admin/course.vue'),
      },
      // {
      //   path: 'logs',
      //   component: () => import('pages/admin/logs.vue'),
      // },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
