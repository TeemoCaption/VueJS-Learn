<script>
import { getPost } from '../api.js'

export default {
    data() {
        return {
            // 儲存取得的文章
            post: null,

            // 儲存錯誤資訊
            error: null
        }
    },

    // 第一次進入 PostView 前執行
    async beforeRouteEnter(to, from, next) {
        try {
            // 先取得即將進入頁面的文章
            const post = await getPost(to.params.id)

            // 元件建立後，再透過 vm 儲存文章
            next(vm => {
                vm.setPost(post)
            })
        } catch (err) {
            // 將錯誤交給建立完成的元件
            next(vm => {
                vm.setError(err)
            })
        }
    },

    // 已經在 PostView，
    // 但路由參數發生改變時執行
    async beforeRouteUpdate(to, from) {
        // 先清除上一篇文章
        this.post = null
        this.error = null

        try {
            // 使用新的路由參數重新取得文章
            const post = await getPost(to.params.id)

            this.setPost(post)
        } catch (err) {
            this.setError(err)
        }
    },

    methods: {
        // 將文章存入元件
        setPost(post) {
            this.post = post
        },

        // 儲存錯誤資訊
        setError(err) {
            this.error = err.toString()
        }
    }
}
</script>

<template>
    <main>
        <!-- API 發生錯誤 -->
        <p v-if="error">
            {{ error }}
        </p>

        <!-- 成功取得文章 -->
        <article v-else-if="post">
            <h1>{{ post.title }}</h1>

            <p>{{ post.body }}</p>
        </article>

        <!-- 切換文章時暫時顯示 -->
        <p v-else>
            文章載入中...
        </p>
    </main>
</template>