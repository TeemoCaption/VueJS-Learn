# Vue.js 學習歷程

這個儲存庫用來記錄 Vue.js 學習過程中的筆記、練習與小作品。

## 分支規劃

| 分支 | 學習內容 |
| --- | --- |
| `main` | 學習歷程總覽與已完成單元 |
| `單元分支名稱` | 單元簡述 |

## 學習單元格式

每個單元分支包含以下內容：

```text
單元分支名稱
├── README.md       # 單元目標、重點與完成紀錄
├── notes/          # 學習筆記
└── 程式碼        
```

## 建立單元分支

```powershell
git switch main
git pull origin main
git switch -c 單元分支名稱
```

完成單元後，先提交並推送：

```powershell
git add .
git commit -m "學習備註"
git push -u origin 單元分支名稱
```

## 學習紀錄原則

- 每個單元先寫清楚學習目標，再開始實作。
- 一次提交聚焦一個小主題。
- 筆記記錄學到什麼。
- 每完成一個單元，就在該單元的 `README.md` 補上完成日期與作品連結。
