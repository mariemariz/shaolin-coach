import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '../pages/RegisterPage.vue'
import RecommendPage from '../pages/RecommendPage.vue'
import ConfigPage from '../pages/ConfigPage.vue'
import AboutPage from '../pages/AboutPage.vue'

const routes = [
  {
    path: '/',
    name: 'Register',
    component: RegisterPage,
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
  history: createWebHistory(),
  routes,
})

export default router
