# Vue 03：條件判斷、列表渲染與資料過濾

本練習使用 Vue 3 與 Vite，學習如何根據資料狀態決定畫面內容、重複渲染資料，以及透過計算屬性產生適合顯示的資料。

## 學習內容

| 元件 | 主題 | 重點 |
| --- | --- | --- |
| `Temp01.vue` | 條件判斷 | `v-if`、`v-else`、`v-show` |
| `Temp02.vue` | 列表渲染 | `v-for`、索引、巢狀列表、`key` |
| `Temp03.vue` | 過濾與排序 | `computed`、`filter()`、搭配 `v-if` |

## 專案結構

```text
03/
├─ src/
│  ├─ App.vue                 # 載入三個練習元件
│  └─ components/
│     ├─ Temp01.vue           # 條件判斷
│     ├─ Temp02.vue           # 列表渲染
│     └─ Temp03.vue           # 過濾與顯示列表
├─ index.html
├─ package.json
└─ vite.config.js
```

## 一、條件判斷：`v-if` 與 `v-show`

### `v-if`、`v-else`

`v-if` 會根據條件決定元素是否存在於畫面中；條件為假時，Vue 不會建立該元素。`v-else` 必須緊接在 `v-if` 或 `v-else-if` 後面。

```vue
<template>
    <!-- 切換購物車是否有商品 -->
    <button @click="hasProducts = !hasProducts">
        切換購物車狀態
    </button>

    <!-- 有商品時顯示購物車內容 -->
    <template v-if="hasProducts">
        <h2>購物車</h2>
        <p>目前共有 3 件商品</p>
    </template>

    <!-- 沒有商品時顯示提示訊息 -->
    <template v-else>
        <h2>購物車是空的</h2>
        <p>快去挑選喜歡的商品吧！</p>
    </template>
</template>

<script setup>
import { ref } from 'vue'

// 儲存購物車是否有商品的響應式狀態
const hasProducts = ref(true)
</script>
```

### `v-show`

`v-show` 會保留元素，只切換元素的 `display` 樣式。適合頻繁顯示與隱藏的內容，但不能套用在 `<template>` 上。

```vue
<!-- 點擊後切換文字的顯示狀態 -->
<button @click="isVisible = !isVisible">顯示／隱藏</button>
<h2 v-show="isVisible">我是由 v-show 控制的文字</h2>
```

簡單區分：

- `v-if`：適合較少切換、需要真正建立或移除元素的情境。
- `v-show`：適合經常切換顯示狀態的情境。

## 二、列表渲染：`v-for`

### 渲染陣列

`v-for` 可以逐一取出陣列中的資料。`in` 也可以寫成 `of`。

```vue
<ul>
    <!-- 將 students 中的每個學生名稱渲染成 li -->
    <li v-for="student in students" :key="student">
        {{ student }}
    </li>
</ul>
```

### 渲染物件陣列與 `key`

當資料是物件陣列時，可以直接使用物件屬性。`key` 應該使用每筆資料唯一且穩定的識別值，協助 Vue 正確追蹤元素。

```vue
<!-- 將每項商品的名稱與價格顯示在畫面上 -->
<template v-for="product in products" :key="product.id">
    <h2>{{ product.name }}</h2>
    <p>價格：NT$ {{ product.price }}</p>
</template>
```

### 取得索引與刪除資料

```vue
<li v-for="(student, index) in students" :key="student">
    <!-- index 從 0 開始，因此顯示時加 1 -->
    {{ index + 1 }}：{{ student }}
    <button @click="removeStudent(index)">刪除</button>
</li>
```

```js
// 刪除 students 中指定索引的學生
function removeStudent(index) {
    students.value.splice(index, 1)
}
```

### 巢狀 `v-for` 與整數迴圈

`v-for` 可以逐層渲染班級與班級中的學生，也可以直接接收整數，例如 `v-for="number in 5"` 會依序產生 `1` 到 `5`。

```vue
<!-- 依序顯示 1 到 5 -->
<span v-for="number in 5" :key="number">
    {{ number }}
</span>
```

## 三、過濾資料：`computed` 與 `filter()`

`computed` 適合用來根據響應式資料計算出另一份資料。當它依賴的資料改變時，計算結果會自動更新，並且會快取結果。

```vue
<template>
    <!-- 只顯示尚未完成的待辦事項 -->
    <li v-for="todo in incompleteTodos" :key="todo.id">
        {{ todo.title }}
    </li>
</template>

<script setup>
import { computed, ref } from 'vue'

// 儲存所有待辦事項
const todos = ref([
    { id: 1, title: '學習 Vue', isComplete: false },
    { id: 2, title: '完成作業', isComplete: true },
    { id: 3, title: '複習 JavaScript', isComplete: false }
])

// 過濾出尚未完成的待辦事項
const incompleteTodos = computed(() => {
    return todos.value.filter(todo => !todo.isComplete)
})
</script>
```

上例中，`filter()` 不會修改原本的 `todos`，而是回傳一個只包含未完成項目的新陣列。

## 四、條件判斷與列表渲染一起使用

`Temp03.vue` 使用 `v-if` 控制整個待辦列表是否顯示，再使用 `v-for` 渲染資料：

```vue
<!-- 按鈕控制 shouldShowTodos，決定列表是否存在 -->
<button @click="shouldShowTodos = !shouldShowTodos">
    {{ shouldShowTodos ? '隱藏列表' : '顯示列表' }}
</button>

<!-- 只有 shouldShowTodos 為 true 時才渲染列表 -->
<ul v-if="shouldShowTodos">
    <li v-for="todo in todos" :key="todo.id">
        {{ todo.title }}
    </li>
</ul>
```

## 五、元件載入方式

`App.vue` 透過 `script setup` 匯入並使用三個元件：

```vue
<script setup>
import Temp01 from './components/Temp01.vue'
import Temp02 from './components/Temp02.vue'
import Temp03 from './components/Temp03.vue'
</script>

<template>
    <Temp01 />
    <Temp02 />
    <Temp03 />
</template>
```

在 `script setup` 中匯入元件後，就能直接在範本使用，不需要另外撰寫 `components` 設定。

## 執行專案

第一次使用時安裝依賴套件：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev
```

建置正式版本：

```bash
npm run build
```

## 重點整理

1. `v-if` 會建立或移除元素，`v-show` 則只切換 `display`。
2. `v-for` 可以渲染陣列、物件陣列、巢狀資料，以及整數範圍。
3. 列表渲染應提供穩定且唯一的 `:key`。
4. `ref` 的陣列在 JavaScript 中要透過 `.value` 存取。
5. `computed` 適合處理由既有響應式資料推導出的結果。
