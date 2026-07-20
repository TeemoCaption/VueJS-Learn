# Vue 04：Computed 計算屬性與 Watch 監聽

本單元的核心不是把資料顯示在畫面上，而是理解 Vue 如何處理「由狀態推導資料」與「狀態改變後執行工作」這兩種需求。

- `computed`：建立具有響應式、可重複使用與快取能力的衍生資料。
- `computed` 的 `get()`：定義如何讀取或計算結果。
- `computed` 的 `set()`：定義外部寫入計算屬性時，如何回寫真正的來源資料。
- `watch`：監聽響應式資料變化，執行查詢、記錄或其他副作用。

## 一、先分辨來源資料與衍生資料

假設有以下兩個來源資料：

```js
const firstName = ref('ChenYen')
const lastName = ref('Yang')
```

`firstName` 與 `lastName` 是真正被保存的狀態；完整姓名則可以由這兩個狀態推導出來：

```js
const fullName = computed(() => {
    return `${lastName.value} ${firstName.value}`
})
```

這裡的 `fullName` 不需要另外保存，因為它永遠可以由來源資料計算出來。這就是衍生資料。

判斷方式很簡單：

- 如果資料是「由其他狀態計算出來的結果」，優先考慮 `computed`。
- 如果資料改變時需要「做某件事」，例如發送請求或寫入紀錄，考慮 `watch`。
- 不要同時保存可以被推導出的資料，否則來源資料與計算結果可能不同步。

## 二、Computed 計算屬性

### 2.1 唯讀 `computed`

最常見的寫法是將一個函式傳給 `computed`：

```js
const total = computed(() => {
    return price.value * quantity.value
})
```

這種寫法會建立一個唯讀的計算屬性：

- 函式中的響應式資料會被 Vue 記錄為依賴。
- 依賴資料改變時，計算屬性會被標記為需要重新計算。
- 讀取 `total.value` 時，才會取得最新結果。
- 直接寫入 `total.value` 沒有合理的更新方式，因為它只有讀取邏輯。

唯讀 `computed` 適合格式化文字、計算總價、篩選清單或組合多個狀態。

### 2.2 `computed` 的快取

`computed` 與一般方法最大的差異是快取。

```js
function getTotal() {
    return price.value * quantity.value
}

const total = computed(() => {
    return price.value * quantity.value
})
```

如果畫面多次讀取 `total`，而 `price` 與 `quantity` 都沒有改變，Vue 會直接使用上一次的結果；方法 `getTotal()` 則會在每次呼叫時重新執行。

因此可以這樣理解：

| 特性 | `computed` | 方法 |
| --- | --- | --- |
| 是否具有快取 | 有 | 沒有 |
| 何時重新計算 | 依賴資料改變後再次讀取時 | 每次呼叫時 |
| 是否適合衍生資料 | 適合 | 可以，但效率較差 |
| 是否適合傳入參數 | 不直接適合 | 適合 |
| 是否應該包含副作用 | 不應該 | 視情況而定 |

### 2.3 `computed` 函式應該保持純粹

計算屬性的函式最好只負責計算並回傳結果，不要在其中：

- 修改其他狀態。
- 發送網路請求。
- 操作文件物件模型。
- 寫入主控台以外的外部系統。

如果資料改變後需要執行這些工作，應使用 `watch`。這樣可以讓「計算資料」與「執行副作用」各自負責清楚的工作。

## 三、Computed 的 `get()` 與 `set()`

當計算屬性需要被讀取，也需要接受外部輸入時，使用物件形式：

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

### 3.1 `get()` 的責任：讀取與組合

`get()` 會在讀取計算屬性時執行，負責從來源狀態產生對外呈現的值。

在上面的例子中：

1. 讀取 `lastName` 與 `firstName`。
2. 將兩者組合成完整姓名。
3. 回傳完整姓名給畫面或其他程式使用。

`get()` 不應直接修改 `lastName` 或 `firstName`。它的角色是「如何讀」，不是「如何更新」。

### 3.2 `set()` 的責任：解析輸入並回寫來源

當程式執行以下寫入操作時：

```js
fullName.value = 'Wang XiaoMing'
```

Vue 會將新值交給 `set(newValue)`。`set()` 的責任不是修改自己，而是：

1. 接收外部輸入。
2. 驗證、清理或解析輸入。
3. 更新真正的來源狀態。

因此，`set()` 中應更新 `lastName` 與 `firstName`，不應再寫入 `fullName.value`。如果在 setter 裡修改自己，容易造成遞迴更新或邏輯混亂。

### 3.3 `get()` 與 `set()` 的資料流

可以把可寫入的 `computed` 想成一個轉換層：

```text
來源狀態 ──> get() ──> 對外顯示值
來源狀態 <── set() <── 使用者輸入值
```

例如格式化價格：

- `get()` 將 `500` 轉成 `$500`。
- 使用者輸入 `$800` 後，`set()` 移除貨幣符號並轉成數字 `800`。
- `set()` 將 `800` 寫回 `price`。
- `price` 改變後，`get()` 再產生新的 `$800`。

這個模式特別適合搭配 `v-model`，因為畫面可以使用容易閱讀的格式，而資料仍維持適合程式處理的原始格式。

### 3.4 `set()` 必須處理不合法輸入

setter 是外部輸入進入狀態的入口，因此應該在回寫前進行處理：

- 使用 `trim()` 移除前後空白。
- 使用 `split()` 拆解文字。
- 使用 `Number()` 轉換數字。
- 使用 `Number.isNaN()` 避免把無效數字寫入狀態。
- 為空值提供合理的預設值。

`set()` 不是把任何輸入原封不動存回去，而是負責維持資料格式與狀態正確性。

## 四、Watch 監聽

### 4.1 `watch` 的用途

`watch` 用來觀察指定的響應式資料，當資料變化時執行回呼函式：

```js
watch(name, (newValue, oldValue) => {
    console.log('舊值：', oldValue)
    console.log('新值：', newValue)
})
```

回呼函式中的：

- `newValue` 是這次變更後的新值。
- `oldValue` 是變更前的舊值。

`watch` 本身不會產生新的畫面資料，它的重點是資料改變後的反應，例如：

- 根據關鍵字發送搜尋請求。
- 將使用者操作寫入紀錄。
- 根據設定值同步瀏覽器或外部服務。
- 在條件改變時顯示通知。

### 4.2 監聽資料與執行副作用

```js
watch(keyword, () => {
    fetchProducts()
})
```

這表示只要 `keyword` 改變，就執行 `fetchProducts()`。這裡的搜尋函式屬於副作用，因為它可能與外部資料來源互動，不是單純回傳一個計算結果。

實務上，如果輸入框每打一個字就觸發請求，可能造成過多請求，通常還需要加入防抖、節流、取消前一次請求或錯誤處理。

### 4.3 `computed` 與 `watch` 的核心差異

| 問題 | 使用 `computed` | 使用 `watch` |
| --- | --- | --- |
| 目的 | 產生衍生資料 | 對資料變化做出反應 |
| 結果 | 必須回傳計算值 | 可以不回傳值 |
| 是否具有快取 | 有 | 沒有這種計算快取用途 |
| 是否適合副作用 | 不適合 | 適合 |
| 常見用途 | 總價、格式化文字、篩選結果 | 搜尋請求、記錄、通知、同步外部狀態 |

記憶方式：

> 想知道「這個值應該是多少」時使用 `computed`；想處理「這個值改變後要做什麼」時使用 `watch`。

### 4.4 不要用 `watch` 取代 `computed`

以下做法通常不理想：先建立一個額外狀態，再用 `watch` 同步更新它。

```js
const fullName = ref('')

watch([firstName, lastName], () => {
    fullName.value = `${lastName.value} ${firstName.value}`
})
```

如果 `fullName` 只是由 `firstName` 與 `lastName` 推導而來，直接使用 `computed` 更清楚：

```js
const fullName = computed(() => {
    return `${lastName.value} ${firstName.value}`
})
```

使用 `watch` 同步衍生資料，會增加狀態數量與同步時機，讓程式更容易出現延遲或不同步。只有在需要執行副作用時，才使用 `watch`。

## 五、Computed 取得上一個結果

計算屬性可以接收上一次的回傳值，讓新結果可以根據前一次結果決定：

```js
const alwaysSmall = computed((previous) => {
    if (count.value <= 3) {
        return count.value
    }

    return previous
})
```

這裡的 `previous` 是計算屬性上一次成功回傳的結果，不是來源狀態的歷史紀錄。它適合處理簡單的保留值或限制顯示值，但不適合取代完整的歷史狀態管理。

如果需求包含復原、重做、完整變更紀錄或多筆歷史資料，應明確使用陣列狀態或其他狀態管理方式保存歷史，而不是只依賴 `previous`。

## 六、常見錯誤整理

### 把計算結果當成來源狀態保存

如果某個值可以由其他狀態直接計算，就不需要額外使用 `ref` 保存，再透過 `watch` 同步它。優先使用 `computed`。

### 在 `get()` 中修改狀態

`get()` 應該是讀取與計算邏輯。把狀態修改放進 `get()`，可能造成難以追蹤的連鎖更新。

### 在 `set()` 中修改自己

`set()` 應該更新來源狀態，而不是再次寫入目前這個 `computed`。否則可能造成遞迴觸發。

### 在 `computed` 中執行副作用

網路請求、主控台以外的外部同步或通知等工作，應放在 `watch` 或明確的事件處理函式中。

### 以為 `watch` 會立刻執行

基本的 `watch` 通常會在被監聽的資料發生變化後才執行，不會在建立監聽器時自動執行。若需要建立時先執行一次，才考慮使用 `immediate` 選項。

## 七、執行專案

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

## 八、學習檢查題

1. `fullName` 只是由姓氏與名字組合而成時，為什麼適合使用 `computed` 而不是 `watch`？
2. `get()` 與 `set()` 各自負責什麼工作？
3. 為什麼 `set()` 應該更新來源狀態，而不是更新自己？
4. 當商品價格沒有改變，但畫面重新讀取總價時，為什麼 `computed` 不需要重新計算？
5. 搜尋關鍵字改變後要呼叫後端服務，為什麼適合使用 `watch`？
6. 如果需要保存完整的歷史紀錄，為什麼不能只依賴 `computed` 的 `previous`？
