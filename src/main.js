import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import HelloPlugin from './plugins/helloPlugin'
import FormatPlugin from "./plugins/formatPlugin"

const app = createApp(App)

// 安裝 Plugin
app.use(HelloPlugin)
app.use(FormatPlugin)

app.use(createPinia())
app.use(router)

app.mount('#app')
