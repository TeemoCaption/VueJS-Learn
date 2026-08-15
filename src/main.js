import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// 明確使用 TypeScript 版本的路由設定。
// 專案中同時存在 index.js 與 index.ts，因此不要依賴自動解析順序。
import router from './router/index.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
