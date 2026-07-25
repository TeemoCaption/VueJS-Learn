<script setup>
// defineModel 用來定義雙向數據綁定的模型
// 會得到一個 ref，可以在 JavaScript 中使用，也可以在 Template 裡直接使用
const model = defineModel()

// 這邊是傳統的寫法，defineModel() 可以讓我們不用打以下這些
const props = defineProps({
    modelValue: {
        type: String,
        required: true
    }
})

const emit = defineEmits([
    'update:modelValue'
])

function handleInput(event) {
    emit(
        'update:modelValue',
        event.target.value
    )
}
</script>

<template>
    <div class="input-group">
        <label for="custom-input">
            使用者名稱
        </label>

        <input id="custom-input" v-model="model" type="text" placeholder="請輸入使用者名稱" />
    </div>
    <br>
    <div class="input-group">
        <label for="custom-input">
            使用者名稱
        </label>
        <input id="custom-input" :value="props.modelValue" type="text" placeholder="請輸入使用者名稱" @input="handleInput" />
    </div>
</template>
<style scoped>
.input-group {
    display: grid;
    gap: 8px;
}

input {
    padding: 10px;
    border: 1px solid #cccccc;
    border-radius: 6px;
}
</style>
