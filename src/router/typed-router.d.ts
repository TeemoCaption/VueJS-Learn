import type { RouteRecordInfo } from 'vue-router'

// 定義整個應用程式有哪些「具名路由」
export interface RouteNamedMap {
  // 首頁
  home: RouteRecordInfo<
    'home', // 路由名稱
    '/', // 路由 path
    Record<never, never>, // router.push() 可以傳入的 params
    Record<never, never>, // useRoute() 取得的 params
    never // 子路由名稱
  >

  // 使用者詳細資料頁
  user: RouteRecordInfo<
    'user', // 路由名稱
    '/users/:id', // 路由 path
    // 導航時允許 number 或 string
    { id: string | number },
    // 從 URL 取得後會是 string
    { id: string },
    // 沒有子路由
    never
  >
}

// 擴充 Vue Router 本身的型別
declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
