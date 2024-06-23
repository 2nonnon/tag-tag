import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './routers'
import './styles/index.css'
import { setupStore } from './store'

const app = createApp(App)

setupRouter(app)
setupStore(app)

app.mount('#app')
