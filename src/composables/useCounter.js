import { ref, computed } from 'vue'

/**
 * 建立一個可重複使用的計數器邏輯。
 *
 * @param {number} initialValue 初始數值
 */
export function useCounter(initialValue = 0) {
    // 由組合式函數自行管理響應式狀態。
    const count = ref(initialValue)

    // computed 也可以封裝在組合式函數中。
    const doubleCount = computed(() => count.value * 2)

    function increment() {
        count.value++
    }

    function decrement() {
        count.value--
    }

    function reset() {
        count.value = initialValue
    }

    // 將元件需要使用的狀態與方法回傳出去。
    return {
        count,
        doubleCount,
        increment,
        decrement,
        reset
    }
}
