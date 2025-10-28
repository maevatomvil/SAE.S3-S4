import { createRouter, createWebHistory } from 'vue-router'



const routes = [
  {
    path: '/livre-dor',
    name: 'livredor',
    component: () => import('@/views/LivreDorView.vue')
  },
  {
    path:'/page-hotel',
    name:'pagehotel',
    component: () => import('@/views/Page_hotel.vue')
  },
  {
    path:'/competition',
    name:'competition',
    component: () => import('@/views/competition.vue')
  },
  {
    path:'/restauration',
    name:'restauration',
    component: () => import('@/views/restauration.vue')
  },
  {
    path:'/reservation-equipements',
    name:'reservation-equipements',
    component: () => import('@/views/reservation-equipements.vue')
  },
  {
    path:'/reservation-hotel',
    name:'reservation-hotel',
    component: () => import('@/views/reservation-hotel.vue')
  },
  {
    path:'/planning-competitions',
    name:'planning-competitions',
    component: () => import('@/views/planning_competitions.vue')
  }

]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
}





)


export default router
