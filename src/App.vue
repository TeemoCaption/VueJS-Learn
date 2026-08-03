<script setup>
import { ref } from 'vue'
import { formatPrice } from './utils/formatPrice.js'
import { useCounter } from './composables/useCounter.js'
import MouseTracker from './components/MouseTracker.vue'
import MouseStatus from './components/MouseStatus.vue'

// 商品價格會改變，但 formatPrice 本身沒有管理任何狀態。
const price = ref(1200)

// 邏輯復用：呼叫組合式函數，取得它提供的狀態與方法。
// 這和直接寫在元件裡有點不同
// 假設另外三個元件也需要同樣的計數器邏輯，可能就會複製三次相同的函式
const {
  count,
  doubleCount,
  increment,
  decrement,
  reset
} = useCounter(10)
</script>

<template>
  <main class="container">
    <div>
      <h1>商品價格</h1>

      <p>目前價格：{{ formatPrice(price) }}</p>

      <button @click="price += 100">
        價格增加 100 元
      </button>
    </div>
    <div>
      <h1>組合式函數計數器</h1>

      <p>目前數值：{{ count }}</p>
      <p>兩倍數值：{{ doubleCount }}</p>

      <div class="buttons">
        <button @click="decrement">減少</button>
        <button @click="increment">增加</button>
        <button @click="reset">重設</button>
      </div>
    </div>
    <div>
      <h1>Vue 組合式函數</h1>
      <MouseTracker />
    </div>
    <div>
      <h1>Vue 組合式函數</h1>

      <div class="cards">
        <MouseTracker />
        <MouseStatus />
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  font-family: sans-serif;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.buttons {
  display: flex;
  gap: 12px;
}

.cards {
  display: grid;
  gap: 20px;
}
</style>
