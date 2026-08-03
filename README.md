# Vue 邏輯復用：組合式函數

本單元根據 Vue「邏輯復用」的學習內容，理解如何把元件中的狀態、計算、事件與生命週期整理成可重複使用的組合式函數。

## 一、邏輯復用在解決什麼問題？

大型元件常把所有 `ref()`、`computed()`、`watch()`、生命週期與方法分開排列。看似整齊，實際上同一個功能可能散落在檔案各處，修改時需要來回尋找。

更好的方式是按照「邏輯關注點」組織：

```text
一個功能 = 狀態 + 計算 + 監聽 + 方法 + 清理
```

例如滑鼠追蹤應該把座標、事件監聽與事件清理放在一起。即使某個組合式函數目前只被一個元件使用，只要能讓獨立功能更容易理解，抽取仍然有價值。

## 二、Vue 的邏輯復用層次

| 技術 | 主要復用內容 |
| --- | --- |
| 元件 | 畫面、模板、樣式與相關邏輯 |
| 組合式函數 | 有狀態的響應式邏輯 |
| 自訂指令 | 底層 DOM 操作 |
| 外掛 | 整個應用程式層級的功能 |

本單元主要學習組合式函數：

> 元件負責呈現畫面；組合式函數負責封裝可復用的有狀態邏輯。

## 三、無狀態與有狀態邏輯

### 無狀態邏輯

給定輸入後立即回傳結果，不管理 Vue 狀態，也不使用生命週期。例如價格格式化：

```js
// 純函式：只根據輸入值回傳結果
export function formatPrice(price) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD'
  }).format(price)
}
```

這類工作使用一般工具函式即可，不必強行建立組合式函數。

### 有狀態邏輯

資料會隨使用者操作、時間或外部事件改變，例如計數器、滑鼠座標與 API 載入狀態。這類邏輯適合使用組合式函數封裝。

```js
import { ref, computed } from 'vue'

// 封裝可重複使用的計數器狀態與操作
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
}
```

## 四、組合式函數如何封裝副作用？

滑鼠追蹤同時包含響應式資料與瀏覽器事件，因此需要在建立時註冊、離開時清理：

```js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function updatePosition(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 元件掛載後開始監聽
  onMounted(() => {
    window.addEventListener('mousemove', updatePosition)
  })

  // 元件卸載時清理
  onUnmounted(() => {
    window.removeEventListener('mousemove', updatePosition)
  })

  return { x, y }
}
```

核心原則：

> 建立副作用的地方，也要負責清理副作用。

適用於事件監聽器、計時器、WebSocket 與第三方套件實例。

## 五、非同步狀態的封裝

API 請求通常同時需要管理三種狀態：

| 狀態 | 意義 |
| --- | --- |
| `data` | 成功取得的資料 |
| `error` | 請求或解析失敗的錯誤 |
| `isLoading` | 是否仍在等待結果 |

將這些狀態集中在 `useFetch()` 後，元件只負責依狀態顯示載入中、錯誤或資料內容。使用 `fetch()` 時也要檢查 `response.ok`，因為 `404`、`500` 不一定會自動進入 `catch()`。

當請求參數會改變時，組合式函數應支援三種輸入：

```js
useFetch('/posts/1')                 // 普通值
useFetch(url)                        // ref
useFetch(() => `/posts/${postId.value}`) // getter
```

使用 `toValue()` 統一取得輸入值，搭配 `watchEffect()` 追蹤依賴；參數改變時重新請求，並用清理機制取消已過期的請求，避免舊資料覆蓋新資料。

## 六、組合式函數的命名、輸入與回傳

### 命名

通常使用駝峰命名並以 `use` 開頭：

```text
useCounter
useMouse
useFetch
```

這是溝通慣例，表示函數可能使用響應式 API、監聽器或生命週期。

### 輸入

若組合式函數可能被不同情境使用，應思考是否支援普通值、`ref` 與 getter，而不是只接受固定字串。

### 回傳

回傳元件真正需要的 `ref`、`computed` 與操作方法，不要只回傳 `.value`：

```js
// 錯誤：只取得當下值，失去響應性
return { x: x.value }

// 正確：保留 ref，資料改變時畫面能更新
return { x }
```

## 七、組合式函數之間可以串接

一個組合式函數的輸出，可以成為另一個組合式函數的輸入：

```text
Composable A 的輸出
        ↓
Composable B 的輸入
        ↓
Composable B 的輸出
```

元件因此只需要負責組合功能，資料查詢、摘要計算或其他邏輯則各自維持清楚的責任範圍。

## 八、常見錯誤

- 把所有功能按照 API 類型排列，導致同一個功能分散在不同區域。
- 忘記在元件卸載時移除事件或停止計時器。
- 以為多次呼叫組合式函數會自動共享同一份狀態；函數內建立的 `ref()` 通常每次都是新的。
- 在 `computed()` 內修改它自己讀取的響應式資料，造成副作用或響應式迴圈。
- 未處理非同步請求的載入、錯誤、過期請求與 HTTP 狀態。
- 將需要響應式輸入的函數寫成只接受固定普通值，導致參數改變時不會重新執行。

## 九、執行本單元

```sh
npm install
npm run dev
```

操作計數器、價格格式化與滑鼠追蹤範例，觀察哪些是純資料轉換、哪些是元件狀態，以及組合式函數如何集中管理可復用邏輯。
