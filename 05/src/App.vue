<script setup>
import { computed, ref } from 'vue'
import ProfileCard from './components/ProfileCard.vue'
import CounterButton from './components/CounterButton.vue'
import MessageCard from './components/MessageCard.vue'
import ProductCard from './components/ProductCard.vue'
import TagList from './components/TagList.vue'
import UserCard from './components/UserCard.vue'
import CourseCard from './components/CourseCard.vue'
import AddButton from './components/AddButton.vue'
import CustomInput from './components/CustomInput.vue'
import SearchInput from './components/SearchInput.vue'
import MessageInput from './components/MessageInput.vue'
import BookTitleInput from './components/BookTitleInput.vue'
import UserNameForm from './components/UserNameForm.vue'
import ProfileForm from './components/ProfileForm.vue'

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
    //price: 1290,
    inStock: false
  },
  {
    id: 3,
    name: '27 吋螢幕',
    price: 6990,
    inStock: true
  }
]

const cartMessage = ref('尚未加入商品')
// product 參數分別對應到 ProductCard 组件中 emit 的參數
function handleAddProduct(product) {
  cartMessage.value =
    `已加入：${product.name}，商品編號 ${product.id}，價格 NT$ ${product.price}`
}

function toggleFavorite(product) {
  console.log('切換收藏：', product.id)
}

function deleteProduct(product) {
  console.log('刪除商品：', product.id)
}

const courseTags = [
  'Vue',
  'JavaScript',
  'Frontend'
]

const currentUser = {
  name: '小明',
  age: 25
}

const vueTopics = [
  'Template 語法',
  '響應式系統',
  '元件與 Props'
]

const advancedTopics = [
  'Composition API',
  'Pinia',
  'Vue Router'
]

const count = ref(0)

function increaseCount(amount) {
  count.value += amount
}

const username = ref('')
const keyword = ref('')
const message = ref('')
const bookTitle = ref('Vue.js 入門')

const firstName = ref('小明')
const lastName = ref('王')

// 計算屬性
const fullName = computed(() => {
  return `${lastName.value}${firstName.value}`
})

const name = ref('王小明')
const email = ref('ming@example.com')
const age = ref(25)
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
  <br>
  <div>
    <h1>商品列表</h1>
    <p>{{ cartMessage }}</p>
    <div class="product-list">
      <ProductCard v-for="product in products" :key="product.id" :product="product" @add-product="handleAddProduct"
        @toggle-favorite="toggleFavorite" @delete-product="deleteProduct" />
    </div>
  </div>
  <br>
  <div class="tag-list">
    <TagList :tags="courseTags" />
  </div>
  <div class="user-card">
    <UserCard :user="currentUser" />
  </div>
  <br>
  <h1>課程列表</h1>
  <div class="course-list">
    <CourseCard title="Vue 3 入門" instructor="王老師" :price="1200" level="beginner" :topics="vueTopics" />

    <CourseCard title="Vue 3 進階實戰" instructor="林老師" :price="2800" level="advanced" :topics="advancedTopics"
      :is-open="false" />

    <CourseCard title="免費 Vue 體驗課" />
  </div>
  <br>
  <div>
    <h1>目前數量：{{ count }}</h1>
    <!-- @add 對應 emit 的事件名稱 -->
    <!-- $event 是事件物件，這裡的值就是 5 -->
    <!-- 在 Template 中，ref 會自動解包，因此可以寫 -->
    <AddButton @add="count += $event" />
  </div>
  <br>
  <div class="container">
    <h1>原生輸入框</h1>
    <!-- v-model 會自動處理 input 事件，將值綁定到 message -->
    <!-- 類似於 :value="message" 和 @input="message = $event.target.value" -->
    <input v-model="message" type="text" placeholder="請輸入內容" />
    <p>目前內容：{{ message }}</p>
  </div>
  <div class="container">
    <h1>會員資料</h1>
    <!-- Vue 會把它展開成類似 :model-value="username"  @update:model-value="username = $event" -->
    <CustomInput v-model="username" />
    <p>父元件中的 username：{{ username }}</p>
  </div>
  <div class="container">
    <h1>商品搜尋</h1>
    <SearchInput v-model="keyword" />
    <p>目前關鍵字：{{ keyword }}</p>
    <button type="button" @click="keyword = 'Vue'">
      父元件設定為 Vue
    </button>
  </div>
  <div class="container">
    <h1>留言區</h1>
    <MessageInput v-model="message" />
    <h2>預覽</h2>
    <p>{{ message }}</p>
  </div>
  <div class="container">
    <h1>編輯書籍</h1>
    <BookTitleInput v-model:title="bookTitle" />
    <p>目前書名：{{ bookTitle }}</p>
  </div>
  <div class="container">
    <h1>編輯姓名</h1>
    <!-- 兩個 v-model 會分別綁定到組件的 firstName 和 lastName -->
    <UserNameForm v-model:first-name="firstName" v-model:last-name="lastName" />
    <p>完整姓名：{{ fullName }}</p>
  </div>
  <div class="container">
    <h1>會員資料</h1>

    <ProfileForm v-model:name="name" v-model:email="email" v-model:age="age" />

    <section class="preview">
      <h2>資料預覽</h2>

      <p>姓名：{{ name }}</p>
      <p>信箱：{{ email }}</p>
      <p>年齡：{{ age }}</p>
    </section>
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

.course-list {
  display: grid;
  gap: 20px;
}

.container {
  max-width: 600px;
  margin: 40px auto;
}

p {
  margin-top: 16px;
}
</style>
