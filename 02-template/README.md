# Vue 範本與響應式狀態學習筆記

本單元使用 Vue 與 Vite，練習範本語法、屬性綁定、事件處理、條件渲染、列表渲染、響應式狀態管理，以及 DOM 更新時機。

目前 `App.vue` 會依序載入以下元件：

1. `Temp01.vue`：範本語法與屬性綁定
2. `Example01.vue`：屬性綁定練習
3. `Temp02.vue`：指令與事件
4. `Example02.vue`：指令綜合練習
5. `Temp03.vue`：響應式狀態
6. `Example03.vue`：響應式物件練習
7. `Temp04.vue`：DOM 更新時機與 `nextTick()`
8. `Example04.vue`：訊息列表與 DOM 捲動

## 專案啟動

安裝相依套件：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev
```

建立正式版本：

```bash
npm run build
```

## 一、範本語法與屬性綁定

### 1. 顯示資料與呼叫函式

在 `<script setup>` 中宣告的變數與函式，可以直接在 `<template>` 使用：

```vue
<template>
  <p>{{ firstName + ' ' + lastName }}</p>
  <p>{{ hello() }}</p>
</template>

<script setup>
const firstName = 'Alice'
const lastName = 'Chen'

// 回傳問候文字，供範本顯示
function hello() {
  return 'Hello Vue!'
}
</script>
```

### 2. 條件運算與資料存取

範本可以使用基本的 JavaScript 運算式：

```vue
<!-- 三元運算子 -->
{{ score >= 60 ? '及格' : '不及格' }}

<!-- 存取物件屬性 -->
{{ user.name }}

<!-- 存取陣列元素 -->
{{ fruits[0] }}
```

### 3. `v-html`

`v-html` 會把字串當成 HTML 顯示：

```vue
<p v-html="message"></p>
```

只有在內容來源可信時才適合使用，避免將未經處理的使用者輸入直接放入 `v-html`，以降低跨網站指令碼攻擊風險。

## 二、屬性綁定

### 1. 使用 `v-bind` 或縮寫 `:`

```vue
<img :src="imageUrl" alt="cat">
<a :href="websiteUrl">Vue 官方網站</a>
<button :disabled="isDisabled">送出</button>
```

`:` 的右側可以放變數、運算式或函式回傳值：

```vue
<a :href="`/users/${userId}`">查看使用者</a>
<img :src="getImagePath(filename)" alt="avatar">
```

### 2. 綁定多個屬性

當物件的鍵名與 HTML 屬性名稱相同時，可以使用 `v-bind` 一次綁定：

```vue
<img v-bind="imageAttributes">
```

```js
const imageAttributes = {
  id: 'profile-image',
  src: '/images/avatar.png',
  alt: '使用者大頭貼',
  width: 200
}
```

### 3. 動態屬性名稱

使用方括號把變數當成屬性名稱：

```vue
<button :[attributeName]="attributeValue">
  把滑鼠移到我上面
</button>
```

例如 `attributeName` 是 `title` 時，等同於綁定 `title` 屬性。

### 4. `class` 與 `style` 綁定

```vue
<p :class="{ active: isActive }">文字</p>
<p :style="textColor">動態文字</p>
```

當 `isActive` 為 `true` 時，元素會套用 `active` 類別。

## 三、指令與事件

### 1. 條件渲染：`v-if`

`Temp02.vue` 使用 `v-if` 根據資料決定是否顯示內容：

```vue
<p v-if="isVisible">
  這段文字是否顯示，由資料決定
</p>
```

### 2. 列表渲染：`v-for`

使用 `v-for` 逐一顯示陣列中的資料：

```vue
<li v-for="item in items">
  {{ item }}
</li>
```

實際專案中，列表通常還會搭配唯一的 `:key`，例如：

```vue
<li v-for="item in items" :key="item">
  {{ item }}
</li>
```

### 3. 事件綁定：`v-on` 或縮寫 `@`

```vue
<button @click="showMessage">點我</button>
<button @[eventName]="showMessage">動態事件</button>
```

```js
// 顯示按鈕點擊結果
function showMessage() {
  alert('按鈕被點擊了')
}
```

也可以直接在事件中修改響應式資料：

```vue
<button @click="count++">點我</button>
<p>{{ count }}</p>
```

### 4. 事件修飾符

`@submit.prevent` 會阻止表單預設的重新整理行為：

```vue
<form @submit.prevent="handleSubmit">
  <input type="text" placeholder="請輸入內容">
  <button type="submit">送出</button>
</form>
```

## 四、函式與範本綁定

`Temp02.vue` 中的 `formatName()` 會把名稱轉換成大寫：

```js
// 將傳入的名稱轉換成大寫後回傳
function formatName(name) {
  return name.toUpperCase()
}

const userName = 'alice'
```

```vue
<p>{{ formatName(userName) }}</p>
```

畫面會顯示：

```text
ALICE
```

範本中使用的函式應該以「根據輸入值回傳結果」為主，不要在其中修改狀態、發送請求或執行其他副作用。

## 五、`ref()` 與 `reactive()`

這是本節最重要的比較。

| 比較項目 | `ref()` | `reactive()` |
|---|---|---|
| 可處理基本型別 | 可以 | 不適合 |
| 可處理物件 | 可以 | 可以 |
| 可處理陣列 | 可以 | 可以 |
| `<script>` 是否需要 `.value` | 需要 | 不需要 |
| 能否直接替換整個值 | 可以修改 `.value` | 不建議替換整個物件 |
| 解構風險 | 較容易保留單一 `ref` | 直接解構可能失去響應性 |
| 常見使用方式 | 單一狀態或通用狀態 | 一組相關的物件狀態 |

### 1. `ref()`：適合單一或通用狀態

```js
import { ref } from 'vue'

const count = ref(0)

// 在 script 中修改 ref，需要使用 .value
count.value++
```

在範本中，Vue 會自動取出 `ref` 的值，因此不需要 `.value`：

```vue
<button @click="count++">增加</button>
<p>{{ count }}</p>
```

`ref()` 可以處理基本型別，也可以處理物件與陣列：

```js
const user = ref({ name: 'Alice' })
user.value.name = 'Bob'

const fruits = ref(['Apple', 'Banana'])
fruits.value.push('Orange')
```

### 2. `reactive()`：適合一組相關的物件狀態

`Temp03.vue` 使用 `reactive()` 建立使用者資料：

```js
import { reactive } from 'vue'

const user = reactive({
  name: 'Alice',
  age: 20
})

// 不需要 .value
user.name = 'Bob'
user.age++
```

`reactive()` 也可以處理陣列：

```js
const fruits = reactive(['Apple', 'Banana'])

// 直接修改陣列，不需要 .value
fruits.push('Orange')
fruits[0] = 'Mango'
```

### 3. `reactive()` 不建議直接替換整個物件

以下寫法可能會讓原本建立的響應式連結失效：

```js
// 不建議直接替換 reactive 物件
user = { name: 'Bob', age: 30 }
```

可以使用 `Object.assign()` 修改原本的響應式物件：

```js
// 保留原本的響應式物件，只更新其中的資料
Object.assign(user, {
  name: 'Bob',
  age: 30,
  city: '高雄'
})
```

### 4. 解構 `reactive()` 的響應性風險

直接解構可能失去響應性：

```js
const user = reactive({
  name: 'Alice',
  age: 20
})

// 不建議：解構後可能只剩普通變數
const { name, age } = user
```

若需要解構，使用 `toRefs()` 將每個屬性轉成 `ref`：

```js
import { reactive, toRefs } from 'vue'

const user = reactive({
  name: 'Alice',
  age: 20
})

// 保留每個屬性的響應性
const { name, age } = toRefs(user)

// 在 script 中修改 ref，需要使用 .value
age.value++
```

### 5. 巢狀物件與 `Object.assign()`

`reactive()` 不只可以追蹤第一層屬性，也可以追蹤巢狀物件：

```js
const user = reactive({
  name: 'Alice',
  age: 20,
  address: {
    city: '台北',
    district: '中正區'
  }
})

// 修改巢狀物件也會觸發畫面更新
user.address.city = '高雄'
user.address.district = '苓雅區'
```

若要重設整組資料，不要直接替換 `reactive()` 建立的物件，可以使用 `Object.assign()`：

```js
// 修改原本的響應式物件，保留響應性
Object.assign(user, {
  name: 'Alice',
  age: 20
})

// 巢狀物件也要更新原本的物件
Object.assign(user.address, {
  city: '台北',
  district: '中正區'
})
```

## 六、DOM 更新時機與 `nextTick()`

### 1. Vue 的 DOM 批次更新

當響應式資料改變時，Vue 不一定會立刻修改畫面上的 DOM。Vue 會先記錄需要更新的內容，等目前這段 JavaScript 執行完成後，再集中更新 DOM，這種方式可以減少不必要的畫面更新。

```js
const count = ref(0)

async function increase() {
  count.value++

  // 等待 Vue 完成這次 DOM 更新
  await nextTick()

  const heading = document.querySelector('h1')
  console.log(heading.textContent)
}
```

### 2. `nextTick()` 的用途

當你需要在資料更新後，立刻讀取或操作最新的 DOM，可以使用 `nextTick()`：

```js
import { ref, nextTick } from 'vue'

const messages = ref([])

async function addMessage() {
  messages.value.push('Hello')

  // 確保新訊息已經渲染到 DOM 後，再取得元素高度
  await nextTick()

  const chat = document.querySelector('.chat')
  chat.scrollTop = chat.scrollHeight
}
```

如果沒有等待 `nextTick()`，讀取到的 DOM 可能還沒有包含剛新增的內容，因此捲動位置或元素尺寸可能不正確。

### 3. `Temp04.vue` 與 `Example04.vue` 的練習重點

- `Temp04.vue`：修改 `count` 後，使用 `await nextTick()` 等待標題完成更新，再讀取標題文字。
- `Example04.vue`：新增訊息後，等待列表完成渲染，再將 `.chat` 捲動到最下方。
- `nextTick()` 適合用在「資料改變後，必須操作最新 DOM」的情境，不需要每次修改響應式資料都使用它。

## 七、元件對照表

| 元件 | 學習內容 |
|---|---|
| `Temp01.vue` | 文字插值、函式、條件運算、物件與陣列存取、`v-html`、`v-bind`、動態屬性、`class` 與 `style` |
| `Example01.vue` | 網址、圖片、按鈕狀態與多屬性綁定練習 |
| `Temp02.vue` | `v-if`、`v-for`、函式、計數器、動態屬性、動態事件與表單事件修飾符 |
| `Example02.vue` | `v-bind`、`v-on`、動態事件參數與 `@submit.prevent` 綜合練習 |
| `Temp03.vue` | `reactive()`、`ref()`、`toRefs()`、物件狀態、陣列狀態與狀態更新函式 |
| `Example03.vue` | 巢狀響應式物件、地址資料更新，以及使用 `Object.assign()` 重設資料 |
| `Temp04.vue` | DOM 批次更新、`nextTick()` 與更新後讀取 DOM |
| `Example04.vue` | `ref()` 訊息陣列、`v-for` 列表、`nextTick()` 與聊天區域自動捲動 |

## 八、學習重點整理

1. `<script setup>` 中宣告的資料與函式，可以直接在 `<template>` 使用。
2. `v-bind` 可以縮寫成 `:`，`v-on` 可以縮寫成 `@`。
3. 動態屬性使用 `:[變數]`，動態事件使用 `@[變數]`。
4. `v-if` 控制元素是否渲染，`v-for` 用來重複渲染列表。
5. `ref()` 在 `<script>` 中需要透過 `.value` 讀寫；在範本中通常會自動解包。
6. `reactive()` 適合管理一組相關的物件或陣列狀態。
7. 解構 `reactive()` 物件時，應使用 `toRefs()` 保留響應性。
8. `reactive()` 可以追蹤巢狀物件，但重設資料時應使用 `Object.assign()` 保留響應性。
9. Vue 會批次更新 DOM，資料改變後不一定能立即讀到最新畫面。
10. 需要操作最新 DOM 時，使用 `await nextTick()` 等待畫面更新完成。
11. 元件中的函式應盡量保持單純，避免在範本重新渲染時產生不必要的副作用。
