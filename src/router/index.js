import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import RegisterPage from '../pages/RegisterPage.vue'
import RecommendPage from '../pages/RecommendPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import ConfigPage from '../pages/ConfigPage.vue'
import AboutPage from '../pages/AboutPage.vue'

const routes = [
  {
    path: '/',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: RecommendPage,
  },
  {
    path: '/config',
    name: 'Config',
    component: ConfigPage,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
