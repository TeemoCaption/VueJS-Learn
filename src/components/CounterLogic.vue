<script setup>
import { computed, ref } from 'vue'

// 接收父元件設定。
const props = defineProps({
    // 計數器初始值。
    initialValue: {
        type: Number,
        default: 0
    },

    // 每次增加或減少的數量。
    step: {
        type: Number,
        default: 1
    },

    // 允許的最小值。
    min: {
        type: Number,
        default: 0
    },

    // 允許的最大值。
    max: {
        type: Number,
        default: 10
    }
})

// 建立目前的計數值。
const count = ref(props.initialValue)

// 判斷是否已經到達最小值。
const isMin = computed(() => {
    return count.value <= props.min
})

// 判斷是否已經到達最大值。
const isMax = computed(() => {
    return count.value >= props.max
})

/**
 * 增加計數值。
 */
function increase() {
    if (isMax.value) {
        return
    }

    count.value = Math.min(
        count.value + props.step,
        props.max
    )
}

/**
 * 減少計數值。
 */
function decrease() {
    if (isMin.value) {
        return
    }

    count.value = Math.max(
        count.value - props.step,
        props.min
    )
}

/**
 * 將計數器恢復成初始值。
 */
function reset() {
    count.value = props.initialValue
}
</script>

<template>
    <!--
    CounterLogic 不決定使用按鈕、卡片或文字。

    它只提供：
    - count
    - increase
    - decrease
    - reset
    - isMin
    - isMax
  -->
    <slot :count="count" :increase="increase" :decrease="decrease" :reset="reset" :is-min="isMin" :is-max="isMax" />
</template>