<script setup>
import { computed, useAttrs, watch, onUpdated } from 'vue'


// 如果一個值會影響元件邏輯，通常就應該把它設計成 Prop。
// 將 defineProps() 回傳的 Props 物件存入 props，供元件邏輯使用。
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    }
})

defineOptions({
    inheritAttrs: false
})


// useAttrs() 回傳的物件不是完全響應式的
// attrs 物件會隨元件更新取得最新值，但它不是像 ref() 或 reactive() 那樣，可以被 watch() 完整追蹤的響應式物件。
const attrs = useAttrs()

const isDisabled = computed(() => {
    return attrs.disabled !== undefined
})

// 不能把 useAttrs() 當成一般的 reactive() 資料來依賴。
// 如果真的需要監聽時怎麼辦？
// 方法一：把重要資料宣告成 Prop
watch(
    () => props.placeholder,
    newValue => {
        console.log('placeholder 改變：', newValue)
    }
)

// 方法二：在 onUpdated() 中讀取最新 attrs
// onUpdated() 是在每次元件更新後執行的生命周期鉤子
onUpdated(() => {
    console.log('更新後的 attrs：', attrs)
})

const isPasswordInput = computed(() => {
    return attrs.type === 'password'
})

console.log(attrs)
</script>

<template>
    <div class="input-group">
        <label :for="attrs.id">
            {{ label }}
        </label>

        <input v-bind="$attrs" :placeholder="placeholder">
        <p v-if="isDisabled">
            此輸入框目前不可使用
        </p>
        <br>
        <small v-if="isPasswordInput">
            密碼請至少輸入 8 個字元
        </small>
    </div>
</template>

<style scoped>
.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
}
</style>
