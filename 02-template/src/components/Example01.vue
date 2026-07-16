<template>
    <main>
        <h1>第一小節-Attribute Binding練習</h1>
        <a :href="websiteUrl">
            {{ websiteName }}
        </a>
        <br>
        <img v-bind="imageInfo">
        <br>
        <button :disabled="isDisabled" :title="buttonDescription">
            送出
        </button>
    </main>
</template>

<script setup>
const websiteName = 'Vue 官方網站'
const websiteUrl = 'https://cn.vuejs.org/'

const imageInfo = {
    src: 'https://vuejs.org/images/logo.png',
    alt: 'Vue Logo',
    width: 120
}

const isDisabled = true
const buttonDescription = '目前無法送出'
</script>

<style scoped></style>