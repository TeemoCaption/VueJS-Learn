# Vue 專案結構筆記

本筆記整理使用 Vue 與 Vite 建立前端專案時，常見資料夾、檔案與指令的用途。

## 一、啟動開發伺服器

```powershell
npm run dev
```

用途：啟動本機開發伺服器，方便在開發過程中即時預覽網頁。

`npm run dev` 實際上會執行 `package.json` 中的 `dev` 指令：

```json
{
  "scripts": {
    "dev": "vite"
  }
}
```

## 二、專案常見資料夾

### `node_modules/`

```text
node_modules/
```

存放專案安裝的第三方套件，例如：

- Vue
- Vite
- Vue Router
- Pinia
- ESLint

這個資料夾通常很大，因此一般會加入 `.gitignore`，不會上傳至 GitHub。

通常不需要手動修改其中的程式碼。如果要安裝或更新套件，應透過 `npm` 指令處理。

### `public/`

```text
public/
```

存放不需要經過 Vite 處理的靜態檔案，例如：

- 網站圖示
- 固定圖片
- 靜態 JSON
- `robots.txt`

這些檔案通常會以原本的形式提供給瀏覽器使用。

### `src/`

```text
src/
```

`src` 是 `source` 的縮寫，代表專案的原始碼。

這是開發 Vue 應用程式時最常工作的地方，畫面、元件、路由與狀態管理程式通常都放在這裡。

## 三、`src` 底下的常見內容

### `src/components/`

```text
src/components/
```

存放可以重複使用的元件，例如：

- `Navbar.vue`
- `ProductCard.vue`
- `TodoItem.vue`
- `BaseButton.vue`

元件是可以獨立使用、重複組合的使用者介面區塊。將介面拆成元件，可以讓程式碼更容易維護與重複利用。

### `src/views/`

```text
src/views/
```

通常存放頁面層級的元件，例如：

- `HomeView.vue`
- `LoginView.vue`
- `ProductView.vue`
- `AboutView.vue`

可以先用以下方式區分：

| 資料夾 | 用途 |
| --- | --- |
| `components` | 頁面中可重複使用的零件 |
| `views` | 使用者實際進入的完整頁面 |

### `src/router/`

```text
src/router/
```

存放 Vue Router 設定，用來決定網址與頁面的對應關係。

例如：

```text
/          → HomeView.vue
/about     → AboutView.vue
/products  → ProductView.vue
```

當使用者進入不同網址時，路由系統會顯示對應的頁面元件。

### `src/stores/`

```text
src/stores/
```

存放 Pinia Store，也就是可在多個元件之間共享的全域狀態，例如：

- 登入者資料
- 購物車內容
- 使用者權限
- 網站主題
- 全域通知

## 四、主要檔案

### `src/App.vue`

`App.vue` 是應用程式最上層的根元件，可以想像成整個網站的主要外框：

```text
App.vue
├── Navbar
├── RouterView
│   └── 目前網址對應的頁面
└── Footer
```

### `src/main.js`

`main.js` 是 JavaScript 的執行入口，通常會負責建立 Vue 應用程式、載入外掛，最後掛載到網頁上。

```javascript
// 匯入建立 Vue 應用程式所需的函式
import { createApp } from 'vue'
// 匯入 Pinia，用於管理共享狀態
import { createPinia } from 'pinia'

// 匯入根元件、路由設定
import App from './App.vue'
import router from './router'

// 建立 Vue 應用程式
const app = createApp(App)

// 載入 Pinia 與路由功能
app.use(createPinia())
app.use(router)

// 將應用程式掛載到 index.html 的 #app
app.mount('#app')
```

執行流程如下：

```text
建立 Vue 應用程式
        ↓
載入 Pinia
        ↓
載入路由
        ↓
將 App.vue 掛載到 #app
```

### `index.html`

`index.html` 中通常會有以下容器：

```html
<!-- Vue 應用程式最後顯示的根容器 -->
<div id="app"></div>
```

這就是 Vue 最後放置整個應用程式的位置。

完整載入流程如下：

```text
瀏覽器載入 index.html
        ↓
執行 src/main.js
        ↓
createApp(App)
        ↓
mount('#app')
        ↓
App.vue 顯示在畫面上
```

## 五、`package.json`

`package.json` 是專案的重要設定檔，會記錄：

- 專案名稱
- 可執行的 npm 指令
- 專案相依套件
- 開發用套件
- 套件版本

常見的指令設定如下：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

因此：

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動本機開發伺服器 |
| `npm run build` | 建立正式版本 |
| `npm run preview` | 預覽正式建置結果 |

執行以下指令時：

```powershell
npm run build
```

Vite 會將正式部署用的檔案輸出至：

```text
dist/
```

## 六、整體結構總覽

```text
專案根目錄
├── node_modules/       # 已安裝的第三方套件
├── public/             # 不需經過 Vite 處理的靜態檔案
├── src/                # 專案主要原始碼
│   ├── components/     # 可重複使用的介面元件
│   ├── views/          # 頁面層級元件
│   ├── router/         # 網址與頁面的對應設定
│   ├── stores/         # Pinia 全域狀態
│   ├── App.vue         # 根元件
│   └── main.js         # 應用程式入口
├── index.html          # 網頁入口與 #app 容器
├── package.json        # 專案指令與套件設定
└── dist/               # 正式建置後產生的檔案
```

## 七、快速記憶

```text
index.html  →  提供 #app 容器
main.js     →  建立並掛載 Vue 應用程式
App.vue     →  作為整個應用程式的根元件
views       →  放完整頁面
components  →  放可重複使用的元件
router      →  管理網址與頁面的關係
stores      →  管理跨元件共享的狀態
public      →  放原樣提供的靜態檔案
```
