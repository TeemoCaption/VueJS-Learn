# Vue.js 學習歷程

這個儲存庫用來記錄 Vue.js 學習過程中的筆記、練習與小作品。

## 分支規劃

| 分支 | 學習內容 |
| --- | --- |
| `main` | 學習歷程總覽與已完成單元 |
| `unit/01-html-css` | HTML 與 CSS 基礎 |
| `unit/02-javascript` | JavaScript 基礎 |
| `unit/03-vue-basics` | Vue.js 基礎語法與元件 |
| `unit/04-vue-router` | 路由與頁面切換 |
| `unit/05-state-management` | 狀態管理 |
| `unit/06-project` | 綜合實作專案 |

## 學習單元格式

每個單元建議包含以下內容：

```text
units/01-html-css/
├── README.md       # 單元目標、重點與完成紀錄
├── notes/          # 學習筆記
├── exercises/      # 練習題
└── project/        # 單元作品
```

## 建立單元分支

```powershell
git switch main
git pull origin main
git switch -c unit/01-html-css
```

完成單元後，先提交並推送：

```powershell
git add .
git commit -m "完成 HTML 與 CSS 基礎單元"
git push -u origin unit/01-html-css
```

確認內容無誤後，再合併回 `main`：

```powershell
git switch main
git pull origin main
git merge --no-ff unit/01-html-css -m "合併 HTML 與 CSS 基礎單元"
git push origin main
```

## 學習紀錄原則

- 每個單元先寫清楚學習目標，再開始實作。
- 一次提交聚焦一個小主題，方便日後回顧。
- 筆記記錄「學到什麼、如何驗證、遇到什麼問題、如何修正」。
- 每完成一個單元，就在該單元的 `README.md` 補上完成日期與作品連結。
