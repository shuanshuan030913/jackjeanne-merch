const CATEGORIES = [
  { value: 'sticker', label: 'ステッカー' },
  { value: 'acrylic', label: 'アクリル' },
  { value: 'badge', label: '缶バッジ' },
  { value: 'card', label: 'カード' },
  { value: 'poster', label: 'ポスター' },
  { value: 'other', label: 'その他' },
]

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021]

const OWNED_OPTIONS = [
  { value: 'owned', label: '購入済み' },
  { value: 'unowned', label: '未購入' },
]

function MultiSelect({ options, selected, onChange }) {
  function toggle(value) {
    const next = new Set(selected)
    next.has(value) ? next.delete(value) : next.add(value)
    onChange(next)
  }

  return (
    <div className="filter-buttons">
      {options.map((o) => (
        <button
          key={o.value}
          className={selected.has(o.value) ? 'active' : ''}
          onClick={() => toggle(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function FilterBar({ categories, years, owned, onCategoriesChange, onYearsChange, onOwnedChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Category</label>
        <MultiSelect
          options={CATEGORIES}
          selected={categories}
          onChange={onCategoriesChange}
        />
      </div>
      <div className="filter-group">
        <label>Year</label>
        <MultiSelect
          options={YEARS.map((y) => ({ value: y, label: `${y}年` }))}
          selected={years}
          onChange={onYearsChange}
        />
      </div>
      <div className="filter-group">
        <label>Status</label>
        <div className="filter-buttons">
          {OWNED_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={
                owned === o.value
                  ? o.value === 'owned' ? 'active-owned' : 'active'
                  : ''
              }
              onClick={() => onOwnedChange(owned === o.value ? '' : o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
