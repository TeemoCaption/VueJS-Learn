<script setup>
import { ref, onMounted } from 'vue'

// 控制選單是否展開
const isOpen = ref(false)

onMounted(() => {
    console.log('MobileMenu 已完成 Hydration')
})

// 切換選單
function toggleMenu() {
    isOpen.value = !isOpen.value
}
</script>

<template>
    <nav class="mobile-menu">
        <button @click="toggleMenu">
            {{ isOpen ? '關閉選單' : '開啟選單' }}
        </button>

        <ul v-if="isOpen">
            <li><a href="/">首頁</a></li>
            <li><a href="/products">商品</a></li>
            <li><a href="/about">關於我們</a></li>
        </ul>
    </nav>
</template>

<style scoped>
.mobile-menu {
    max-width: 420px;
    padding: 20px;
    border: 2px solid #409eff;
    border-radius: 12px;
    background-color: #f2f8ff;
}

button {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    background-color: #409eff;
    color: white;
    cursor: pointer;
}

ul {
    padding-left: 20px;
}

li {
    margin: 10px 0;
}
</style>