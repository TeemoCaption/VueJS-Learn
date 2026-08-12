<script setup>
// RouterLink：建立子路由導航
// RouterView：顯示子路由內容
import {
    RouterLink,
    RouterView
} from 'vue-router'

// 接收 Router 傳入的會員 ID
const props = defineProps({
    id: {
        type: String,
        required: true
    }
})
</script>

<template>
    <main>
        <!-- 顯示會員 ID -->
        <h1>
            會員 {{ props.id }}
        </h1>

        <nav class="user-nav">
            <!--
        activeClass：
        當連結 Active 時使用 nav-active。

        exactActiveClass：
        精確匹配時使用 nav-exact-active。
      -->
            <RouterLink :to="{
                name: 'user-profile',
                params: {
                    id: props.id
                }
            }" active-class="nav-active" exact-active-class="nav-exact-active">
                個人資料
            </RouterLink>

            <RouterLink :to="{
                name: 'user-posts',
                params: {
                    id: props.id
                }
            }" active-class="nav-active" exact-active-class="nav-exact-active">
                文章
            </RouterLink>
        </nav>

        <hr />

        <!-- 顯示目前子路由 -->
        <RouterView />
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}

.user-nav {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

/*
  自訂 Active Class
*/
.nav-active {
    font-weight: bold;
}

/*
  自訂 Exact Active Class
*/
.nav-exact-active {
    text-decoration: underline;
}
</style>