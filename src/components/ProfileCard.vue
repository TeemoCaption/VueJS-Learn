<script setup>
import { ref } from 'vue'

const title = ref('使用者資料')

const user = ref({
    id: 1,
    name: '小美',
    email: 'mei@example.com',
    role: '管理員'
})

const updatedAt = ref('2026-07-29 15:30')

function updateProfile() {
    updatedAt.value = new Date().toLocaleString('zh-TW')
}
</script>

<template>
    <article class="profile-card">
        <header class="card-header">
            <!--
        header 插槽只提供 title。
      -->
            <slot name="header" :title="title">
                <h2>{{ title }}</h2>
            </slot>
        </header>

        <main class="card-body">
            <!--
        default 插槽提供 user 與 updateProfile。
      -->
            <slot :user="user" :update-profile="updateProfile">
                <p>{{ user.name }}</p>
            </slot>
        </main>

        <footer class="card-footer">
            <!--
        footer 插槽提供 updatedAt。
      -->
            <slot name="footer" :updated-at="updatedAt">
                <small>
                    更新時間：{{ updatedAt }}
                </small>
            </slot>
        </footer>
    </article>
</template>

<style scoped>
.profile-card {
    width: min(560px, 100%);
    overflow: hidden;

    border: 1px solid #dce3e8;
    border-radius: 14px;

    background-color: white;
    box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
}

.card-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e6eaed;
    background-color: #eaf8f2;
}

.card-body {
    padding: 24px;
}

.card-footer {
    padding: 16px 24px;
    border-top: 1px solid #e6eaed;
    background-color: #f7f8f9;
}
</style>