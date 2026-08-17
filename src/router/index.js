import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/about',
      component: AboutView
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    // 尋找要捲動到的 DOM 元素
    const mainElement = document.querySelector('#main')

    if (mainElement) {
      // 取得 #main 最終套用的 CSS 樣式
      // scrollMarginTop 對應 CSS 的 scroll-margin-top
      const marginTop = parseFloat(
        // getComputedStyle 會回傳計算後的 CSS 值（例如 "80px"）
        getComputedStyle(mainElement).scrollMarginTop
      )

      // 捲到 #main，並套用它自己定義的偏移量
      return {
        el: mainElement,
        top: marginTop
      }
    } else {
      // 找不到 #main 時，回到頁面頂部
      return {
        top: 0
      }
    }
  }
})

export default router