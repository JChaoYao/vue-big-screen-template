import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import Screen1 from '@/views/Screen1.vue'
import Screen2 from '@/views/Screen2.vue'
import Layout from '@/layout/Index.vue'
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
  {
    path: '/screen2',
    name: 'Screen2',
    component: Screen2
  },
  {
    path: '/HelloWorld',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/home',
    name: 'Home',
    component: Layout
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router