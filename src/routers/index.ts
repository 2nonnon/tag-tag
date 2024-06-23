import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
})

export function setupRouter(app: App) {
  app.use(router)
}

export default router
