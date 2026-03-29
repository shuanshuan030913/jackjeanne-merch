import { load } from 'cheerio'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 每年的周邊公告頁 URL
const YEAR_PAGES = [
  { year: 2021, url: 'https://jackjeanne.com/news/?id=210319-1' },
  { year: 2022, url: 'https://jackjeanne.com/news/?id=220318-1' },
  { year: 2023, url: 'https://jackjeanne.com/news/?id=230303-1' },
  { year: 2024, url: 'https://jackjeanne.com/news/?id=240301-1' },
  { year: 2025, url: 'https://jackjeanne.com/news/?id=250307-1' },
  { year: 2026, url: 'https://jackjeanne.com/news/?id=260327-1' },
]

const CATEGORY_MAP = {
  'ステッカー': 'sticker',
  'シール': 'sticker',
  'アクリルスタンド': 'acrylic',
  'アクリルマスコット': 'acrylic',
  'アクリルチャーム': 'acrylic',
  'アクリルブロック': 'acrylic',
  'アクリル': 'acrylic',
  '缶バッジ': 'badge',
  'カード': 'card',
  'ポスター': 'poster',
  'アロマ': 'other',
}

function inferCategory(name) {
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (name.includes(keyword)) return category
  }
  return 'other'
}

function parsePrice(text) {
  return text?.replace(/\s+/g, '').trim() || null
}

function extractProducts($, year, sourceUrl) {
  const products = []

  // 各商品為獨立 section，包含 .flexBox 或 table.def
  $('section').each((_, section) => {
    const $section = $(section)
    const name = $section.find('h1, h2, h3').first().text().trim()

    // 過濾掉頁面標題（包含『』書名號的是公告標題，不是商品名）
    if (!name || name.includes('』')) return

    const table = $section.find('table.def')
    if (!table.length) return

    const data = {}
    table.find('tr').each((_, row) => {
      const key = $(row).find('th').text().trim()
      const val = $(row).find('td').text().replace(/\s+/g, ' ').trim()
      data[key] = val
    })

    // 圖片：section 內第一張圖
    const imgSrc = $section.find('img').first().attr('src') || ''
    const image = imgSrc.startsWith('http')
      ? imgSrc
      : imgSrc
        ? `https://jackjeanne.com${imgSrc}`
        : ''

    // 詳細連結（Broccoli Online 購入頁）
    const detailUrl =
      $section.find('a[href*="broccolionline"]').attr('href') || null

    // 單價 / BOX 價格（可能在同一欄位用換行分隔）
    const rawPrice = data['価格'] || ''
    const priceLines = rawPrice.split(/[\n／]/).map((s) => s.trim()).filter(Boolean)
    const price = parsePrice(priceLines[0]) || null
    const boxLine = priceLines.find((l) => l.includes('BOX') || l.includes('箱'))
    const boxPrice = boxLine ? parsePrice(boxLine.replace(/^BOX[:：]?\s*/i, '')) : null

    const boxQuantity = data['種類数']?.match(/\d+個入/)?.[0] || null

    products.push({
      name,
      year,
      category: inferCategory(name),
      varieties: data['種類数'] || null,
      price,
      boxPrice,
      boxQuantity,
      releaseDate: data['発売日'] || null,
      distribution: data['販売形態'] || null,
      specs: data['商品仕様'] || null,
      image,
      sourceUrl,
      detailUrl,
    })
  })

  return products
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.text()
}

async function main() {
  const allProducts = []
  let idCounter = 1

  for (const { year, url } of YEAR_PAGES) {
    console.log(`Scraping ${year}... (${url})`)
    try {
      const html = await fetchPage(url)
      const $ = load(html)
      const products = extractProducts($, year, url)
      products.forEach((p) => {
        allProducts.push({ id: idCounter++, ...p })
      })
      console.log(`  → ${products.length} items found`)
    } catch (err) {
      console.warn(`  ⚠ Skipped ${year}: ${err.message}`)
    }

    // 禮貌性延遲，避免對官網造成壓力
    await new Promise((r) => setTimeout(r, 2000))
  }

  const outputPath = resolve(__dirname, '../src/data/products.json')
  writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf-8')
  console.log(`\nDone. ${allProducts.length} products written to src/data/products.json`)
}

main()
