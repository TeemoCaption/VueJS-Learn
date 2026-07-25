<script setup>
// defineEmits 用來定義要發送的事件
const emit = defineEmits(['add'])
</script>

<template>
    <!-- 這裡的 emit('add') 用來發送事件給父組件 -->
    <!-- 這裡的 5 是傳遞給父組件的值 -->
    <!-- 所有放在事件名稱後面的額外參數，都會傳給父元件的事件監聽函式。 -->
    <button @click="emit('add', 5)">
        一次增加 5
    </button>
</template>

<style scoped>
button {
    padding: 10px 18px;
    cursor: pointer;
}
</style>