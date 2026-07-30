import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 在整個應用程式層級提供資料
app.provide('appName', 'Vue 學習系統')

app.provide('appConfig', {
    language: 'zh-TW',
    version: '1.0.0'
})

app.use(createPinia())
app.use(router)

app.mount('#app')
