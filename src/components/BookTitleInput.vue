<script setup>
const title = defineModel('title', {
    type: String,
    required: true
})
</script>

<template>
    <div class="input-group">
        <label for="book-title">
            書籍名稱
        </label>

        <input id="book-title" v-model="title" type="text" placeholder="請輸入書籍名稱" />
    </div>
</template>

<style scoped>
.input-group {
    display: grid;
    gap: 8px;
}

input {
    padding: 10px;
}
</style>