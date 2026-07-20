import type { ReactNode } from 'react'
import { ArrowLeftIcon, RefreshIcon } from '@/components/icons'
import type { Venue } from '@/api/workshop'

function formatWon(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `${value.toLocaleString()}원` : '정보 없음'
}

function bestIndex(values: (number | null)[]) {
  let best = -1
  values.forEach((value, index) => {
    if (value == null) return
    if (best === -1 || value < (values[best] as number)) best = index
  })
  return best
}

function Step2CompareView({
  venues,
  selectedIds,
  onToggle,
  onBack,
  onResetSelection,
}: {
  venues: Venue[]
  selectedIds: string[]
  onToggle: (venue: Venue) => void
  onBack: () => void
  onResetSelection: () => void
}) {
  const bestPerPersonIndex = bestIndex(venues.map((v) => v.estimatedCostPerPerson))
  const bestTotalIndex = bestIndex(venues.map((v) => v.estimatedTotalCost))

  const rows: { label: string; render: (venue: Venue, index: number) => ReactNode }[] = [
    { label: '위치', render: (venue) => venue.address || '-' },
    { label: '카테고리', render: (venue) => venue.category || '-' },
    {
      label: '평점',
      render: (venue) =>
        venue.rating != null ? `⭐ ${venue.rating} (${venue.reviewCount ?? 0})` : '정보 없음',
    },
    {
      label: '1인 비용',
      render: (venue, index) => (
        <span className={index === bestPerPersonIndex ? 'font-semibold text-emerald-600' : ''}>
          {formatWon(venue.estimatedCostPerPerson)}
        </span>
      ),
    },
    {
      label: '총 예상 비용',
      render: (venue, index) => (
        <span className={index === bestTotalIndex ? 'font-semibold text-emerald-600' : ''}>
          {formatWon(venue.estimatedTotalCost)}
        </span>
      ),
    },
    { label: '특징', render: (venue) => (venue.tags ?? []).join(', ') || '-' },
    {
      label: '장점',
      render: (venue) =>
        venue.reasons && venue.reasons.length > 0 ? (
          <ul className="flex flex-col gap-0.5">
            {venue.reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
        ) : (
          '-'
        ),
    },
    {
      label: '고려사항',
      render: (venue) =>
        venue.cautions && venue.cautions.length > 0 ? (
          <ul className="flex flex-col gap-0.5">
            {venue.cautions.map((caution) => (
              <li key={caution}>• {caution}</li>
            ))}
          </ul>
        ) : (
          '-'
        ),
    },
  ]

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 self-start text-xs text-slate-500 hover:text-slate-700"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        장소 추천으로 돌아가기
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">장소 비교하기</h2>
          <p className="mt-1 text-xs text-slate-500">
            추천 받은 장소를 비교하고 우리 워크숍에 가장 적합한 장소를 선택해보세요.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetSelection}
          className="flex flex-shrink-0 items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
          비교 초기화
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {venues.map((venue) => {
          const isSelected = selectedIds.includes(venue.placeId)
          return (
            <div
              key={venue.placeId}
              className={`flex flex-col gap-2 rounded-2xl border p-3 ${
                isSelected ? 'border-violet-300' : 'border-slate-200'
              }`}
            >
              <div className="relative h-28 overflow-hidden rounded-xl bg-slate-100">
                {venue.imageUri ? (
                  <img src={venue.imageUri} alt={venue.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">🏞️</div>
                )}
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                  {venue.rank}
                </span>
                <button
                  type="button"
                  onClick={() => onToggle(venue)}
                  aria-label={isSelected ? '선택 해제' : '선택'}
                  className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded border text-xs ${
                    isSelected
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-slate-200 bg-white text-transparent'
                  }`}
                >
                  ✓
                </button>
              </div>
              <div className="flex items-center gap-1">
                <h3 className="truncate text-sm font-semibold text-slate-800">{venue.name}</h3>
                {venue.rating != null && (
                  <span className="flex-shrink-0 text-xs text-amber-500">★ {venue.rating}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {(venue.tags ?? []).slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="truncate rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs text-slate-400">
            <tr>
              <th className="w-24 px-4 py-3 font-medium">비교 항목</th>
              {venues.map((venue) => (
                <th key={venue.placeId} className="px-4 py-3 font-medium text-slate-600">
                  {venue.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ label, render }) => (
              <tr key={label}>
                <td className="px-4 py-3 align-top text-xs font-medium text-slate-500">{label}</td>
                {venues.map((venue, index) => (
                  <td key={venue.placeId} className="px-4 py-3 align-top text-xs text-slate-700">
                    {render(venue, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Step2CompareView
