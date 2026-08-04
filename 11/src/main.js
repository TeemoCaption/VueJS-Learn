import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 匯入獨立的自訂指令。
import { focus } from './directives/focus'
import { highlight } from './directives/highlight'

const app = createApp(App)


// 全域註冊自訂指令。
app.directive('focus', focus)
app.directive('highlight', highlight)

app.use(createPinia())
app.use(router)

app.mount('#app')
