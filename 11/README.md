# Vue 自訂指令學習筆記

本單元學習如何使用自訂指令，封裝需要直接操作 HTML 元素或 DOM 的重複邏輯。

## 一、什麼時候適合使用自訂指令？

自訂指令適合處理：

- 輸入框自動取得焦點
- 直接修改元素樣式
- 點擊元素外部時關閉選單
- 拖曳、捲動或尺寸控制
- 操作第三方 DOM 套件

判斷原則：

> 需要直接取得或操作 DOM，且行為會重複使用時，才考慮自訂指令。

如果功能可以用模板、元件或組合式函數清楚完成，就不應優先使用自訂指令。元件主要復用畫面，組合式函數主要復用狀態邏輯，自訂指令則聚焦底層 DOM 行為。

## 二、建立區域自訂指令

在 `<script setup>` 中，變數名稱以 `v` 開頭，就能在模板中使用：

```js
// 元素掛載後自動取得焦點
const vFocus = {
  mounted(el) {
    el.focus()
  }
}
```

```vue
<input v-focus />
```

對應規則如下：

| 程式變數 | 模板寫法 |
| --- | --- |
| `vFocus` | `v-focus` |
| `vHighlight` | `v-highlight` |
| `vAutoResize` | `v-auto-resize` |

這種寫法只在目前元件可使用，適合單一元件專用的 DOM 行為。

## 三、自訂指令生命週期

自訂指令有自己的元素生命週期：

| 鉤子 | 使用時機 |
| --- | --- |
| `created` | 指令建立後、元素屬性套用前 |
| `beforeMount` | 元素即將插入 DOM |
| `mounted` | 元素已掛載，可開始操作 DOM |
| `beforeUpdate` | 元素即將因資料變更而更新 |
| `updated` | 元素更新完成，可套用最新設定 |
| `beforeUnmount` | 元素即將移除 |
| `unmounted` | 元素已移除，清理資源 |

常見流程：

```text
created → beforeMount → mounted
資料更新：beforeUpdate → updated
元素移除：beforeUnmount → unmounted
```

實務上最常使用 `mounted`、`updated` 與 `unmounted`：

- `mounted`：初始化 DOM 行為。
- `updated`：同步最新的指令資料。
- `unmounted`：移除事件監聽器或清理第三方資源。

## 四、指令的值：`binding.value`

指令右側的資料會放在 `binding.value`：

```vue
<p v-highlight="highlightColor">重要訊息</p>
```

```js
const vHighlight = {
  mounted(el, binding) {
    // 取得指令收到的顏色
    el.style.backgroundColor = binding.value
  },

  updated(el, binding) {
    // 資料改變後同步更新 DOM
    el.style.backgroundColor = binding.value
  }
}
```

當 `highlightColor` 改變時，Vue 會執行 `updated()`，讓指令重新套用樣式。

## 五、`binding` 物件的重點欄位

```js
mounted(el, binding) {
  console.log(binding.value)
  console.log(binding.oldValue)
  console.log(binding.arg)
  console.log(binding.modifiers)
}
```

| 欄位 | 意義 |
| --- | --- |
| `value` | 目前的新值 |
| `oldValue` | 更新前的舊值 |
| `arg` | 冒號後面的指令參數 |
| `modifiers` | 點號後面的修飾符 |
| `instance` | 使用該指令的元件實例 |

## 六、指令參數：`binding.arg`

冒號後面是參數：

```vue
<p v-highlight:background="highlightColor">文字</p>
<p v-highlight:text="textColor">文字</p>
```

指令可以根據 `binding.arg` 決定要修改哪一種樣式：

```js
// 根據參數選擇修改背景或文字顏色
if (binding.arg === 'background') {
  el.style.backgroundColor = binding.value
}

if (binding.arg === 'text') {
  el.style.color = binding.value
}
```

## 七、修飾符：`binding.modifiers`

點號後面是修飾符：

```vue
<p v-highlight:background.bold.italic="highlightColor">
  重要訊息
</p>
```

可以透過布林值判斷：

```js
// 根據修飾符決定是否套用文字樣式
el.style.fontWeight = binding.modifiers.bold ? 'bold' : 'normal'
el.style.fontStyle = binding.modifiers.italic ? 'italic' : 'normal'
```

語法可拆成：

```text
v-highlight:background.bold.italic="值"
     │         │          │
     │         │          └─ 修飾符
     │         └──────────── 參數
     └────────────────────── 指令名稱
```

## 八、函式簡寫

如果指令只需要在 `mounted` 與 `updated` 執行相同工作，可以使用函式簡寫：

```js
// 函式簡寫會在 mounted 與 updated 執行
const vHighlight = (el, binding) => {
  el.style.backgroundColor = binding.value
}
```

若需要 `created`、`beforeUnmount` 等其他鉤子，就應使用完整的指令物件。

## 九、全域註冊

需要多個元件共用的指令，可以在建立應用程式時註冊：

```js
// 將指令註冊成全域 v-focus
app.directive('focus', focus)
```

全域註冊後，任何元件都能使用 `v-focus`；但全域指令過多會增加辨識成本，因此只有真正跨元件共用的行為才適合註冊。

## 十、常見錯誤

- 把自訂指令當成一般資料邏輯工具，導致 DOM 操作散落在不適合的位置。
- 只在 `mounted` 套用樣式，資料改變後卻沒有在 `updated` 同步。
- 建立事件監聽器後忘記在 `unmounted` 清理。
- 混淆 `binding.value`、`binding.arg` 與 `binding.modifiers`。
- 所有指令都註冊成全域，讓依賴關係變得不清楚。
- 能用模板或組合式函數完成的功能，卻為了使用指令而直接操作 DOM。

## 十一、執行本單元

```sh
npm install
npm run dev
```

操作高亮顏色按鈕、輸入框與顯示控制，觀察指令如何依照生命週期、值、參數與修飾符更新 DOM。
