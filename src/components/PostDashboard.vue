<script setup>
import { ref } from 'vue'
import { usePost } from '../composables/usePost.js'
import { useFavorites } from '../composables/useFavorites.js'
import { usePostSummary } from '../composables/usePostSummary.js'

const postId = ref(1)

// 第一層：根據 postId 取得文章。
const {
    post,
    error,
    isLoading
} = usePost(postId)

// 第二層：根據 postId 管理收藏。
const {
    favorites,
    isFavorite,
    toggleFavorite
} = useFavorites(postId)

// 第三層：將 usePost() 回傳的 post，
// 作為另一個 composable 的輸入。
const {
    summary,
    characterCount
} = usePostSummary(post)

function previousPost() {
    if (postId.value > 1) {
        postId.value--
    }
}

function nextPost() {
    if (postId.value < 100) {
        postId.value++
    }
}
</script>

<template>
    <main class="dashboard">
        <h1>文章瀏覽器</h1>

        <section class="controls">
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
        </section>

        <p v-if="isLoading">
            載入中……
        </p>

        <p v-else-if="error" class="error">
            {{ error.message }}
        </p>

        <article v-else-if="post" class="post-card">
            <small>文章編號：{{ post.id }}</small>

            <h2>{{ post.title }}</h2>

            <p>{{ post.body }}</p>

            <button @click="toggleFavorite">
                {{ isFavorite ? '取消收藏' : '加入收藏' }}
            </button>
        </article>

        <section class="favorites">
            <h2>收藏文章</h2>

            <p v-if="favorites.length === 0">
                目前沒有收藏文章。
            </p>

            <button v-for="favoriteId in favorites" :key="favoriteId" @click="postId = favoriteId">
                文章 {{ favoriteId }}
            </button>
        </section>
        <section v-if="post" class="summary-card">
            <h2>文章摘要</h2>

            <p>{{ summary }}</p>

            <small>
                原文共 {{ characterCount }} 個字元
            </small>
        </section>
    </main>
</template>

<style scoped>
.dashboard {
    display: grid;
    gap: 24px;
    max-width: 720px;
    margin: 40px auto;
    font-family: sans-serif;
}

.controls,
.favorites {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.post-card,
.favorites {
    padding: 20px;
    border: 1px solid #cccccc;
    border-radius: 12px;
}

input,
button {
    padding: 8px 12px;
}

.error {
    padding: 12px;
    border: 1px solid #cc0000;
    border-radius: 8px;
}
</style>