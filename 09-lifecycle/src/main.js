import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

/*
 * 全域錯誤處理器
 * app.config.errorHandler 負責處理整個應用程式中，繼續向最上層傳遞的錯誤(沒有被元件的 onErrorCaptured 阻止傳遞的錯誤)。
 * 
 * 最後會傳遞到這裡。
 */
app.config.errorHandler = (error, instance, info) => {
    console.group('Vue 全域錯誤處理器')

    console.error('錯誤物件：', error)
    console.log('發生錯誤的元件：', instance)
    console.log('錯誤來源：', info)

    console.groupEnd()

    /*
     * 真實專案中，可以在這裡把錯誤送到：
     *
     * - Sentry
     * - Bugsnag
     * - 自己的後端記錄系統
     *
     * 例如：
     *
     * sendErrorToServer({
     *   message: error.message,
     *   info
     * })
     */
}

app.use(createPinia())
app.use(router)

app.mount('#app')
