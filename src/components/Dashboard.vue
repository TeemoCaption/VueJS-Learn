<!-- src/components/Dashboard.vue -->

<script setup>
import { ref, shallowRef } from 'vue'

// 引入兩個非同步資料元件
import UserProfile from './UserProfile.vue'
import AdminProfile from './AdminProfile.vue'

// 儲存目前顯示的內層元件
const currentProfile = shallowRef(UserProfile)

// 記錄目前是否顯示管理員
const isAdmin = ref(false)

// 切換內層動態元件
function switchProfile() {
    isAdmin.value = !isAdmin.value

    currentProfile.value = isAdmin.value
        ? AdminProfile
        : UserProfile
}
</script>

<template>
    <section>
        <h2>Dashboard</h2>

        <button @click="switchProfile">
            切換使用者
        </button>

        <!--
      內層 Suspense。

      suspensible 代表：
      將內層的非同步依賴交給父層 Suspense 管理。
    -->
        <Suspense suspensible>
            <!--
        currentProfile 可能是：
        UserProfile 或 AdminProfile。
      -->
            <component :is="currentProfile" />
        </Suspense>
    </section>
</template>