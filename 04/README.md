# Vue 04：Computed 與 Watch 學習筆記

本單元使用 Vue 3 與 Vite，透過四個練習元件學習 `computed` 與 `watch` 的用途、快取機制，以及可寫入計算屬性的設計方式。

## 學習重點

完成本單元後，應能理解：

- `computed` 適合根據既有狀態推導出新的資料。
- `watch` 適合在資料改變時執行副作用，例如查詢資料或記錄變化。
- `computed` 具有快取功能；方法則會在每次呼叫時重新執行。
- 可寫入的 `computed` 可以透過 `get` 讀取資料、`set` 將輸入值拆解後回寫原始狀態。
- `computed` 可以接收上一個計算結果，適合製作簡單的值保留或上限控制邏輯。

## 專案結構

```text
04/
├─ src/
│  ├─ App.vue                 # 組合並顯示四個練習元件
│  └─ components/
│     ├─ Temp01.vue           # computed 與 watch
│     ├─ Temp02.vue           # computed 快取與方法的差異
│     ├─ Temp03.vue           # 可寫入的 computed
│     └─ Temp04.vue           # 取得 computed 的上一個值
├─ package.json               # 專案指令與套件設定
└─ vite.config.js             # Vite 設定
```

## 第一小節：Computed 與 Watch

檔案：`src/components/Temp01.vue`

### `computed`：建立衍生資料

`fullName` 由 `lastName` 與 `firstName` 組合而成。當依賴的資料改變時，Vue 會重新計算結果。

```js
const fullName = computed(() => {
    return lastName.value + firstName.value
})
```

在 JavaScript 中，`ref` 的值需要透過 `.value` 讀取；在樣板中則可以直接使用 `fullName`，Vue 會自動處理響應式參考值。

### `watch`：監聽資料變化並執行副作用

`watch` 不負責產生畫面上的衍生資料，而是在指定資料變更時執行工作。

```js
watch(name, (newValue, oldValue) => {
    console.log('舊值：', oldValue)
    console.log('新值：', newValue)
})

watch(keyword, () => {
    fetchProducts()
})
```

本範例中，第一個監聽器記錄新舊值；第二個監聽器模擬使用關鍵字搜尋商品。實務上，`fetchProducts()` 可以改成呼叫後端服務，但仍應注意請求頻率與錯誤處理。

### `computed` 與 `watch` 的選擇

| 情境 | 適合使用 |
| --- | --- |
| 根據其他資料計算出畫面要顯示的結果 | `computed` |
| 資料改變時執行查詢、記錄、通知等副作用 | `watch` |
| 需要在樣板中重複使用相同的計算結果 | `computed` |

## 第二小節：Computed 快取與 Methods 的差異

檔案：`src/components/Temp02.vue`

```js
function getTotal() {
    return price.value * quantity.value
}

const total = computed(() => {
    return price.value * quantity.value
})
```

兩者都能計算商品總價，但行為不同：

- 方法 `getTotal()` 每次在樣板中被呼叫時，都會重新執行。
- `total` 只會在 `price` 或 `quantity` 改變時重新計算。
- 即使修改與總價無關的 `unrelatedCount`，`computed` 仍能直接使用先前的快取結果。

因此，沒有副作用、且結果取決於響應式資料的計算，通常適合使用 `computed`。若需要傳入參數或每次都必須執行，才考慮使用方法。

## 第三小節：可寫入的 Computed

檔案：`src/components/Temp03.vue`

一般的 `computed` 只有讀取功能；加入 `get` 與 `set` 後，便能透過同一個計算屬性讀取與更新資料。

```js
const fullName = computed({
    get() {
        return `${lastName.value} ${firstName.value}`
    },
    set(newValue) {
        const nameParts = newValue.trim().split(/\s+/)
        lastName.value = nameParts[0] ?? ''
        firstName.value = nameParts.slice(1).join(' ')
    }
})
```

輸入完整姓名時，`set` 會依照空白拆分字串，第一個部分作為姓氏，其餘部分組成名字。這讓 `v-model="fullName"` 仍然能維持雙向操作，但真正被更新的是 `lastName` 與 `firstName`。

同樣的設計也套用在 `formattedPrice`：

- `get` 在價格前面加上 `$`，提供格式化後的顯示文字。
- `set` 移除 `$` 並轉換成數字。
- 只有轉換結果不是 `NaN` 時，才更新原始價格 `price`。

### 常見錯誤

- 不要在 `set` 中寫入 `fullName.value = newValue`，否則會再次觸發自己的 setter。
- 不是所有 `computed` 都需要 `set`；只有需要透過計算結果回寫原始狀態時才使用可寫入形式。
- 解析使用者輸入時，應處理空字串、額外空白與非數字內容。

## 第四小節：取得 Computed 的上一個值

檔案：`src/components/Temp04.vue`

在 Vue 的計算屬性中，可以使用參數取得上一次的回傳值：

```js
const alwaysSmall = computed((previous) => {
    if (count.value <= 3) {
        return count.value
    }

    return previous
})
```

本範例的規則是：

- `count` 小於或等於 `3` 時，顯示目前的 `count`。
- `count` 大於 `3` 時，保留前一次的計算結果，因此 `alwaysSmall` 不會繼續增加。

`safeResultCount` 使用相同概念限制搜尋結果顯示數量；當結果數量大於 `5` 時，回傳上一個安全值。第一次沒有上一個值時，使用空值合併運算子 `??` 回傳 `0`。

這種技巧適合處理簡單的「保留上一個結果」邏輯，但不應取代完整的狀態管理。若需要歷史紀錄、復原、重做或使用者操作紀錄，應使用陣列狀態或 Pinia 等狀態管理工具。

## `App.vue` 的元件組合

`App.vue` 匯入四個練習元件，依序顯示 `Temp01` 至 `Temp04`。元件之間使用 `<br>` 分隔，方便在同一頁觀察各個練習的操作結果。

## 執行專案

安裝套件：

```sh
npm install
```

啟動開發伺服器：

```sh
npm run dev
```

建立正式版本：

```sh
npm run build
```

程式碼格式化：

```sh
npm run format
```

## 建議練習方式

1. 在 `Temp01.vue` 修改姓名與關鍵字輸入，觀察主控台中的新值、舊值與搜尋函式執行時機。
2. 在 `Temp02.vue` 先修改無關資料，再修改價格或數量，比較方法與 `computed` 的主控台輸出。
3. 在 `Temp03.vue` 輸入不同格式的姓名與價格，觀察 setter 如何解析資料。
4. 在 `Temp04.vue` 讓 `count` 超過 `3`、讓搜尋結果超過 `5`，觀察上一個值如何限制畫面結果。
