<script setup>
import ProfileCard from './components/ProfileCard.vue'
import CounterButton from './components/CounterButton.vue'
import MessageCard from './components/MessageCard.vue'
import ProductCard from './components/ProductCard.vue'

const products = [
  {
    id: 1,
    name: '機械式鍵盤',
    price: 2590,
    inStock: true
  },
  {
    id: 2,
    name: '無線滑鼠',
    price: 1290,
    inStock: false
  },
  {
    id: 3,
    name: '27 吋螢幕',
    price: 6990,
    inStock: true
  }
]
</script>

<template>
  <div class="card">
    <h1>人物介紹</h1>
    <!-- Props 是單向資料流，父元件流向子元件 -->
    <!-- 動態傳值要使用 v-bind，動態值有數值、布林值，沒有冒號，內容通常當成普通字串 -->
    <ProfileCard name="agent01" job="負責睡覺" :age="1" :is-online="true" />
    <ProfileCard name="agent02" job="負責吃飯" :age="2" :is-online="true" />
    <ProfileCard name="agent03" job="負責記帳" :age="3" :is-online="true" />
  </div>
  <br>
  <div class="count">
    <h1>獨立計數器</h1>
    <!-- 每出現一次，Vue 就會建立一個新的元件實例。 -->
    <CounterButton />
    <CounterButton />
    <CounterButton />
  </div>
  <div>
    <h1>訊息卡片</h1>

    <MessageCard />
    <MessageCard />
    <MessageCard />
  </div>
  <div class="product-list">
    <ProductCard v-for="product in products" :key="product.id" :name="product.name" :price="product.price"
      :in-stock="product.inStock" />
  </div>
</template>

<style scoped>
.count {
  max-width: 700px;
  margin: 40px auto;
}

.card {
  display: grid;
  gap: 16px;
  max-width: 700px;
  margin: 40px auto;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
</style>
