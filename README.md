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

## 建立新的學習資料夾與分支

本專案採用以下結構：`main` 保留所有學習單元資料夾，而單元分支只顯示該單元資料夾內的檔案。

例如 `04` 單元：

```text
main 分支：
├── 01-setup/
├── 02-template/
├── 03/
└── 04/

04 分支：
├── README.md
├── package.json
├── src/
└── public/
```

### 第一次建立單元

先在 `main` 分支建立並完成單元資料夾，例如 `04/`，再執行：

```powershell
git switch main
git pull --ff-only origin main

# 將單元資料夾提交到 main
git add 04
git commit -m "新增第04單元學習內容"
git push origin main

# 只取出 04/ 的內容，建立 04 分支的根目錄
git subtree split --prefix=04 --branch 04
git push -u origin 04
```

請將指令中的 `04` 替換成新的單元名稱，例如 `05`。`git subtree split --prefix=04` 只會取出 `04/`，不會把 `01-setup/`、`02-template/` 或 `03/` 一起放進 `04` 分支。

### 從單元分支同步回 main

如果是在 `04` 分支修改內容，完成後先推送單元分支：

```powershell
git add .
git commit -m "更新第04單元學習內容"
git push origin 04

# 將 04 分支內容放回 main/04/
git switch main
git subtree pull --prefix=04 origin 04 --squash
git push origin main
```

這個同步方向只會更新 `main/04/`；`main` 裡的其他資料夾不會被放進 `04` 分支。

### 從 main 同步到單元分支

如果直接修改了 `main/04/`，可以重新產生 `04` 分支：

```powershell
git switch main
git subtree split --prefix=04 --branch 04
git push origin 04
```

### 重要注意事項

- 不要在 `04/` 裡執行 `git init`。
- 不要在學習資料夾內建立 `.git`。
- 不要使用子模組方式加入單元資料夾。
- `git subtree split --prefix=單元資料夾 --branch=單元分支` 只會處理指定資料夾。
- `git push origin main` 會推送完整的 `main`；`git push origin 04` 只會推送 `04` 分支。

## 學習紀錄原則

- 每個單元先寫清楚學習目標，再開始實作。
- 一次提交聚焦一個小主題。
- 筆記記錄學到什麼。
- 每完成一個單元，就在該單元的 `README.md` 補上完成日期與作品連結。
