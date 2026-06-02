import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'

createApp(App).use(router).mount('#app')

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/shaolin-coach/service-worker.js').then((registration) => {
      console.log('Service Worker registrado com sucesso:', registration)
    }).catch((error) => {
      console.log('Erro ao registrar Service Worker:', error)
    })
  })
}
