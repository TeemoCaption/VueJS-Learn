# Vue 05：元件通訊、雙向綁定與狀態管理學習筆記

本單元以 `src/App.vue` 作為父元件，搭配多個可重複使用的單一檔案元件，練習 Vue 中最重要的資料流觀念：

1. 父元件透過 `props` 將資料傳給子元件。
2. 子元件透過事件將使用者操作通知父元件。
3. `v-model` 將「傳入資料」與「更新資料」整合成雙向綁定介面。
4. `ref`、`computed` 與外部模組分別示範區域狀態、衍生狀態與共享狀態。

---

## 一、執行專案

在 `05/` 資料夾內執行：

```bash
npm install
npm run dev
```

建立正式環境版本：

```bash
npm run build
npm run preview
```

程式碼格式化：

```bash
npm run format
```

### 專案啟動流程

`src/main.js` 依序完成以下工作：

```js
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

- `createApp(App)`：建立應用程式實例。
- `app.use(createPinia())`：註冊 Pinia，讓元件可以使用集中式狀態。
- `app.use(router)`：註冊路由。目前 `src/router/index.js` 的 `routes` 是空陣列，因此本單元主要仍由 `App.vue` 呈現內容。
- `app.mount('#app')`：將應用程式掛載至 `index.html` 中的 `#app` 元素。

---

## 二、單一檔案元件與元件化

每個 `.vue` 檔案通常由三個區塊組成：

```vue
<script setup>
// JavaScript 邏輯
</script>

<template>
  <!-- 畫面結構 -->
</template>

<style scoped>
/* 只作用於此元件的樣式 */
</style>
```

元件化的重點不是把畫面任意切小，而是將具有清楚責任的功能封裝起來。例如：

- `ProfileCard.vue`：顯示人物資料。
- `ProductCard.vue`：顯示單一商品並回報商品操作。
- `CourseCard.vue`：顯示課程資訊、主題與報名狀態。
- `MessageCard.vue`：管理自己的顯示與隱藏狀態。
- `ProfileForm.vue`：編輯會員姓名、信箱與年齡。

父元件只需要提供資料與監聽事件，不必知道子元件內部的畫面細節。

---

## 三、Props：父元件傳資料給子元件

### 3.1 靜態值與動態值

在 `App.vue` 中：

```vue
<ProfileCard name="agent01" job="負責睡覺" :age="1" :is-online="true" />
```

- `name="agent01"`：沒有 `:`，內容會被當成字串。
- `:age="1"`：使用 `v-bind` 傳入數字 `1`，不是字串 `'1'`。
- `:is-online="true"`：傳入布林值 `true`。
- HTML 屬性使用連字號 `is-online`，在 JavaScript 中對應 `isOnline`。

### 3.2 宣告 Props

`ProfileCard.vue` 使用物件形式宣告 Props：

```js
const props = defineProps({
  name: String,
  job: String,
  age: Number,
  isOnline: Boolean
})
```

子元件可以在範本中直接使用 `name`、`age`，也可以在 JavaScript 中使用 `props.name`、`props.age`。

### 3.3 Props 的單向資料流

資料流方向是：

```text
父元件 ── props ──> 子元件
父元件 <── event ── 子元件
```

子元件不應直接修改 Props。若子元件需要改變父元件的資料，應該發送事件，讓父元件決定如何更新自己的狀態。

### 3.4 型別、必填值與預設值

`CourseCard.vue` 示範了較完整的 Props 設計：

```js
defineProps({
  title: {
    type: String,
    required: true,
    validator(value) {
      return value.trim().length >= 2
    }
  },
  price: {
    type: Number,
    default: 0,
    validator(value) {
      return value >= 0
    }
  },
  topics: {
    type: Array,
    default: () => []
  }
})
```

重要觀念：

- `required: true`：父元件必須提供此值。
- `default`：沒有傳值時使用預設值。
- 陣列與物件的預設值要使用函式，例如 `default: () => []`，避免不同元件實例共用同一個陣列或物件。
- `validator`：檢查傳入值是否符合元件預期，但主要是開發階段的警告，不應取代真正的執行流程檢查。

`UserCard.vue` 則示範物件預設值：

```js
default: () => ({
  name: '匿名使用者',
  age: 0
})
```

---

## 四、事件：子元件通知父元件

### 4.1 宣告與發送事件

`ProductCard.vue` 使用 `defineEmits` 宣告事件：

```js
const emit = defineEmits([
  'add-product',
  'toggle-favorite',
  'delete-product'
])
```

觸發事件時，可以把資料當成額外參數傳出：

```js
function addToCart() {
  emit('add-product', props.product)
}
```

父元件監聽事件：

```vue
<ProductCard
  :product="product"
  @add-product="handleAddProduct"
  @toggle-favorite="toggleFavorite"
  @delete-product="deleteProduct"
/>
```

父元件的處理函式會收到子元件傳出的商品物件：

```js
function handleAddProduct(product) {
  cartMessage.value =
    `已加入：${product.name}，商品編號 ${product.id}，價格 NT$ ${product.price}`
}
```

### 4.2 事件可以傳遞多個參數

`AddButton.vue` 發送一個數字：

```js
emit('add', 5)
```

父元件使用 `$event` 取得這個數值：

```vue
<AddButton @add="count += $event" />
```

這裡的 `$event` 就是子元件事件傳出的 `5`。若需要傳遞多個資料，通常可以傳入物件，讓事件參數更容易閱讀與擴充。

### 4.3 `v-for`、`:key` 與事件

商品列表使用：

```vue
<ProductCard
  v-for="product in products"
  :key="product.id"
  :product="product"
  @add-product="handleAddProduct"
/>
```

- `v-for`：依序產生多個商品元件。
- `:key="product.id"`：提供穩定且唯一的識別值，協助 Vue 正確更新列表。
- 每個 `ProductCard` 都會收到自己的商品資料，事件則共用同一個父元件處理函式。

---

## 五、元件實例與狀態範圍

### 5.1 每個元件實例擁有自己的狀態

`MessageCard.vue` 內部宣告：

```js
const isVisible = ref(false)
```

`App.vue` 放入三次：

```vue
<MessageCard />
<MessageCard />
<MessageCard />
```

Vue 會建立三個不同的元件實例，因此每張卡片的 `isVisible` 互不影響。點擊其中一張卡片，只會切換該卡片的訊息。

### 5.2 元件外部的共享狀態

`CounterButton.vue` 同時使用兩種計數：

```js
const count = ref(0)
import { sharedCount } from '../scripts/sharedCounter.js'
```

- `count` 宣告在元件內，所以每個按鈕各自計算點擊次數。
- `sharedCount` 宣告在外部模組，所有 `CounterButton` 實例共同使用同一個值。

因此畫面同時呈現：

```text
元件自己的點擊次數：各自獨立
sharedCount：所有按鈕共用
```

這種方式適合簡單的共享狀態示範；當資料量與元件關係變複雜時，應考慮使用 Pinia。

### 5.3 Pinia Store

`src/stores/counter.js` 使用組合式寫法建立 Store：

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

- `count`：Store 的狀態。
- `doubleCount`：根據狀態計算而來的衍生值。
- `increment`：集中管理狀態更新的方法。
- `return`：將需要被元件使用的狀態、計算值與方法公開出去。

本檔案已建立 Store，但目前 `App.vue` 尚未實際呼叫 `useCounterStore()`；因此不要把 `counter.js` 的計數誤認成畫面目前使用的 `count`。

---

## 六、`v-model` 與 `defineModel`

### 6.1 原生輸入元素的 `v-model`

`App.vue` 中的原生輸入框：

```vue
<input v-model="message" type="text" />
<p>目前內容：{{ message }}</p>
```

`v-model` 會將輸入框的值同步到 `message`。概念上接近：

```vue
<input
  :value="message"
  @input="message = $event.target.value"
/>
```

### 6.2 子元件使用單一 `v-model`

`MessageInput.vue`：

```js
const model = defineModel({
  type: String,
  required: true
})
```

父元件：

```vue
<MessageInput v-model="message" />
```

子元件內部直接使用：

```vue
<textarea v-model="model" />
<p>字數：{{ model.length }}</p>
```

`defineModel()` 將以下兩件事包裝起來：

1. 接收父元件傳入的 `modelValue`。
2. 透過 `update:modelValue` 事件通知父元件更新。

### 6.3 `defineModel` 與傳統寫法比較

`CustomInput.vue` 同時示範簡化寫法與傳統寫法。

簡化寫法：

```js
const model = defineModel()
```

傳統寫法需要自行宣告：

```js
const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}
```

因此，`defineModel` 的價值在於減少樣板程式碼，但仍然要理解它背後的 Props 與事件資料流，遇到複雜需求時才知道如何排錯。

### 6.4 具名 `v-model`

`BookTitleInput.vue` 使用具名模型：

```js
const title = defineModel('title', {
  type: String,
  required: true
})
```

父元件對應為：

```vue
<BookTitleInput v-model:title="bookTitle" />
```

具名模型適合一個元件需要管理多種不同資料的情況，避免所有資料都擠在單一 `modelValue` 中。

### 6.5 多個具名 `v-model`

`UserNameForm.vue` 宣告兩個模型：

```js
const firstName = defineModel('firstName', { type: String })
const lastName = defineModel('lastName', { type: String })
```

父元件可以分別綁定：

```vue
<UserNameForm
  v-model:first-name="firstName"
  v-model:last-name="lastName"
/>
```

每個模型都有自己的資料流：

```text
firstName <-> v-model:first-name
lastName  <-> v-model:last-name
```

### 6.6 `v-model` 修飾符

`ProfileForm.vue` 使用：

```vue
<input v-model.number="age" type="number" />
```

`.number` 會嘗試將輸入值轉換成數字，讓 `age` 更符合 `Number` 型別的預期。這在表單資料需要進行數學運算時特別重要。

---

## 七、`computed`：從狀態產生衍生值

`App.vue` 中的完整姓名：

```js
const firstName = ref('小明')
const lastName = ref('王')

const fullName = computed(() => {
  return `${lastName.value}${firstName.value}`
})
```

`fullName` 不需要另外儲存，因為它可以由 `firstName` 與 `lastName` 推導出來。

使用時機：

- 需要根據現有狀態計算畫面資料。
- 計算結果應該隨依賴資料自動更新。
- 不希望在範本中放入太複雜的運算。

注意：在 JavaScript 中讀取 `ref` 要使用 `.value`；在範本中 Vue 會自動解包，因此可以直接寫 `{{ count }}`。

---

## 八、條件與列表渲染

### 8.1 條件渲染

`CourseCard.vue` 根據課程難度顯示文字：

```vue
<span v-if="level === 'beginner'">初階</span>
<span v-else-if="level === 'intermediate'">中階</span>
<span v-else>進階</span>
```

根據陣列是否有資料決定顯示內容：

```vue
<ul v-if="topics.length > 0">
  <li v-for="topic in topics" :key="topic">{{ topic }}</li>
</ul>
<p v-else>尚未設定課程主題</p>
```

### 8.2 布林值控制畫面

```vue
<button :disabled="!isOpen">
  {{ isOpen ? '立即報名' : '停止報名' }}
</button>
```

- `:disabled` 將布林值綁定到原生屬性。
- `!isOpen` 為 `true` 時，按鈕會被停用。
- 三元運算子依據狀態顯示不同文字。

---

## 九、元件對照表

| 檔案 | 主要觀念 | 父子元件資料流 |
| --- | --- | --- |
| `ProfileCard.vue` | Props、型別宣告、`computed` | 父傳人物資料 |
| `ProductCard.vue` | Props、`defineEmits`、事件參數 | 父傳商品；子回報操作 |
| `CourseCard.vue` | Props 預設值、驗證器、`v-if`、`v-for` | 父傳課程資料 |
| `TagList.vue` | 陣列 Props、陣列預設值 | 父傳標籤陣列 |
| `UserCard.vue` | 物件 Props、物件預設值 | 父傳使用者物件 |
| `MessageCard.vue` | 元件實例自己的 `ref` | 狀態留在子元件內 |
| `CounterButton.vue` | 區域狀態與外部共享狀態 | 不使用 Props 或事件 |
| `AddButton.vue` | `defineEmits`、事件參數、`$event` | 子傳數字給父 |
| `CustomInput.vue` | `defineModel` 與傳統 `v-model` | 父子雙向同步 |
| `MessageInput.vue` | 單一 `defineModel` | 父子雙向同步 |
| `SearchInput.vue` | `defineModel`、子元件清除模型 | 父子雙向同步 |
| `BookTitleInput.vue` | 具名 `v-model` | 綁定 `title` 模型 |
| `UserNameForm.vue` | 多個具名 `v-model` | 同時綁定名字與姓氏 |
| `ProfileForm.vue` | 多個模型、`.number` | 同時綁定會員資料 |
| `src/scripts/sharedCounter.js` | 外部模組共享狀態 | 多個元件共用同一個 `ref` |
| `src/stores/counter.js` | Pinia Store | 集中管理狀態與方法 |

---

## 十、常見錯誤與排查方向

### 1. 數字或布林值被當成字串

錯誤：

```vue
<CourseCard price="1200" :is-open="false" />
```

`price="1200"` 是字串，應改為：

```vue
<CourseCard :price="1200" :is-open="false" />
```

### 2. 直接修改 Props

子元件不應直接寫入 `props.product` 或其他 Props。應使用 `emit` 通知父元件，由父元件更新資料。

### 3. 忘記 `v-for` 的 `:key`

列表渲染應提供穩定識別值，例如 `:key="product.id"`，不要只依賴陣列索引，尤其是列表可能新增、刪除或重新排序時。

### 4. 忘記在 JavaScript 使用 `.value`

```js
count.value++
```

範本中則可直接寫：

```vue
{{ count }}
```

### 5. 混淆元件區域狀態與共享狀態

`CounterButton.vue` 的 `count` 是每個元件獨立的；`sharedCount` 是所有實例共用的。判斷狀態放置位置時，要先問：「這份資料應該只有一個元件使用，還是多個元件需要共同讀寫？」

### 6. 只會使用 `defineModel`，卻不了解背後事件

遇到 `v-model` 不更新時，檢查以下三點：

1. 父元件的模型名稱是否與子元件的 `defineModel` 名稱一致。
2. 子元件是否真的透過模型更新值。
3. 若採用傳統寫法，事件名稱是否為 `update:modelValue` 或對應的 `update:<模型名稱>`。

---

## 十一、學習重點總結

本單元最重要的不是記住每個元件的名稱，而是理解以下資料流：

```text
父元件狀態
   │
   ├── props ──> 子元件顯示資料
   │
   ├── v-model ──> 子元件編輯資料並回傳更新
   │
   └── 事件 <── 子元件回報使用者操作
```

可以用三個問題檢查自己的設計：

1. 這份資料的擁有者是哪個元件？
2. 子元件只需要讀取資料，還是也需要要求父元件更新資料？
3. 這份狀態是單一元件使用，還是多個元件需要共享？

若能回答這三個問題，就能較自然地選擇 `props`、事件、`v-model`、`computed` 或 Pinia。
