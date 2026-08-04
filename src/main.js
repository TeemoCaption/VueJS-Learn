import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 匯入 Animate.css 的全域動畫樣式
import 'animate.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
