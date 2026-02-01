import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GameView from '@/views/GameView.vue'
import GameViewTeen from '@/views/GameViewTeen.vue'
import ResultsView from '@/views/ResultsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/game',
    name: 'game',
    component: GameView
  },
  {
    path: '/game-teen',
    name: 'game-teen',
    component: GameViewTeen
  },
  {
    path: '/results',
    name: 'results',
    component: ResultsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
}) 

export default router