# Vue 內建元件學習筆記

本單元以四個 Vue 內建元件為主：

| 元件 | 主要處理的問題 | 本單元的實作重點 |
|---|---|---|
| `TransitionGroup` | 列表新增、刪除與排序動畫 | 待辦事項、移動 class、GSAP 漸進延遲 |
| `KeepAlive` | 切換元件後保留狀態 | 動態元件、`include`、`max`、`shallowRef` |
| `Teleport` | 將 DOM 放到指定位置 | 多個 Modal 共用 `#modals`、Props 與事件 |
| `Suspense` | 管理元件樹中的非同步等待 | `fallback`、事件、錯誤捕捉、巢狀使用 |

## 一、`TransitionGroup`：列表動畫

### 核心觀念

| 比較項目 | `Transition` | `TransitionGroup` |
|---|---|---|
| 適用對象 | 單一元素或元件 | `v-for` 產生的多個元素或元件 |
| 處理內容 | 進入與離開 | 進入、離開與位置移動 |
| 是否需要唯一 `key` | 一般不特別要求 | 每個子項目都必須有唯一 `key` |
| 常見例子 | 面板切換、Modal 顯示 | 待辦事項新增、刪除、排序 |

目前 `App.vue` 使用 CSS 控制列表動畫：

```vue
<TransitionGroup name="list" move-class="todo-moving">
```

`TodoTransitionGroup.vue` 則另外示範以 GSAP 和 JavaScript 鉤子控制動畫。

### 動畫類型

| 動畫類型 | 觸發時機 | 主要設定 |
|---|---|---|
| 進場 | 新項目加入列表 | `list-enter-*` |
| 離場 | 項目被移除 | `list-leave-*` |
| 移動 | 項目位置改變或重新排序 | `list-move` 或 `move-class` |
| 漸進延遲 | 項目要依序進場 | `data-index` + JavaScript 鉤子 |

### CSS 與 JavaScript 的選擇

| 情況 | 建議方式 | 原因 |
|---|---|---|
| 透明度、位移等固定效果 | CSS | 簡單、容易維護 |
| 需要依索引延遲 | JavaScript | 可以依項目資料計算時間 |
| 需要時間軸或複雜動畫 | GSAP 等動畫函式庫 | 控制細節較完整 |
| 使用 JavaScript 完整接管動畫 | `:css="false"` | 避免 Vue 另外偵測 CSS 過渡 |

JavaScript 鉤子中的 `done()` 是 Vue 的完成通知：

| 項目 | 功能 |
|---|---|
| `el` | 目前正在動畫的 DOM 元素 |
| `el.dataset.index` | 讀取模板中的項目索引 |
| `done()` | 告訴 Vue 動畫已完成，可以結束過渡 |

### 常見錯誤

| 錯誤 | 結果 | 修正方式 |
|---|---|---|
| 忘記設定唯一 `key` | Vue 無法正確追蹤項目 | 使用資料本身穩定的 `id` |
| 只設定進入／離開 | 重新排序時項目突然跳動 | 補上移動 class 與 `transform` 過渡 |
| 使用 `move-class` 卻修改 `.list-move` | 自訂移動動畫沒有作用 | 修改 `move-class` 指定的 class |
| JavaScript 鉤子沒有呼叫 `done()` | Vue 不知道動畫何時結束 | 在動畫完成回呼中呼叫 `done()` |

## 二、`KeepAlive`：保留元件狀態

### 核心觀念

`KeepAlive` 會暫存動態元件的實例。切換到其他元件後，原元件不一定會被銷毀；切回來時可以保留輸入內容、分頁位置與區域狀態。

| 沒有 `KeepAlive` | 使用 `KeepAlive` |
|---|---|
| 切換後可能重新建立元件 | 切換後暫存元件實例 |
| 表單或區域狀態可能重設 | 原本狀態可以被保留 |
| 適合每次進入都重新載入 | 適合頻繁切換且希望保留狀態 |

### 快取控制

| 設定 | 功能 | 本單元的用法 |
|---|---|---|
| `include` | 只快取指定名稱 | `Home`、`Product` |
| `exclude` | 排除指定名稱 | 本單元未使用 |
| `max` | 限制最多快取數量 | 最多 3 個 |

元件名稱必須和 `include` 的名稱一致，因此 `Home`、`Product` 等元件有明確設定名稱。

### 動態元件與 `shallowRef`

| 資料 | 意義 |
|---|---|
| `current` | 目前要顯示的元件定義 |
| `<component :is="current" />` | 依目前元件定義渲染畫面 |
| `shallowRef(Home)` | 只追蹤元件目前的替換，不深層轉換元件定義 |

`KeepAlive` 只負責保留元件狀態，不負責網址、路由或頁面切換規則。

### 常見錯誤

| 錯誤 | 為什麼會發生 | 修正方式 |
|---|---|---|
| `include` 名稱不一致 | Vue 找不到符合名稱的元件 | 檢查元件實際 `name` |
| 把 `KeepAlive` 當成路由 | 快取和網址是不同責任 | 路由交給 `RouterView` 與路由設定 |
| 用一般 `ref` 儲存元件定義 | 元件可能被轉成深層響應式物件 | 使用 `shallowRef` |
| 放入多個直接子節點 | `KeepAlive` 無法判斷要快取哪個元件 | 維持單一子元件與正確巢狀順序 |

## 三、`Teleport`：改變 DOM 位置

### 核心觀念

`Teleport` 只改變「實際 DOM 被放在哪裡」，不會改變 Vue 的邏輯父子關係。

| 不使用 `Teleport` | 使用 `Teleport` |
|---|---|
| Modal 留在原本元件的 DOM 層級 | Modal 可移到 `body` 或專用容器 |
| 可能受到父層 `z-index`、`transform` 影響 | 比較容易處理遮罩與層級 |
| 元件邏輯和畫面位置綁在一起 | 元件邏輯與 DOM 位置分離 |

### 本單元的資料流

| 步驟 | 負責者 | 資料流 |
|---:|---|---|
| 1 | `App.vue` | 擁有 `isUserModalOpen`、`isDeleteModalOpen` |
| 2 | `App.vue` → `MyModal` | 透過 Props 傳入 `is-open`、`title`、`modal-type` |
| 3 | `MyModal` | 透過 `Teleport` 將內容送到 `#modals` |
| 4 | `MyModal` → `App.vue` | 發出 `close` 或 `confirm` 事件 |
| 5 | `App.vue` | 更新狀態，控制 Modal 關閉或執行操作 |

### `Teleport` 的重要設定

| 設定 | 功能 | 本單元的用法 |
|---|---|---|
| `to` | 指定 DOM 目標 | `to="#modals"` |
| `disabled` | 暫時停用傳送 | 勾選後留在原本位置 |
| 多個 Teleport | 共用同一個目標 | 使用者資訊與刪除確認共用 `#modals` |
| 預設插槽 | 由父層傳入內容 | 兩個 Modal 顯示不同文字 |

`#modals` 必須在 `Teleport` 掛載前存在，所以本單元在 `index.html` 預先建立它。

### 常見錯誤

| 錯誤 | 結果 | 修正方式 |
|---|---|---|
| `to` 指向不存在的元素 | Vue 找不到傳送目標 | 先在 HTML 建立目標容器 |
| 以為傳送後事件會失效 | 混淆 DOM 階層與元件階層 | Props、事件與插槽仍照原本資料流運作 |
| 子元件發出未宣告事件 | 元件契約不完整，可能出現警告 | 在 `defineEmits()` 列出所有事件 |
| 子元件直接修改父層狀態 | 破壞單向資料流 | 父層擁有狀態，子層使用事件通知 |

## 四、`Suspense`：管理非同步等待

### 什麼會成為非同步依賴？

| 類型 | 說明 | 本單元例子 |
|---|---|---|
| `async setup()` | 元件的 `setup` 本身是非同步 | 概念示範 |
| `<script setup>` 頂層 `await` | Vue 會自動辨識為非同步依賴 | `UserPage`、`DashboardPage` |
| 非同步元件 | 可由 `Suspense` 管理載入狀態 | 動態使用者／管理員元件 |
| Vue Router 動態匯入 | 路由懶載入本身不等同 Suspense 依賴 | `/user`、`/dashboard` 的路由設定 |

### `default`、`fallback` 與事件

| 名稱 | 意義 | 觸發或顯示時機 |
|---|---|---|
| `#default` | 真正的主要內容 | 非同步依賴完成後顯示 |
| `#fallback` | 等待期間的替代內容 | Vue 實際顯示 Loading 時 |
| `pending` | 開始等待 | 進入等待狀態時觸發 |
| `fallback` | Loading 已經顯示 | 替代內容被放到畫面時觸發 |
| `resolve` | 等待完成 | 所有依賴完成時觸發 |

注意：`pending` 不代表 `fallback` 一定出現。若非同步內容很快完成，可能直接從 `pending` 進入 `resolve`。

### 成功、等待與失敗

| 狀態 | 畫面行為 | 本單元例子 |
|---|---|---|
| 等待中 | 顯示 `#fallback` | `UserPage` 等待 2 秒 |
| 成功 | 顯示 `#default` | `DashboardPage` 顯示統計資料 |
| 失敗 | 由錯誤處理機制顯示錯誤畫面 | `UserProfile` 故意 `reject` |

`fallback` 只代表「還在等待」，不是錯誤頁面。`Suspense` 本身不負責捕捉錯誤，父元件可使用 `onErrorCaptured()` 處理：

| 錯誤處理步驟 | 功能 |
|---:|---|
| 1 | 非同步元件發生錯誤 |
| 2 | 錯誤傳到父元件的 `onErrorCaptured()` |
| 3 | 儲存錯誤訊息 |
| 4 | 隱藏 `Suspense`，顯示錯誤畫面 |
| 5 | `return false` 時，阻止錯誤繼續向上傳播 |

### 和其他元件組合

| 元件 | 負責工作 |
|---|---|
| `RouterView` | 決定目前要顯示哪個路由頁面 |
| `Transition` | 控制頁面切換動畫 |
| `KeepAlive` | 保留切換後的頁面狀態 |
| `Suspense` | 等待頁面中的非同步依賴 |
| `component` | 實際渲染目前的動態元件 |

官方建議的概念順序：

```text
RouterView → Transition → KeepAlive → Suspense → component
```

### 巢狀 `Suspense` 與 `suspensible`

目前 `Dashboard.vue` 內部還有一層 `Suspense`：

| 設定 | 作用 |
|---|---|
| 沒有 `suspensible` | 內層較像獨立的同步邊界，各自管理等待狀態 |
| 加上 `suspensible` | 將內層非同步依賴與事件交給外層管理 |
| 使用場景 | 外層頁面等待，內層切換不同非同步元件 |

### 常見錯誤

| 錯誤 | 正確觀念 |
|---|---|
| 把 `fallback` 當成錯誤處理 | `fallback` 只代表等待中 |
| 以為所有 `import()` 都觸發 Suspense | 路由動態匯入和非同步元件是不同機制 |
| 忘記 `onErrorCaptured()` | `Suspense` 不會自動處理非同步錯誤 |
| 巢狀使用卻沒有 `suspensible` | 可能產生多個 Loading 或空節點 |
| 只確認建置成功 | 還要實際測試等待、成功與失敗狀態 |

## 四個元件怎麼選？

| 你的需求 | 選擇 | 判斷重點 |
|---|---|---|
| 列表新增、刪除、排序時需要動畫 | `TransitionGroup` | 對象是 `v-for` 列表 |
| 切換後希望保留表單或瀏覽位置 | `KeepAlive` | 需要保留元件實例 |
| Modal 要脫離父層 DOM 顯示 | `Teleport` | 只改變 DOM 位置，不改變資料流 |
| 頁面或元件需要等待非同步資料 | `Suspense` | 統一管理等待與替代畫面 |

## 建立與執行

| 目的 | 指令 |
|---|---|
| 安裝依賴 | `npm install` |
| 開發模式 | `npm run dev` |
| 正式建置 | `npm run build` |

## 官方延伸閱讀

| 主題 | 文件 |
|---|---|
| `TransitionGroup` | [官方文件](https://vuejs.org/guide/built-ins/transition-group.html) |
| `KeepAlive` | [官方文件](https://vuejs.org/guide/built-ins/keep-alive.html) |
| `Teleport` | [官方文件](https://vuejs.org/guide/built-ins/teleport.html) |
| `Suspense` | [官方文件](https://vuejs.org/guide/built-ins/suspense.html) |
