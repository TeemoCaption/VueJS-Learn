# Vue 生命週期學習筆記

本單元學習 Vue 元件從建立、掛載、更新到卸載的生命週期，並延伸到錯誤處理、`KeepAlive` 快取、渲染偵錯與伺服器端資料預取。

## 一、先理解生命週期

元件通常會經過以下流程：

```text
建立元件
  ↓
掛載到畫面
  ↓
資料變更，更新畫面
  ↓
元件被移除
```

生命週期鉤子讓我們在特定時機執行程式，例如：

- 元件顯示後取得資料或啟動計時器
- 畫面更新後讀取最新 DOM
- 元件移除前後清除計時器與事件監聽
- 捕捉子元件錯誤並顯示替代畫面

## 二、最常用的六個鉤子

| 階段 | 鉤子 | 使用時機 |
| --- | --- | --- |
| 掛載前 | `onBeforeMount()` | DOM 即將建立，但尚未完成掛載 |
| 掛載後 | `onMounted()` | 需要存取 DOM、取得資料或啟動副作用 |
| 更新前 | `onBeforeUpdate()` | 資料已改變，但 DOM 尚未更新 |
| 更新後 | `onUpdated()` | DOM 已完成更新，需要讀取最新畫面 |
| 卸載前 | `onBeforeUnmount()` | 元件即將移除，進行最後準備 |
| 卸載後 | `onUnmounted()` | 清除計時器、事件監聽與其他副作用 |

### 使用判斷

- 需要真正的 DOM 時，使用 `onMounted()`。
- 需要知道更新前後的 DOM 差異時，搭配 `onBeforeUpdate()` 與 `onUpdated()`。
- 啟動了計時器、事件監聽或訂閱，就必須在卸載時清理。
- 不要為了單純計算資料而使用生命週期鉤子；這類需求通常使用 `computed()`。

```js
import { onMounted, onUnmounted } from 'vue'

let timerId

onMounted(() => {
  timerId = setInterval(() => {
    console.log('執行中的副作用')
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerId)
})
```

## 三、條件渲染與卸載

`v-if` 會真正建立或移除元件，因此可以觸發掛載與卸載鉤子：

```vue
<LifecycleDemo v-if="showComponent" />
```

`v-show` 只切換 CSS 顯示狀態，元件仍然存在，不會觸發卸載生命週期。

| 情況 | 適合使用 |
| --- | --- |
| 元件需要真正建立或移除 | `v-if` |
| 頻繁切換顯示狀態，保留元件狀態 | `v-show` |

## 四、錯誤捕捉：`onErrorCaptured()`

`onErrorCaptured()` 用來捕捉子孫元件傳遞上來的錯誤，常見處理方式是：

1. 記錄錯誤資訊。
2. 將錯誤狀態設為 `true`。
3. 顯示替代畫面，避免錯誤元件持續渲染。
4. 提供重新建立元件的按鈕。

```js
onErrorCaptured((error, instance, info) => {
  console.error(error, info)

  // 回傳 false，表示錯誤已在此處處理，不再向上傳遞
  return false
})
```

注意：它主要負責捕捉子孫元件錯誤，不是保證能捕捉自己內部的所有錯誤。全域錯誤則可交由 `app.config.errorHandler` 統一記錄。

## 五、`KeepAlive` 與元件快取

動態元件搭配 `<KeepAlive>` 後，切換元件時會先進入快取，而不是立即卸載：

```vue
<KeepAlive>
  <component :is="currentComponent" />
</KeepAlive>
```

- `onActivated()`：快取元件重新顯示。
- `onDeactivated()`：元件暫時離開畫面並進入快取。

適合用在需要保留輸入內容、分頁狀態或滾動位置的畫面。若元件離開後仍不應執行輪詢或監聽，應在 `onDeactivated()` 暫停，並於 `onActivated()` 恢復。

## 六、渲染偵錯鉤子

這兩個鉤子主要用於開發階段除錯：

| 鉤子 | 要回答的問題 |
| --- | --- |
| `onRenderTracked()` | 渲染時讀取了哪些響應式資料？ |
| `onRenderTriggered()` | 哪個資料變更造成重新渲染？ |

記憶方式：

```text
Tracked：畫面讀取了誰
Triggered：誰的變更讓畫面重畫
```

### 常見錯誤：形成響應式迴圈

不要在 `computed()`、`onRenderTracked()` 或 `onRenderTriggered()` 中修改同一個渲染過程會讀取的響應式資料：

```js
// 錯誤概念：computed 讀取並同時修改自己的渲染依賴
const summary = computed(() => {
  renderCount.value++
  return count.value
})
```

`computed()` 應該只負責推導資料；偵錯鉤子則以 `console.log()` 或非響應式方式記錄，避免出現 `Maximum recursive updates exceeded`。

## 七、伺服器端資料預取：`onServerPrefetch()`

`onServerPrefetch()` 專門用於伺服器端渲染（SSR）。它會在伺服器產生 HTML 前等待非同步資料完成：

```js
onServerPrefetch(async () => {
  products.value = await fetchProducts()
})
```

與 `onMounted()` 的差異：

- `onMounted()` 只在瀏覽器端元件掛載後執行。
- `onServerPrefetch()` 只在 SSR 階段執行。
- 一般 Vite 單頁應用程式不會自動執行 `onServerPrefetch()`。

因此，使用 SSR 時常會搭配瀏覽器端的補抓邏輯，處理動態載入或沒有經過伺服器渲染的元件。

## 八、生命週期選擇總整理

```text
需要 DOM 或啟動副作用       → onMounted
需要清理副作用              → onUnmounted
觀察 DOM 更新前後            → onBeforeUpdate / onUpdated
捕捉子元件錯誤              → onErrorCaptured
保留快取元件狀態            → KeepAlive + onActivated / onDeactivated
找出渲染依賴與重新渲染原因   → onRenderTracked / onRenderTriggered
SSR 產生 HTML 前取得資料     → onServerPrefetch
```

## 九、執行本單元

```sh
npm install
npm run dev
```

開啟畫面後，可以操作各示範按鈕，並觀察頁面與瀏覽器主控台中的生命週期紀錄。
