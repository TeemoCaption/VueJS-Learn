<script setup>
/*
這種寫法若出現在很多元件裡，就會產生大量重複程式碼。
建議把它抽成：useFetch(url)
元件只負責：提供 API 網址、顯示資料、顯示錯誤
請求的細節交給組合式函數管理。
*/

import { ref } from 'vue'

// 儲存成功取得的文章資料。
// 尚未取得資料時，初始值設為 null。
const data = ref(null)

// 儲存請求過程中發生的錯誤。
// 沒有錯誤時，初始值同樣設為 null。
const error = ref(null)

// 向測試 API 請求編號 1 的文章。
fetch('https://jsonplaceholder.typicode.com/posts/1')
    // fetch() 完成後會取得 Response 物件。
    // response 是 fetch() 回傳的 Promise 物件
    .then((response) => {
        // 將回傳內容解析成 JavaScript 物件。
        return response.json()
    })
    // JSON 解析完成後，將資料存入 data。
    .then((json) => {
        data.value = json
    })
    // 任何前面的 Promise 發生錯誤，都會進入 catch。
    .catch((requestError) => {
        error.value = requestError
    })
</script>

<template>
    <section class="post-card">
        <h2>文章資料</h2>

        <!-- 請求失敗 -->
        <div v-if="error" class="error">
            載入失敗：{{ error.message }}
        </div>

        <!-- 請求成功 -->
        <article v-else-if="data">
            <h3>{{ data.title }}</h3>

            <p>{{ data.body }}</p>

            <small>文章編號：{{ data.id }}</small>
        </article>

        <!-- data 和 error 都是 null，代表仍在等待結果 -->
        <p v-else>
            資料載入中……
        </p>
    </section>
</template>

<style scoped>
.post-card {
    padding: 24px;
    border: 1px solid #cccccc;
    border-radius: 12px;
}

.error {
    padding: 12px;
    border: 1px solid #cc0000;
    border-radius: 8px;
}
</style>