import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './styles.css'
import { messages } from './messages'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const i18n = createI18n({
  legacy: false,
  locale: 'uz',
  messages,
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(i18n)
app.use(pinia)
app.use(router)

app.mount('#app')
