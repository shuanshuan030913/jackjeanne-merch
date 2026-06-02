# jackjeanne-merch

Jack Jeanne 官方周邊商品查詢工具，個人使用。

🔗 **[線上瀏覽](https://shuanshuan030913.github.io/jackjeanne-merch/)**

## 功能

- 關鍵字搜尋（支援繁中 / 英文自動對應日文）
- 依分類、年份、購入狀態篩選
- 點擊標記已購入，狀態存於 localStorage
- 點擊圖片放大預覽

## 更新資料

官網發布新周邊時：

1. 將新公告頁 URL 加入 `scripts/scrape.js` 的 `YEAR_PAGES`
2. 執行爬蟲：

```bash
npm run scrape
```

3. 確認 `src/data/products.json` 內容正確後 push

> 官網各年份公告頁 URL pattern：`https://jackjeanne.com/news/?id=YYMMDD-1`
>
> 也可在 GitHub → Actions → **Scrape Merch Data** 手動觸發，自動 commit 更新結果。

## 本地開發

```bash
npm install
npm run dev      # 開發伺服器
npm run build    # 建置生產版本
```
