<script setup>
import { computed } from 'vue'
import { useMouse } from '../composables/useMouse.js'

const { x, y } = useMouse()

// 根據滑鼠 X 座標判斷目前位於畫面左側或右側。
const horizontalPosition = computed(() => {
    return x.value < window.innerWidth / 2
        ? '畫面左側'
        : '畫面右側'
})

// 根據滑鼠 Y 座標判斷目前位於畫面上方或下方。
const verticalPosition = computed(() => {
    return y.value < window.innerHeight / 2
        ? '畫面上方'
        : '畫面下方'
})
</script>

<template>
    <section class="mouse-status">
        <h2>滑鼠區域判斷</h2>

        <p>水平方向：{{ horizontalPosition }}</p>
        <p>垂直方向：{{ verticalPosition }}</p>
    </section>
</template>

<style scoped>
.mouse-status {
    padding: 24px;
    border: 1px solid #cccccc;
    border-radius: 12px;
}
</style>