<script setup>
import { ref } from 'vue'
import { useFetch } from '../composables/useFetch.js'

// url 本身就是響應式 ref。
const url = ref(
    'https://jsonplaceholder.typicode.com/posts/1'
)

const {
    data,
    error,
    isLoading
} = useFetch(url)

function loadFirstPost() {
    url.value =
        'https://jsonplaceholder.typicode.com/posts/1'
}

function loadSecondPost() {
    url.value =
        'https://jsonplaceholder.typicode.com/posts/2'
}
</script>

<template>
    <section>
        <h2>使用 URL ref</h2>

        <button @click="loadFirstPost">
            載入第一篇
        </button>

        <button @click="loadSecondPost">
            載入第二篇
        </button>

        <p v-if="isLoading">
            載入中……
        </p>

        <p v-else-if="error">
            {{ error.message }}
        </p>

        <article v-else-if="data">
            <h3>{{ data.title }}</h3>
            <p>{{ data.body }}</p>
        </article>
    </section>
</template>