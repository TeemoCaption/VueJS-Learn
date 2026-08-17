# Vue Router 進階學習筆記：RouterView 插槽與捲動行為

本單元整理兩個進階主題：

1. 使用 `RouterView` 插槽取得目前的路由元件，並搭配動態元件、`KeepAlive`、`Transition`、屬性、插槽與模板引用。
2. 使用 `scrollBehavior` 控制路由切換後的捲動位置，包含錨點、延遲捲動與固定導覽列偏移。

## 一、先建立整體觀念

一般的：

```vue
<!-- Router 直接渲染目前網址對應的頁面元件。 -->
<RouterView />
```

進一步使用插槽後：

```vue
<!-- 取得目前路由元件，交給外層自行決定如何渲染。 -->
<RouterView v-slot="{ Component }">
  <!-- 動態元件會渲染目前匹配到的頁面。 -->
  <component :is="Component" />
</RouterView>
```

兩者都能顯示頁面，差別在於第二種可以在真正的路由元件外面加入動畫、快取、屬性、插槽或模板引用。

可以把資料流記成：

```text
網址改變
  ↓
路由器比對 routes
  ↓
RouterView 取得 Component
  ↓
動態 component 渲染頁面
  ↓
Transition、KeepAlive 或 ref 介入頁面行為
```

## 二、RouterView 插槽與動態元件

### 核心對照

| 寫法 | 意義 | 使用時機 |
|---|---|---|
| `<RouterView />` | 由路由器直接渲染頁面 | 只需要顯示頁面時 |
| `v-slot="{ Component }"` | 取得目前匹配到的路由元件 | 需要包裝或操作路由元件時 |
| `<component :is="Component" />` | 依目前的 `Component` 動態渲染 | 路由頁面會隨網址改變時 |

例如目前網址是 `/about`：

```text
RouterView
  ↓
Component = AboutView
  ↓
<component :is="Component" />
  ↓
畫面顯示 AboutView
```

這裡的 `Component` 不是固定的 `HomeView` 或 `AboutView`，而是路由器依目前網址交給插槽的元件。

## 三、搭配 Transition 與 KeepAlive

### 各自負責什麼？

| 元件 | 負責內容 | 對畫面的影響 |
|---|---|---|
| `RouterView` | 找出目前路由元件 | 決定要顯示哪一頁 |
| `Transition` | 控制進入與離開動畫 | 頁面切換時淡入、淡出 |
| `KeepAlive` | 快取動態元件 | 離開頁面後保留元件狀態 |
| `component` | 真正渲染動態元件 | 把目前路由頁面放到畫面上 |

### 建議的巢狀結構

```vue
<RouterView v-slot="{ Component }">
  <!-- mode="out-in" 讓舊頁面先離開，再讓新頁面進入。 -->
  <Transition name="fade" mode="out-in">
    <!-- 快取真正的路由頁面，而不是 RouterView 本身。 -->
    <KeepAlive>
      <!-- Component 可能是 HomeView、AboutView 或其他頁面元件。 -->
      <component :is="Component" />
    </KeepAlive>
  </Transition>
</RouterView>
```

使用判斷：

- 只想要切換動畫：使用 `Transition`。
- 想保留表單輸入、分頁或元件內部狀態：使用 `KeepAlive`。
- 兩者都需要時，讓 `Transition` 與 `KeepAlive` 包住動態的 `component`。

`KeepAlive` 不應該只包住 `<RouterView />`，因為真正需要快取的是 `RouterView` 裡面的 `HomeView`、`AboutView` 等路由元件。

## 四、傳遞屬性與插槽

取得 `Component` 後，它仍然是一般 Vue 元件，因此可以像普通元件一樣傳遞屬性與插槽：

```vue
<RouterView v-slot="{ Component }">
  <!-- 將 title 傳給目前的路由元件。 -->
  <component :is="Component" title="歡迎使用 Vue Router">
    <!-- 將這段內容傳給目前路由元件的預設插槽。 -->
    <p>這段內容來自父元件。</p>
  </component>
</RouterView>
```

路由元件必須接收或使用它：

```vue
<script setup>
// 宣告頁面可以接收的 title 屬性。
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <main>
    <!-- 顯示父元件傳進來的屬性。 -->
    <h1>{{ title }}</h1>

    <!-- 顯示父元件傳進來的插槽內容。 -->
    <slot />
  </main>
</template>
```

### 為什麼通常不把共用屬性直接放在 RouterView？

```vue
<!-- 所有經過這個 RouterView 的路由元件都會收到 title。 -->
<component :is="Component" title="共用標題" />
```

如果只有某一條路由需要資料，更適合在路由設定中使用 `props`，讓資料只流向需要它的頁面：

```js
{
  // 動態參數會從網址 /users/10 取得。
  path: '/users/:id',
  component: UserView,
  // 將 route.params.id 直接轉成 UserView 的屬性。
  props: true,
}
```

```vue
<script setup>
// UserView 只接收自己需要的 id，不必直接讀取路由器。
defineProps({
  id: String,
})
</script>
```

## 五、模板引用：ref 應該放在哪裡？

這兩種寫法取得的對象不同：

| `ref` 放置位置 | 取得的對象 |
|---|---|
| `<RouterView ref="routeView" />` | `RouterView` 元件實例 |
| `<component :is="Component" ref="mainContent" />` | 目前真正顯示的路由元件實例 |

如果目標是取得目前頁面元件，應該把 `ref` 放在動態元件上：

```vue
<script setup>
import { ref } from 'vue'

// 保存目前路由頁面的元件引用。
const mainContent = ref(null)

// 讀取目前真正顯示的路由元件實例。
function showRouteComponent() {
  console.log(mainContent.value)
}
</script>

<template>
  <!-- 點擊後可在開發者工具查看目前路由元件。 -->
  <button @click="showRouteComponent">查看目前路由元件</button>

  <RouterView v-slot="{ Component }">
    <!-- ref 放在 component，取得 HomeView 或 AboutView。 -->
    <component :is="Component" ref="mainContent" />
  </RouterView>
</template>
```

路由切換後，`mainContent.value` 也會隨著目前顯示的路由元件改變。

## 六、scrollBehavior：控制路由切換後的捲動

`scrollBehavior` 要回答的問題是：

> 路由切換完成後，畫面應該捲到哪裡？

它會收到三個參數：

| 參數 | 意義 | 常見用途 |
|---|---|---|
| `to` | 即將前往的路由 | 讀取 `to.hash` 或判斷目標頁面 |
| `from` | 目前離開的路由 | 比較前後路由 |
| `savedPosition` | 瀏覽器前進／後退時保存的位置 | 恢復使用者原本看到的位置 |

### 最基本的捲動

```js
// 每次一般路由導覽後，回到頁面左上角。
scrollBehavior() {
  return {
    left: 0,
    top: 0,
  }
}
```

### 優先恢復上一頁位置

```js
scrollBehavior(to, from, savedPosition) {
  // 瀏覽器上一頁或下一頁時，恢復之前保存的位置。
  if (savedPosition) {
    return savedPosition
  }

  // 一般點擊 RouterLink 時，回到頁面頂端。
  return {
    top: 0,
  }
}
```

資料流可以記成：

```text
發生路由導覽
  ↓
有 savedPosition 嗎？
  ├─ 有：恢復原本位置
  └─ 沒有：回到 top: 0
```

## 七、錨點與平滑捲動

網址中的 `#team` 會成為 `to.hash`。如果頁面有相同 `id` 的元素，就可以捲到該元素：

```js
scrollBehavior(to, from, savedPosition) {
  // 瀏覽器前進或後退時，優先恢復原本位置。
  if (savedPosition) {
    return savedPosition
  }

  // /about#team 會讓 to.hash 等於 '#team'。
  if (to.hash) {
    return {
      el: to.hash,
      behavior: 'smooth',
    }
  }

  // 沒有錨點時，回到頁面最上方。
  return {
    top: 0,
  }
}
```

頁面必須存在對應的元素：

```vue
<!-- id 必須與網址中的 #team 對應。 -->
<section id="team">
  <h2>我們的團隊</h2>
</section>
```

若回傳 `el: '#main'`，但畫面中沒有 `id="main"` 的元素，瀏覽器就會出現「找不到元素」的捲動警告。因此選擇器和實際模板必須保持一致。

## 八、延遲捲動：回傳 Promise

如果頁面有過渡動畫，或內容需要先完成渲染，就可以讓 `scrollBehavior` 回傳 `Promise`，等到 `resolve()` 後才執行捲動：

```js
scrollBehavior(to, from, savedPosition) {
  // 前進或後退時，立即恢復瀏覽器保存的位置。
  if (savedPosition) {
    return savedPosition
  }

  // 一般導覽等待 500 毫秒後，再回到頁面頂端。
  return new Promise((resolve) => {
    setTimeout(() => {
      // resolve 裡的物件就是最後真正的捲動位置。
      resolve({
        left: 0,
        top: 0,
      })
    }, 500)
  })
}
```

執行順序：

```text
路由切換
  ↓
scrollBehavior() 回傳 Promise
  ↓
等待頁面或動畫準備完成
  ↓
呼叫 resolve()
  ↓
Vue Router 執行捲動
```

`500` 只是示範值。實際專案應該讓等待時間和頁面過渡動畫一致，否則可能太早捲動或讓使用者多等待。

## 九、固定導覽列與進階偏移量

固定在頁面頂端的導覽列可能遮住捲動目標。最簡單的做法是固定寫死偏移量：

```js
// 找到 #main 後，額外保留 80px 給固定導覽列。
return {
  el: '#main',
  top: 80,
}
```

更好的做法是把偏移量交給頁面樣式管理：

```css
/* 讓 #main 捲到導覽列下方，而不是被導覽列遮住。 */
#main {
  scroll-margin-top: 80px;
}
```

接著由路由器讀取實際套用的樣式：

```js
scrollBehavior() {
  // 尋找頁面中真正存在的捲動目標。
  const mainElement = document.querySelector('#main')

  // 找不到目標時，避免傳入不存在的選擇器。
  if (!mainElement) {
    return {
      top: 0,
    }
  }

  // 取得瀏覽器計算後的 scroll-margin-top，例如 '80px'。
  const marginTop = parseFloat(
    getComputedStyle(mainElement).scrollMarginTop
  )

  // 捲到元素，並套用 CSS 所定義的偏移量。
  return {
    el: mainElement,
    top: marginTop,
  }
}
```

這段程式的資料流是：

```text
querySelector('#main')
  ↓
找到 DOM 元素
  ↓
getComputedStyle()
  ↓
讀取 '80px'
  ↓
parseFloat()
  ↓
得到 80
  ↓
捲到 #main 並保留 80px 空間
```

### 為什麼不直接寫死 `top: 80`？

因為不同畫面尺寸可能有不同的導覽列高度：

```css
/* 桌面版導覽列較高。 */
#main {
  scroll-margin-top: 80px;
}

/* 行動版導覽列較矮。 */
@media (max-width: 768px) {
  #main {
    scroll-margin-top: 60px;
  }
}
```

`getComputedStyle()` 讀取的是目前實際生效的值，因此路由器不必自行判斷桌面版或行動版的數字。

這種分工可以記成：

| 工具 | 負責內容 |
|---|---|
| CSS `scroll-margin-top` | 定義目標需要保留多少空間 |
| `getComputedStyle()` | 讀取目前實際套用的樣式 |
| `scrollBehavior` | 決定何時、捲到哪個元素 |

## 十、本單元實作對照

目前專案的實作重點如下：

| 檔案 | 實作內容 |
|---|---|
| `src/App.vue` | 使用 `RouterView` 插槽、動態元件與頁面過渡動畫 |
| `src/router/index.js` | 使用 `scrollBehavior` 找到 `#main`，讀取 `scroll-margin-top` 後捲動 |
| `src/views/HomeView.vue` | 提供 `id="main"` 與 `scroll-margin-top: 80px`，作為捲動目標 |
| `src/views/AboutView.vue` | 提供 `id="team"`，可延伸練習網址錨點捲動 |

## 十一、快速複習

| 想解決的問題 | 核心寫法 | 判斷重點 |
|---|---|---|
| 取得目前路由元件 | `v-slot="{ Component }"` | 需要自行包裝路由頁面時 |
| 動態顯示路由元件 | `<component :is="Component" />` | `Component` 會隨網址改變 |
| 切換頁面動畫 | `<Transition>` | 管理進入與離開效果 |
| 保留頁面狀態 | `<KeepAlive>` | 快取真正的路由元件 |
| 傳遞頁面資料 | 路由 `props` | 優先讓資料只流向需要的路由 |
| 取得目前頁面實例 | `ref` 放在 `component` | 不要誤放在 `RouterView` |
| 回到頁面頂端 | `return { top: 0 }` | 一般路由切換 |
| 恢復上一頁位置 | `return savedPosition` | 瀏覽器前進／後退 |
| 捲到網址錨點 | `el: to.hash` | 頁面必須存在對應的 `id` |
| 等待後再捲動 | `return new Promise(...)` | 用 `resolve()` 結束等待 |
| 避免固定導覽列遮住目標 | `scroll-margin-top` | 搭配 `getComputedStyle()` 讀取 |

## 十二、專案執行

```sh
# 安裝依賴套件。
npm install

# 啟動開發伺服器，觀察路由切換與捲動行為。
npm run dev

# 建立正式版本，確認程式可以編譯。
npm run build
```
