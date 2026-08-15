// 載入 vue-router 原本的型別宣告
import 'vue-router'

// 確保這個檔案被 TypeScript 視為模組
export {}

// 擴充 vue-router 原本的 RouteMeta
declare module 'vue-router' {
  interface RouteMeta {
    // requiresAuth 沒有 ?，代表每條路由都必須設定
    requiresAuth: boolean

    // isAdmin 有 ?，代表這個欄位可以不設定
    isAdmin?: boolean
  }
}
