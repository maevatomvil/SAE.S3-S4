import { createRouter, createWebHistory } from 'vue-router'



const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue')
    },
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
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('@/views/signup.vue')
    },{
        path: '/addPrestataire',
        name: 'addPrestataire',
        component: () => import('@/views/addPrestataire.vue')
    },{
        path: '/AddAchats',
        name: 'AddAchats',
        component: () => import('@/views/Templates/TemplateAchat.vue')
    },{
        path: '/AddReservation',
        name: 'AddReservation',
        component: () => import('@/views/Templates/TemplateReservation.vue')
    },
    {
        path: '/PageInformation',
        name: 'PageInformation',
        component: () => import('@/views/Templates/TemplatePageInfo.vue')
    },
    {
        path: '/AddPlanning',
        name: 'AddPlanning',
        component: () => import('@/views/Templates/TemplatePlanning.vue')
    },{
        path: '/prestataire-demandes',
        name: 'PrestataireDemandes',
        component: () => import('@/views/DemandesPrestataires.vue')
    },
    {
        path: '/prestataire/:username',
        name: 'PrestatairePage',
        component: () => import('@/views/PrestatairePage.vue'),
        props: true
    },{
        path: '/prestataire/:username/info',
        name: 'PrestatairePageInfo',
        component: () => import('@/views/Pageservices/PrestatairePageInfo.vue'),
        props: true
    },{
        path: '/prestataire/:username/achat',
        name: 'PrestatairePageAchat',
        component: () => import('@/views/Pageservices/PrestatairePageAchat.vue'),
        props: true
    },{
        path: '/prestataire/:username/planning',
        name: 'PrestatairePagePlanning',
        component: () => import('@/views/Pageservices/PrestatairePagePlanning.vue'),
        props: true
    },{
        path: '/prestataire/:username/edit',
        name: 'EditPrestataire',
        component: () => import('@/views/EditPrestataire.vue')
    },
    {
        path: '/prestataire/:username/stats',
        name: 'PrestataireStats',
        component: () => import('@/views/Statistiques.vue')
    }







]


const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: routes,
    }





)


export default router
