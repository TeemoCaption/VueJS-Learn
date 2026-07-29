# Vue 插槽學習筆記

## 這一章要學什麼？

插槽要解決的問題是：**子元件負責固定版面，父元件仍能決定裡面要顯示什麼。**

可以先記住這句話：

> **屬性傳資料，插槽傳畫面；作用域插槽讓子元件把資料提供給父元件的畫面。**

這一章的內容可以分成兩個階段：

1. 先學會把畫面內容放進子元件：預設插槽、具名插槽、條件插槽與動態插槽。
2. 再學會讓父元件使用子元件資料：作用域插槽與無渲染元件。

---

## 一、插槽是「內容出口」

子元件可以先決定外層結構：

```vue
<button class="action-button">
  <slot></slot>
</button>
```

父元件再決定按鈕內容：

```vue
<ActionButton>儲存資料</ActionButton>
<ActionButton>登入帳號</ActionButton>
```

同一個按鈕元件可以重複使用，但文字、圖示甚至一小段畫面都能不同。

### 普通插槽的作用域

插槽內容寫在父元件，因此內容中的變數會從父元件尋找：

```vue
<UserButton>
  歡迎回來，{{ userName }}
</UserButton>
```

即使內容最後顯示在子元件裡，也不能直接讀取子元件沒有公開的資料。

```text
內容寫在哪個元件？
        ↓
就使用哪個元件的資料作用域
```

---

## 二、屬性、事件與插槽怎麼選？

| 需求 | 適合方式 | 資料方向 |
| --- | --- | --- |
| 傳入標題、狀態、設定值 | 屬性 | 父 → 子 |
| 傳入文字、圖示或 HTML 結構 | 插槽 | 父 → 子的內容出口 |
| 通知父元件某件事發生 | 事件 | 子 → 父 |
| 同步輸入值或開關狀態 | `v-model` | 父子雙向同步 |
| 重複使用純資料邏輯 | 組合式函式 | 由函式回傳 |

例如按鈕的停用狀態是資料，適合用屬性；按鈕文字是畫面，適合用插槽；點擊後要執行什麼，則交給事件：

```vue
<ActionButton :disabled="isSubmitting" @click="submitForm">
  送出表單
</ActionButton>
```

判斷重點不是哪種語法比較厲害，而是：**子元件要不要理解這份內容？**

---

## 三、預設插槽與預設內容

沒有設定名稱的 `<slot>` 是預設插槽，也可以明確寫成 `name="default"`：

```vue
<!-- 兩者相同。 -->
<slot></slot>
<slot name="default"></slot>
```

如果父元件沒有提供內容，可以在插槽內放備用內容：

```vue
<slot>預設按鈕文字</slot>
```

這種備用內容稱為預設內容。它的規則是：

```text
有傳入內容 → 顯示父元件內容
沒有傳入內容 → 顯示 <slot> 裡的備用內容
```

預設內容與條件插槽不要混淆：預設內容仍會保留插槽所在的外層區塊；條件插槽則可能讓整個區塊消失。

---

## 四、具名插槽：把內容分流到不同區域

當元件有標題區、主要內容區與操作區時，一個插槽就不夠了。子元件可以替不同位置命名：

```vue
<header><slot name="header"></slot></header>
<main><slot></slot></main>
<footer><slot name="footer"></slot></footer>
```

父元件使用 `#名稱` 指定內容位置：

```vue
<ArticleCard>
  <template #header>文章標題</template>
  文章主要內容
  <template #footer>收藏、分享按鈕</template>
</ArticleCard>
```

`#header` 是 `v-slot:header` 的縮寫。沒有指定名稱的內容會進入 `default` 插槽。

可以把它想成分類收納：

```text
#header  → 標題
#default → 主要內容
#footer  → 操作按鈕
```

### 具名插槽的預設內容

具名插槽也能提供備用內容，例如沒有頁尾時顯示版權文字：

```vue
<slot name="footer">版權所有</slot>
```

---

## 五、條件插槽：沒有內容時不建立區塊

有些區域不是必需的。若父元件沒有提供頁首，通常不希望頁首的內距、背景與邊框仍然存在。

子元件可使用 `useSlots()` 判斷插槽是否存在：

```vue
<script setup>
import { useSlots } from 'vue'

// 取得父元件提供的插槽。
const slots = useSlots()
</script>

<template>
  <header v-if="slots.header">
    <slot name="header"></slot>
  </header>
</template>
```

差異如下：

| 做法 | 沒有內容時 |
| --- | --- |
| 預設內容 | 顯示備用內容 |
| 條件插槽 | 外層區塊不渲染 |

條件插槽特別適合可有可無的頁首、頁尾、工具列與對話框操作區。

---

## 六、動態插槽名稱：名稱由資料決定

固定區域直接使用具名插槽即可：

```vue
<template #header>標題</template>
```

只有當名稱會隨資料改變時，才使用動態名稱：

```vue
<template #[currentSlot]>動態內容</template>
```

中括號代表「讀取變數的值」：

```text
#currentSlot       → 固定名稱 currentSlot
#[currentSlot]     → 讀取 currentSlot 的值
```

例如 `currentSlot` 是 `header`，內容就進入 `header` 插槽；改成 `footer` 後，內容就改進入 `footer` 插槽。

### 動態表格欄位

表格常根據欄位名稱產生插槽出口：

```vue
<slot :name="`cell-${column.key}`">
  {{ row[column.key] }}
</slot>
```

若欄位是 `status`，出口名稱就是 `cell-status`，父元件便能寫：

```vue
<template #cell-status="{ value }">
  {{ value === 'active' ? '啟用中' : '已停用' }}
</template>
```

這讓表格保留共用的資料列邏輯，同時讓使用者只客製化需要的欄位。

### 使用時機

- 欄位或插槽名稱來自設定資料時：適合。
- 位置永遠固定時：使用一般具名插槽較清楚。
- 只是想把固定名稱包成變數時：通常沒有必要。

---

## 七、作用域插槽：子元件提供資料，父元件決定畫面

普通插槽不能直接使用子元件內部資料。作用域插槽讓子元件明確公開資料：

```vue
<!-- 子元件：公開 user。 -->
<slot :user="user"></slot>
```

父元件接收插槽屬性：

```vue
<UserCard v-slot="{ user }">
  <h2>{{ user.name }}</h2>
</UserCard>
```

也可以先用物件接收：

```vue
<template #default="slotProps">
  {{ slotProps.user.name }}
</template>
```

### 資料流

```text
子元件擁有 user
      ↓
<slot :user="user">
      ↓
父元件用 v-slot 接收
      ↓
父元件決定姓名、年齡與樣式如何呈現
```

子元件只會公開 `<slot>` 上綁定的資料，不會把所有內部狀態自動暴露出去。

### 具名作用域插槽

不同插槽可以提供不同的插槽屬性：

```vue
<!-- 子元件 -->
<slot name="header" :title="title"></slot>
<slot :user="user"></slot>
<slot name="footer" :updated-at="updatedAt"></slot>
```

```vue
<!-- 父元件 -->
<template #header="{ title }">{{ title }}</template>
<template #default="{ user }">{{ user.name }}</template>
<template #footer="{ updatedAt }">{{ updatedAt }}</template>
```

每個插槽只接收自己出口提供的資料，彼此不會自動共用。

### 插槽屬性也能傳操作方法

清單元件可以把目前資料與刪除方法交給父元件：

```vue
<slot :item="item" :remove="removeItem"></slot>
```

父元件就能自行決定刪除按鈕的外觀：

```vue
<UserList v-slot="{ item, remove }">
  {{ item.name }}
  <button type="button" @click="remove(item.id)">刪除</button>
</UserList>
```

這和事件的差別是：

```text
事件：子元件通知「事情發生了」
插槽屬性函式：子元件提供「你可以使用的操作」
```

---

## 八、無渲染元件：只保留邏輯，不固定畫面

無渲染元件是作用域插槽的設計模式。它通常只負責：

- 狀態。
- 資料處理。
- 互動方法。
- 提供插槽屬性。

父元件則負責所有畫面：

```text
無渲染元件：管理計數值與增加方法
        ↓ 提供 count、increase
父元件：決定要用按鈕、卡片或進度條呈現
```

最小概念可以寫成：

```vue
<!-- 子元件只提供狀態與方法。 -->
<slot :count="count" :increase="increase"></slot>

<!-- 父元件自行決定畫面。 -->
<CounterLogic v-slot="{ count, increase }">
  <button type="button" @click="increase">
    點擊次數：{{ count }}
  </button>
</CounterLogic>
```

目前範例中的滑鼠追蹤也是同樣的分工：子元件計算座標，父元件決定要顯示文字、圓點、卡片或進度條。

### 無渲染元件與組合式函式

| 情境 | 建議 |
| --- | --- |
| 只想重用純 JavaScript 邏輯 | 組合式函式 |
| 想提供「邏輯＋插槽屬性」的元件介面 | 無渲染元件 |
| 需要固定一致的外觀 | 一般元件 |

無渲染元件不是越多越好。若邏輯很簡單，直接使用組合式函式或寫在目前元件裡，通常更容易理解。

---

## 九、常見錯誤

### 1. 把插槽當成一般資料

```vue
<UserCard title="文章標題" />
```

這是在傳屬性，不是插槽。要傳畫面內容，應寫在元件標籤中間。

### 2. 插槽名稱不一致

子元件是 `name="header"`，父元件就必須使用 `#header`，不能寫成 `#title`。

### 3. 忘記動態名稱的中括號

`#currentSlot` 是固定名稱；`#[currentSlot]` 才是讀取變數。

### 4. 父元件直接讀取子元件資料

父元件不能直接使用子元件的區域變數。必須由子元件透過 `<slot :資料="值">` 公開，再由父元件用 `v-slot` 接收。

### 5. 固定名稱卻使用動態插槽

如果只有固定的 `header`、`footer`，直接使用具名插槽比較容易閱讀，不必為了彈性增加複雜度。

### 6. 全域事件沒有清除

無渲染元件若註冊 `window` 或 `document` 事件，卸載時要移除同一個事件處理函式，避免監聽器持續累積。

---

## 十、選擇插槽方式的順序

遇到元件設計問題時，可以依序問：

1. 我要傳的是資料，還是畫面？
2. 傳畫面時，只有一個位置嗎？是的話使用預設插槽。
3. 有多個區域嗎？是的話使用具名插槽。
4. 沒有內容時要顯示備用內容，還是整個區塊消失？分別使用預設內容或條件插槽。
5. 名稱會隨資料改變嗎？只有會改變時才使用動態插槽。
6. 父元件需要子元件的資料來決定畫面嗎？是的話使用作用域插槽。
7. 只需要重用邏輯、不需要插槽介面嗎？優先考慮組合式函式。

---

## 十一、快速複習

```vue
<!-- 預設插槽 -->
<MyButton>儲存</MyButton>

<!-- 具名插槽 -->
<MyCard>
  <template #header>標題</template>
  <template #footer>操作</template>
</MyCard>

<!-- 動態插槽名稱 -->
<MyCard>
  <template #[slotName]>內容</template>
</MyCard>

<!-- 作用域插槽 -->
<UserList v-slot="{ item }">
  {{ item.name }}
</UserList>
```

最後記住：

> **插槽讓父元件決定內容；具名插槽讓內容分流；作用域插槽讓父元件使用子元件公開的資料；無渲染元件則把這種分工發揮到最大。**

---

## 十二、目前範例如何執行

請在本單元目錄執行：

```powershell
cd "D:\承諺\學習\程式\Vue.js\vue-learn\07"
npm install
npm run dev
```

若要確認能否打包：

```powershell
npm run build
```
