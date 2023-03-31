import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Screen1 from '@/views/Screen1.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'screen',
    component: Screen1
  },
  {
    path: '/screen1',
    name: 'screen1',
    component: Screen1
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router