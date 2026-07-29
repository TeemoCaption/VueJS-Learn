<script setup>
import { ref } from 'vue'

// 這些資料屬於子元件 UserCard。
const user = ref({
    id: 1,
    name: '小明',
    age: 25,
    email: 'ming@example.com',
    isOnline: true
})

// 切換使用者的上線狀態。
function toggleOnlineStatus() {
    user.value.isOnline = !user.value.isOnline
}
</script>

<template>
    <section class="user-card">
        <!--
      將子元件的資料傳給父元件插槽。

      這裡提供了三個 Slot Props：
      1. user
      2. isOnline
      3. toggleStatus
    -->
        <slot :user="user" :is-online="user.isOnline" :toggle-status="toggleOnlineStatus">
            <!--
        如果父元件沒有提供插槽內容，
        就顯示這段預設內容。
      -->
            <h2>{{ user.name }}</h2>

            <p>
                {{ user.email }}
            </p>
        </slot>
    </section>
</template>

<style scoped>
.user-card {
    width: min(520px, 100%);
    padding: 24px;

    border: 1px solid #dce3e8;
    border-radius: 14px;

    background-color: white;
    box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
}
</style>