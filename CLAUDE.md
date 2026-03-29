# jackjeanne-merch

Jack Jeanne 官方周邊商品查詢工具，個人使用。

## 專案概覽

- **前端**：React + Vite，靜態部署於 GitHub Pages
- **資料**：爬取官網 HTML，輸出至 `src/data/products.json`
- **無後端**：所有邏輯在前端，購入狀態存於 localStorage

## 常用指令

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置生產版本
npm run scrape   # 爬取官網更新 products.json
```

## 資料更新流程

官網發布新周邊時：
1. 將新頁面 URL 加入 `scripts/scrape.js` 的 `YEAR_PAGES` 陣列
2. 執行 `npm run scrape`
3. 確認 `src/data/products.json` 內容正確後 push

官網各年份公告頁 URL pattern：`https://jackjeanne.com/news/?id=YYMMDD-1`

## 專案結構

```
src/
├── components/
│   ├── FilterBar.jsx     # 多選篩選（分類、年份、購入狀態）
│   ├── Lightbox.jsx      # 圖片大圖顯示
│   ├── ProductCard.jsx   # 商品卡片，含購入切換
│   └── SearchBar.jsx     # 關鍵字搜尋輸入
├── data/
│   └── products.json     # 爬蟲產出的商品資料（勿手動編輯）
├── utils/
│   └── searchDictionary.js  # 繁中／英文 → 日文搜尋對照表
├── App.jsx
└── App.css

scripts/
└── scrape.js             # 爬蟲主程式（Node.js + Cheerio）

.github/workflows/
├── deploy.yml            # push to main → 自動部署 GitHub Pages
└── scrape.yml            # 手動觸發爬蟲（workflow_dispatch）
```

## 視覺風格

沿襲官網設計：
- 主色：`#3ebfe9`（青色）
- 背景：官網 `bg.jpg` 格紋
- 字型：Montserrat（英文）、Noto Sans/Serif JP（日文）
- 無圓角、方正邊框

## 搜尋邏輯

`searchDictionary.js` 維護繁中 → 日文對照表，使用者輸入中文或英文會自動展開成日文關鍵字進行搜尋。新增詞彙直接在 `dictionary` 物件中加入即可。

## 部署

GitHub Pages，網址：`https://<username>.github.io/jackjeanne-merch/`

push 到 `main` 後 GitHub Actions 自動 build 並部署。
