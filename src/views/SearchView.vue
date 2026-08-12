<script setup>
// 接收 Router 透過 Function Mode
// 傳入的 query Prop
const props = defineProps({
    query: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <main>
        <h1>搜尋</h1>

        <!--
      例如：
      /search?q=vue

      Router 會把 q 轉成 query Prop
    -->
        <p v-if="props.query">
            搜尋關鍵字：{{ props.query }}
        </p>

        <!-- 沒有搜尋文字時顯示 -->
        <p v-else>
            目前沒有搜尋關鍵字。
        </p>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}
</style>