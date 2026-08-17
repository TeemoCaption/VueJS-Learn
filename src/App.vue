<script setup>
// 這個範例不需要額外的 JavaScript
// RouterView 會根據目前 URL 自動取得對應的路由元件
</script>

<template>
  <div>
    <nav>
      <!-- 切換到 Home 頁面 -->
      <RouterLink to="/">
        Home
      </RouterLink>

      |

      <!-- 切換到 About 頁面 -->
      <RouterLink to="/about">
        About
      </RouterLink>
    </nav>

    <!--
      Component 就是目前路由匹配到的頁面元件
      例如 HomeView.vue 或 AboutView.vue
    -->
    <RouterView v-slot="{ Component }">

      <!--
        name="fade"
        表示 Vue 會使用：
        .fade-enter-active
        .fade-leave-active
        .fade-enter-from
        .fade-leave-to
        等 CSS class
      -->
      <Transition name="fade">
        <!-- 真正的路由頁面 -->
        <component :is="Component" />
      </Transition>

    </RouterView>
  </div>
</template>

<style scoped>
/*
  新頁面進入、舊頁面離開時，
  opacity 的變化花 0.3 秒完成
*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

/*
  新頁面剛開始進入：
  opacity 從 0 慢慢變成 1
*/
.fade-enter-from {
  opacity: 0;
}

/*
  舊頁面準備離開：
  opacity 從 1 慢慢變成 0
*/
.fade-leave-to {
  opacity: 0;
}
</style>