<script setup>
const model = defineModel({
    type: String,
    required: true
})
</script>

<template>
    <div class="message-input">
        <textarea v-model="model" placeholder="請輸入訊息" />

        <p>字數：{{ model.length }}</p>
    </div>
</template>

<style scoped>
.message-input {
    display: grid;
    gap: 8px;
}

textarea {
    min-height: 100px;
    padding: 10px;
    resize: vertical;
}
</style>