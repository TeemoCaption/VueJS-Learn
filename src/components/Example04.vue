<script setup>
import { ref, nextTick } from 'vue'

const messages = ref([])

async function addMessage() {

    messages.value.push("Hello")

    await nextTick()

    const chat = document.querySelector(".chat")

    chat.scrollTop = chat.scrollHeight

}
</script>

<template>
    <div class="chat">

        <p v-for="(message, index) in messages" :key="index">

            {{ message }}

        </p>

    </div>

    <button @click="addMessage">

        新增訊息

    </button>
</template>

<style scoped></style>