<script setup>
const childMessage = '這是子元件的資料'
</script>

<template>
    <button class="user-button">
        <slot></slot>
    </button>

    <p class="child-message">
        子元件內部資料：{{ childMessage }}
    </p>
</template>

<style scoped>
.user-button {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    background-color: #35495e;
    color: white;
    cursor: pointer;
}

.child-message {
    margin-top: 12px;
    color: #666;
}
</style>