import { createRouter, createWebHistory } from 'vue-router'



const routes = [
  {
    path: '/livre-dor',
    name: 'livredor',
    component: () => import('@/views/LivreDorView.vue')
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
}





)


export default router
