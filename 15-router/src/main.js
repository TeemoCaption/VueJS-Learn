import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
// 將 Vue Router 註冊成 Vue 插件
// 注意：必須在 mount() 之前呼叫 use()
app.use(router)

app.mount('#app')
