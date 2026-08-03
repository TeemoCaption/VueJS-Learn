<script setup>
import { ref } from 'vue'
import { useFetch } from '../composables/useFetch.js'

// 目前文章編號。
const postId = ref(1)

// 傳入 getter 函數。
// getter 內讀取 postId.value，
// 因此 postId 會成為 watchEffect 的響應式依賴。
const {
    data,
    error,
    isLoading
} = useFetch(() => {
    return `https://jsonplaceholder.typicode.com/posts/${postId.value}`
})

function previousPost() {
    // 測試 API 的文章從 1 開始。
    if (postId.value > 1) {
        postId.value--
    }
}

function nextPost() {
    // JSONPlaceholder 共有 100 篇測試文章。
    if (postId.value < 100) {
        postId.value++
    }
}
</script>

<template>
    <section class="post-viewer">
        <h2>響應式文章查詢</h2>

        <div class="controls">
            <button :disabled="postId <= 1" @click="previousPost">
                上一篇
            </button>

            <label>
                文章編號：

                <input v-model.number="postId" type="number" min="1" max="100" />
            </label>

            <button :disabled="postId >= 100" @click="nextPost">
                下一篇
            </button>
        </div>

        <p v-if="isLoading">
            正在載入第 {{ postId }} 篇文章……
        </p>

        <div v-else-if="error" class="error">
            載入失敗：{{ error.message }}
        </div>

        <article v-else-if="data" class="post-card">
            <small>文章編號：{{ data.id }}</small>

            <h3>{{ data.title }}</h3>

            <p>{{ data.body }}</p>
        </article>

        <p v-else>
            沒有取得文章資料。
        </p>
    </section>
</template>

<style scoped>
.post-viewer {
    display: grid;
    gap: 20px;
}

.controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

input {
    width: 80px;
    padding: 8px;
}

button {
    padding: 8px 14px;
    cursor: pointer;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.post-card,
.error {
    padding: 20px;
    border: 1px solid #cccccc;
    border-radius: 12px;
}
</style>