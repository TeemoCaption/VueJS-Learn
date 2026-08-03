# Vue 組合式函數與邏輯復用

本單元學習如何把可重複使用的狀態與操作抽離成組合式函數（Composable），讓不同元件共享「邏輯」，而不是複製程式碼。

## 一、什麼是組合式函數？

組合式函數通常以 `use` 開頭，是一個封裝 Vue 狀態、衍生資料、方法與生命週期的函式。

```js
import { ref, computed } from 'vue'

// 封裝可重複使用的計數器邏輯
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
}
```

元件只需要呼叫函式並使用回傳值：

```js
// 每個元件可以取得一組自己的計數器狀態
const { count, doubleCount, increment } = useCounter(10)
```

## 二、組合式函數的資料所有權

組合式函數內部建立的 `ref()`，預設屬於「這次呼叫它的元件」：

```text
元件 A 呼叫 useMouse() → A 擁有一組 x、y
元件 B 呼叫 useMouse() → B 擁有另一組 x、y
```

因此，組合式函數可以復用邏輯，但不代表所有元件會自動共享同一份狀態。若多個元件必須讀寫同一份全域資料，應考慮使用 Pinia。

## 三、組合式函數可以封裝生命週期

滑鼠追蹤是一個需要瀏覽器事件的副作用：

```js
import { ref, onMounted, onUnmounted } from 'vue'

// 封裝滑鼠座標與事件監聽
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function updatePosition(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 元件掛載後才開始監聽瀏覽器事件
  onMounted(() => {
    window.addEventListener('mousemove', updatePosition)
  })

  // 元件卸載時清除監聽器
  onUnmounted(() => {
    window.removeEventListener('mousemove', updatePosition)
  })

  return { x, y }
}
```

這樣使用它的元件不需要知道事件監聽與清理細節，只需讀取 `x`、`y`。最重要的原則是：

> 建立副作用的地方，也要負責清理副作用。

## 四、`computed` 與組合式函數的分工

組合式函數可以同時回傳原始狀態、衍生狀態與操作方法：

- `ref()`：保存會改變的原始資料。
- `computed()`：根據狀態推導結果，不應在其中產生副作用。
- 函式：集中處理修改狀態的操作。

例如滑鼠區域判斷可以由座標推導：

```js
// 根據滑鼠座標產生畫面位置文字
const horizontalPosition = computed(() => {
  return x.value < window.innerWidth / 2
    ? '畫面左側'
    : '畫面右側'
})
```

如果只是格式化價格，不需要響應式狀態或生命週期，就使用一般 JavaScript 函式即可：

```js
// 純函式：只根據輸入值回傳格式化結果
export function formatPrice(price) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD'
  }).format(price)
}
```

不要為了所有函式都套上 `ref()` 或組合式函數；沒有 Vue 狀態的工作，保持為純工具函式會更簡單、容易測試。

## 五、組合式函數與 Pinia 的選擇

| 情境 | 適合使用 |
| --- | --- |
| 抽離元件內可重複使用的邏輯 | 組合式函數 |
| 每個元件需要自己的獨立狀態 | 組合式函數 |
| 多個頁面需要共享同一份狀態 | Pinia |
| 只做輸入到輸出的格式轉換 | 一般工具函式 |

可以用一句話判斷：

```text
復用邏輯 → Composable
共享狀態 → Pinia
純資料轉換 → Utility function
```

## 六、常見錯誤

### 1. 忘記清理事件或計時器

元件移除後，事件監聽仍可能繼續執行，造成資源浪費或重複觸發。使用 `onUnmounted()` 清理。

### 2. 以為多次呼叫會共享狀態

每次在組合式函數內建立 `ref()`，通常都是新的狀態。需要共享資料時，應把狀態放到 Pinia 或其他明確的共享狀態來源。

### 3. 回傳 `.value` 而不是回傳 `ref`

```js
// 錯誤：只回傳當下的數值，失去響應性
return { x: x.value }

// 正確：回傳 ref，元件才能持續追蹤變化
return { x }
```

### 4. 在 `computed()` 中修改資料

`computed()` 應該只負責計算結果。若需要修改狀態，使用明確的操作函式，避免產生難以追蹤的副作用或響應式迴圈。

## 七、執行本單元

```sh
npm install
npm run dev
```

操作畫面中的計數器、價格與滑鼠追蹤範例，觀察哪些資料是元件自己的狀態、哪些是衍生資料，以及組合式函數如何集中管理可復用邏輯。
