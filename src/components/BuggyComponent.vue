<script setup>
import { ref, computed } from 'vue'

// 模擬從後端取得的使用者資料
const user = ref({
    name: '小明',
    role: {
        title: '管理員'
    }
})

// 記錄按鈕點擊次數
const clickCount = ref(0)

// 使用 computed 產生使用者資訊
const userDescription = computed(() => {
    /*
     * 正常情況：
     * user.value.role.title 是「管理員」
     *
     * 發生錯誤後：
     * role 會變成 null
     * 再讀取 null.title 就會產生錯誤
     */
    return `${user.value.name}｜${user.value.role.title}`
})

// 製造一個錯誤
function createError() {
    clickCount.value++

    // 故意破壞資料
    user.value.role = null

    /*
     * computed 重新計算後，會嘗試執行：
     *
     * user.value.role.title
     *
     * 但 role 已經是 null，因此發生錯誤。
     */
}
</script>

<template>
    <article class="user-card">
        <h2>使用者資料元件</h2>

        <p class="description">
            這是 ErrorBoundary 裡面的子元件。
        </p>

        <!--
      userDescription 是 computed。
      當 role 變成 null 時，這裡會觸發錯誤。
    -->
        <div class="user-information">
            <p>
                使用者資訊：
                <strong>{{ userDescription }}</strong>
            </p>

            <p>按鈕點擊次數：{{ clickCount }}</p>
        </div>

        <button class="error-button" @click="createError">
            製造子元件錯誤
        </button>
    </article>
</template>

<style scoped>
.user-card {
    padding: 24px;
    border: 2px solid #42b883;
    border-radius: 12px;
    background-color: #f0fdf7;
}

h2 {
    margin-top: 0;
    color: #166534;
}

.description {
    color: #555;
}

.user-information {
    margin: 20px 0;
    padding: 16px;
    border-radius: 8px;
    background-color: white;
}

.error-button {
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    background-color: #dc2626;
    color: white;
    cursor: pointer;
}

.error-button:hover {
    background-color: #b91c1c;
}
</style>