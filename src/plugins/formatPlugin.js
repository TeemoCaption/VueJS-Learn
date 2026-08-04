export default {
    install(app) {
        // config 是這個 Vue App 的設定
        // globalProperties 是所有 Component 都可以共同使用的屬性。
        // $upper 是自定義的全域函式名稱(也可以不用寫 $，但建議全域屬性加上 $)
        app.config.globalProperties.$upper = function (text) {
            return text.toUpperCase()
        }
    }
}