<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMouse } from '../composables/useMouse.js'

// MouseTracker 不再需要知道事件監聽與清理細節~。
// 它只需要使用 useMouse() 提供的資料。
const { x, y } = useMouse()

</script>

<template>
    <section class="mouse-tracker">
        <h2>滑鼠追蹤器</h2>

        <p>X 座標：{{ x }}</p>
        <p>Y 座標：{{ y }}</p>
    </section>
</template>

<style scoped>
.mouse-tracker {
    padding: 24px;
    border: 1px solid #cccccc;
    border-radius: 12px;
}

p {
    font-size: 18px;
}
</style>