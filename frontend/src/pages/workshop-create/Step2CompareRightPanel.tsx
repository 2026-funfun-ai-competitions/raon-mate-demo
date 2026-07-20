import { useState } from 'react'
import { BookmarkIcon, ChevronRightIcon, TrashIcon, TrophyIcon } from '@/components/icons'
import { selectVenues, type Venue } from '@/api/workshop'

function Step2CompareRightPanel({
  workshopId,
  venues,
  selectedVenues,
  onToggle,
  onNext,
}: {
  workshopId: string
  venues: Venue[]
  selectedVenues: Venue[]
  onToggle: (venue: Venue) => void
  onNext: () => void
}) {
  const [isSaving, setIsSaving] = useState(false)
  const topPick = venues[0]
  const isTopPickSelected = topPick
    ? selectedVenues.some((v) => v.placeId === topPick.placeId)
    : false

  async function handleConfirm() {
    setIsSaving(true)
    try {
      await selectVenues(
        workshopId,
        selectedVenues.map((venue) => venue.placeId),
      )
    } catch {
      // 저장에 실패해도 다음 단계 진행은 막지 않는다 — 최선 노력(best-effort) 저장.
    } finally {
      setIsSaving(false)
    }
    onNext()
  }

  return (
    <>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">
          선택된 장소 ({selectedVenues.length}/{venues.length})
        </h2>
        {selectedVenues.length === 0 ? (
          <p className="text-xs text-slate-400">비교 카드에서 장소를 선택해보세요.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {selectedVenues.map((venue, index) => (
              <li
                key={venue.placeId}
                className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="truncate text-slate-700">{venue.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onToggle(venue)}
                  aria-label="선택 해제"
                  className="flex-shrink-0 text-slate-400 hover:text-red-500"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {topPick && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1 font-semibold text-slate-800">
              <TrophyIcon className="h-4 w-4 text-amber-500" />
              AI 추천 결과
            </h2>
            <span className="text-[10px] text-slate-400">라온 AI 분석</span>
          </div>
          <p className="text-sm font-semibold text-slate-800">{topPick.name}</p>
          <p className="mb-2 text-xs text-violet-600">이 워크숍에 가장 적합해요!</p>
          {topPick.reasons && topPick.reasons.length > 0 && (
            <ul className="mb-3 flex flex-col gap-1 text-xs text-slate-600">
              {topPick.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  {reason}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => {
              if (!isTopPickSelected) onToggle(topPick)
            }}
            disabled={isTopPickSelected}
            className="w-full rounded-full bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-default disabled:opacity-60"
          >
            {isTopPickSelected ? '선택됨' : '이 장소 선택하기'}
          </button>
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-semibold text-slate-800">선택한 장소로 다음 단계</h2>
        <p className="mb-3 text-xs text-slate-500">선택한 장소로 일정을 계획해볼까요?</p>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={selectedVenues.length === 0 || isSaving}
          className="flex w-full items-center justify-center gap-1 rounded-full bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40"
        >
          {isSaving ? '저장 중...' : '일정 계획하기'}
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-semibold text-slate-800">비교 결과 저장하기</h2>
        <p className="mb-3 text-xs text-slate-500">
          현재 비교 내용을 저장하고 나중에 다시 볼 수 있어요.
        </p>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <BookmarkIcon className="h-4 w-4" />
          비교 결과 저장
        </button>
      </div>
    </>
  )
}

export default Step2CompareRightPanel
