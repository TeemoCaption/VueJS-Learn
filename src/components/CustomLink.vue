<script setup>
import { reactive } from 'vue'
import { useLink } from 'vue-router'

// 接收父元件傳入的路由位置
const props = defineProps({
    to: {
        type: [String, Object],
        required: true
    }
})

// useLink() 需要一個響應式的 RouterLink props 物件
const link = reactive({
    to: props.to
})

// 直接取得 RouterLink 內部使用的功能
const {
    href,
    navigate,
    isActive,
    isExactActive
} = useLink(link)
</script>

<template>
    <!--
    href：
    Router 解析後真正的網址

    navigate：
    執行 Vue Router 導航
  -->
    <a :href="href" @click="navigate" :class="{
        active: isActive,
        'exact-active': isExactActive
    }">
        <slot />
    </a>
</template>

<style scoped>
a {
    text-decoration: none;
}

.active {
    font-weight: bold;
}

.exact-active {
    text-decoration: underline;
}
</style>