import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home.vue';
import Team from '../views/Team.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/team',
    name: 'Team',
    component: Team
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    props: route => ({ name: route.query.name, handle: route.query.handle }),
    beforeEnter(to, from, next) {
      const hasName =
        to.query.name !== null &&
        to.query.name !== undefined &&
        to.query.name !== '';
      const hasHandle =
        to.query.handle !== null &&
        to.query.handle !== undefined &&
        to.query.handle !== '';
      if (hasName || hasHandle) {
        next();
      } else {
        next({ name: 'Home' });
      }
    }
  },
  {
    path: '/tool',
    name: 'Tool',
    component: () => import('../views/Tool.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
