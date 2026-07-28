<script setup>
// defineModel 裡面可以設定型別
const model = defineModel({
    type: String,
    required: true
})

function clearInput() {
    model.value = ''
}
</script>

<template>
    <div class="search-box">
        <input v-model="model" type="text" placeholder="搜尋商品" />

        <button type="button" @click="clearInput">
            清除
        </button>
    </div>
</template>

<style scoped>
.search-box {
    display: flex;
    gap: 8px;
}

input {
    flex: 1;
    padding: 10px;
}

button {
    padding: 10px 16px;
    cursor: pointer;
}
</style>