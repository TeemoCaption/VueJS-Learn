# Vue 內建元件學習筆記

本單元學習四個 Vue 內建元件：`TransitionGroup`、`KeepAlive`、`Teleport` 與 `Suspense`。
它們分別處理列表動畫、元件快取、畫面位置，以及非同步內容的等待狀態。

## 一、`TransitionGroup`：讓列表變化有動畫

### 核心概念

`Transition` 適合單一元素或單一元件的進入、離開；`TransitionGroup` 則專門處理 `v-for` 列表中項目的：

- 新增時的進場動畫
- 刪除時的離場動畫
- 重新排序或位置改變時的移動動畫

列表中的每個項目都必須有穩定且唯一的 `key`。`key` 是 Vue 辨識「哪一筆資料改變」的依據，不應使用可能重複或會改變的索引值。

### 三種動畫要分開理解

1. 進入／離開：由 `name` 產生 `list-enter-*`、`list-leave-*` 等 class。
2. 移動：項目位置改變時使用 `list-move`，或透過 `move-class` 指定自訂名稱。
3. 漸進延遲：把項目索引放入 `data-index`，在 JavaScript 動畫鉤子中依索引計算延遲時間。

目前 `App.vue` 使用 CSS 控制列表動畫：

```vue
<TransitionGroup name="list" move-class="todo-moving">
```

而 `TodoTransitionGroup.vue` 則示範 GSAP 的 JavaScript 動畫。使用 JavaScript 完整控制時，通常要設定 `:css="false"`，並在動畫結束後呼叫 `done()`，讓 Vue 知道可以完成這次過渡。

### 何時使用？

- 只有一個面板或元件切換：使用 `Transition`。
- `v-for` 列表會新增、刪除或排序：使用 `TransitionGroup`。
- 動畫規則固定且簡單：優先使用 CSS。
- 需要依索引延遲、控制時間軸或串接複雜效果：使用 JavaScript 鉤子與動畫函式庫。

### 常見錯誤

- 忘記給每個列表項目唯一的 `key`。
- 只設定進入／離開動畫，卻期待重新排序時自動平滑移動。
- 使用 JavaScript 鉤子卻沒有呼叫 `done()`。
- 使用 `move-class` 後，仍只修改原本的 `.list-move`，導致移動動畫沒有套用。

## 二、`KeepAlive`：保留元件狀態

### 核心概念

動態元件切換時，Vue 預設可能會卸載舊元件。`KeepAlive` 會把元件實例暫存起來，切回去時恢復原本的狀態，例如輸入框內容、分頁位置或區域資料。

```vue
<KeepAlive>
  <component :is="current" />
</KeepAlive>
```

`KeepAlive` 保留的是元件實例，不是單純保留畫面上的 HTML。

### 快取範圍

- `include`：只快取指定名稱的元件。
- `exclude`：排除指定名稱的元件。
- `max`：限制最多保留的實例數量。

本單元的 `cachePages` 只包含 `Home` 與 `Product`，所以切換回這兩個頁面時會保留狀態；`About` 與 `Login` 則不在快取範圍內。

元件名稱必須和 `include` 內容一致，因此範例元件使用 `defineOptions({ name: 'Home' })` 等方式明確指定名稱。

### 元件定義與 `shallowRef`

目前的 `current` 儲存的是元件定義，不是一般資料。使用 `shallowRef` 可以只追蹤「目前是哪一個元件」，避免 Vue 把元件定義本身轉成深層響應式物件。

### 何時使用？

- 使用者切換頁面後，希望返回時保留表單或瀏覽位置：使用 `KeepAlive`。
- 每次進入頁面都必須重新取得最新資料：不要快取，或在元件重新啟用時自行更新。

### 常見錯誤

- `include` 名稱和實際元件名稱不一致，導致看似沒有快取。
- 把 `KeepAlive` 當成路由功能；它只負責快取，不負責決定網址和頁面。
- 直接使用一般 `ref` 儲存元件定義，造成元件被轉成響應式物件的警告。
- 在 `KeepAlive` 內放入多個直接子節點。若要和 `Suspense`、`Transition` 組合，必須維持單一元件與正確巢狀順序。

## 三、`Teleport`：改變 DOM 位置，不改變元件關係

### 核心概念

有些內容在功能上屬於目前元件，但在畫面結構上適合放到 `body` 或專用容器，例如 Modal、通知訊息和全螢幕遮罩。

`Teleport` 可以把內容渲染到指定的 DOM 目標：

```vue
<Teleport to="#modals">
  <div v-if="isOpen">Modal 內容</div>
</Teleport>
```

它只改變實際 DOM 的位置，不會改變 Vue 的邏輯父子關係。因此 Props、事件、插槽和依賴注入仍然按照原本的元件階層運作。

### 本單元的資料流

```text
App.vue 擁有 isUserModalOpen / isDeleteModalOpen
        ↓ Props
MyModal 決定是否顯示內容
        ↓ emit
App.vue 收到 close / confirm 後更新狀態
```

這就是「狀態由父層擁有，子層透過事件通知父層」的典型資料流。`MyModal` 不直接修改父層的開關，而是發出 `close` 或 `confirm` 事件。

### `disabled` 與多個目標

- `:disabled="true"`：暫時停用傳送，內容留在原本的位置。
- 多個 `Teleport` 可以指向同一個 `#modals`；後掛載的內容會接在後面。
- `to` 指向的目標必須在 `Teleport` 掛載時已經存在。本單元因此在 `index.html` 預先建立 `#modals`。

### 常見錯誤

- 目標選擇器不存在，導致 Teleport 找不到掛載位置。
- 以為 Teleport 後事件會失效；它只改變 DOM 位置，不會切斷元件事件。
- 子元件發送了事件，卻沒有在 `defineEmits()` 中宣告完整的事件名稱。
- 讓子元件直接改父層狀態，破壞單向資料流。

## 四、`Suspense`：統一管理非同步等待

### 核心概念

`Suspense` 管理的是元件樹中的非同步依賴，主要包括：

- `async setup()`
- `<script setup>` 頂層 `await`
- 可被 Suspense 管理的非同步元件

它不是 JavaScript 的 `Promise` 管理器，而是 Vue 在畫面層級協調「等待期間顯示什麼」。

```vue
<Suspense>
  <UserPage />

  <template #fallback>
    <p>頁面載入中...</p>
  </template>
</Suspense>
```

### `default`、`fallback` 與三個事件

- `#default`：非同步內容完成後要顯示的內容。
- `#fallback`：等待期間實際顯示的替代內容。
- `pending`：開始進入等待狀態。
- `fallback`：替代畫面真的被顯示。
- `resolve`：非同步依賴完成，回到主要內容。

`pending` 不代表 `fallback` 一定已經出現。若內容很快完成，可能只經過 `pending` 就直接 `resolve`。

### 錯誤處理

`fallback` 只代表「還在等待」，不是錯誤畫面。`Suspense` 本身不負責捕捉非同步錯誤，需要在父元件使用 `onErrorCaptured()` 或其他錯誤處理機制。

本單元的 `UserProfile.vue` 故意讓 Promise 失敗，`App.vue` 再透過 `onErrorCaptured()` 儲存錯誤訊息並顯示「載入失敗」。這個流程可以記成：

```text
等待中 → #fallback
成功   → #default
失敗   → onErrorCaptured() → 錯誤畫面
```

### 和路由、快取、動畫組合

路由頁面常見的巢狀順序是：

```text
RouterView
  ↓
Transition
  ↓
KeepAlive
  ↓
Suspense
  ↓
目前路由元件
```

每一層只負責一件事：路由決定頁面、Transition 負責切換動畫、KeepAlive 保留狀態、Suspense 管理等待。

Vue Router 的動態匯入本身不等同於 Suspense 的非同步元件；但路由頁面內部若有頂層 `await`，仍可成為 Suspense 的非同步依賴。

### 巢狀 `Suspense` 與 `suspensible`

當 `Dashboard` 內部又有動態非同步元件時，可以建立內層 `Suspense`。加上 `suspensible` 後，內層的非同步依賴與事件會交給外層管理，內層主要負責建立另一個解析邊界，避免切換時出現空節點或多次更新。

### 常見錯誤

- 把 `fallback` 當成錯誤處理畫面。
- 以為所有 `import()` 都會自動觸發 Suspense。
- 忘記 `Suspense` 的直接內容需要清楚的單一根節點。
- 巢狀使用時忽略 `suspensible`，造成內外層各自顯示 Loading。
- 只看到建置成功，就以為非同步錯誤已經被處理；仍要實際測試成功、等待與失敗三種狀態。

## 四個元件的選擇速查

| 想解決的問題 | 適合使用 |
|---|---|
| 列表新增、刪除、排序時的動畫 | `TransitionGroup` |
| 切換元件後保留原本狀態 | `KeepAlive` |
| 內容邏輯上屬於此元件，但 DOM 要放到別處 | `Teleport` |
| 等待元件樹中的非同步內容完成 | `Suspense` |

最重要的總結是：

> `TransitionGroup` 管列表變化，`KeepAlive` 管元件生命週期的保留，`Teleport` 管 DOM 呈現位置，`Suspense` 管非同步內容的等待狀態。

## 建立與執行

```bash
npm install
npm run dev
```

正式建置可使用：

```bash
npm run build
```

## 官方延伸閱讀

- [TransitionGroup](https://vuejs.org/guide/built-ins/transition-group.html)
- [KeepAlive](https://vuejs.org/guide/built-ins/keep-alive.html)
- [Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Suspense](https://vuejs.org/guide/built-ins/suspense.html)
