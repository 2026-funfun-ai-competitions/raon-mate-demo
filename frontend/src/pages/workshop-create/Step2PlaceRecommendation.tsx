import { useEffect, useState } from 'react'
import {
  ActivityIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DiningIcon,
  HomeIcon,
  LocationIcon,
  RoomIcon,
  SparkleIcon,
  StarIcon,
} from '@/components/icons'
import { recommendVenues, selectVenues, type Venue } from '@/api/workshop'

const filters = [
  { label: '예산', icon: null },
  { label: '거리', icon: LocationIcon },
  { label: '숙소 타입', icon: HomeIcon },
  { label: '액티비티', icon: ActivityIcon },
  { label: '세미나실', icon: RoomIcon },
  { label: '식사 포함 여부', icon: DiningIcon },
]

// AI가 생성하는 값이라 숫자가 아니거나 비어있을 수 있어 방어적으로 포맷한다.
function formatWon(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString() : '정보 없음'
}

function Step2PlaceRecommendation({
  workshopId,
  initialVenues,
  onNext,
  onBack,
  selectedIds,
  onToggle,
  onVenuesLoaded,
  onEditWorkshop,
  onCompare,
}: {
  workshopId: string
  initialVenues: Venue[]
  onNext: () => void
  onBack: () => void
  selectedIds: string[]
  onToggle: (venue: Venue) => void
  onVenuesLoaded: (venues: Venue[]) => void
  onEditWorkshop: () => void
  onCompare: () => void
}) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues)
  const [isLoading, setIsLoading] = useState(initialVenues.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // 이미 추천받은 결과가 있으면(예: 뒤로 갔다가 다시 옴) 재요청하지 않는다.
    // Gemini 응답은 호출마다 달라질 수 있어서, 다시 부르면 서버의 "최신 추천"이
    // 바뀌어 이미 선택해둔 장소의 placeId가 무효화된다. "다시 시도"로 명시적으로
    // 요청했을 때(retryCount > 0)만 다시 부른다.
    if (retryCount === 0 && initialVenues.length > 0) return

    let cancelled = false

    async function loadRecommendations() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await recommendVenues(workshopId, { maxResults: 3 })
        if (!cancelled) {
          setVenues(response.recommendations)
          onVenuesLoaded(response.recommendations)
        }
      } catch (err) {
        if (cancelled) return
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'AI 장소 추천을 불러오지 못했어요.'
        setError(message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadRecommendations()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialVenues is only read on mount by design
  }, [workshopId, retryCount, onVenuesLoaded])

  async function handleNext() {
    setIsSaving(true)
    try {
      await selectVenues(workshopId, selectedIds)
      onNext()
    } catch {
      onNext()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 rounded-xl bg-violet-50 px-5 py-4">
        <div>
          <p className="flex items-center gap-1 font-semibold text-violet-700">
            <SparkleIcon className="h-4 w-4" />
            AI가 조건에 맞는 장소를 찾았어요!
          </p>
          <p className="mt-1 text-xs text-slate-500">AI 추천 결과는 워크숍 조건을 기반으로 생성돼요.</p>
        </div>
        <button
          type="button"
          onClick={onEditWorkshop}
          className="flex flex-shrink-0 items-center gap-1 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50"
        >
          조건 수정하기
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            {Icon ? (
              <Icon className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <span className="text-xs font-semibold text-slate-400">₩</span>
            )}
            {label}
            <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-12 text-sm text-slate-400">
          <SparkleIcon className="h-5 w-5 animate-pulse text-violet-400" />
          AI가 장소를 찾고 있어요...
          <span className="text-xs text-slate-300">
            Gemini와 지도 데이터를 확인하는 중이라 최대 1분 정도 걸릴 수 있어요.
          </span>
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-12 text-center">
          <p className="text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex flex-col gap-4">
          {venues.map((venue) => {
            const isSelected = selectedIds.includes(venue.placeId)
            return (
              <div
                key={venue.placeId}
                className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row ${
                  isSelected ? 'border-violet-300 bg-violet-50/40' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3 sm:items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(venue)}
                    className="mt-1 h-5 w-5 flex-shrink-0 accent-violet-600 sm:mt-0"
                  />
                  <div className="relative flex h-28 w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-3xl">
                    {venue.imageUri ? (
                      <img src={venue.imageUri} alt={venue.name} className="h-full w-full object-cover" />
                    ) : (
                      '🏞️'
                    )}
                    {venue.rank === 1 && (
                      <span className="absolute left-2 top-2 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        AI 추천 1위
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{venue.name}</h3>
                    {venue.rating != null && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-500">
                        <StarIcon className="h-3.5 w-3.5" />
                        {venue.rating}
                      </span>
                    )}
                    {venue.reviewCount != null && (
                      <span className="text-xs text-slate-400">({venue.reviewCount})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{venue.address}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(venue.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {venue.reasons && venue.reasons.length > 0 && (
                    <ul className="flex flex-col gap-0.5 text-xs text-violet-600">
                      {venue.reasons.map((reason) => (
                        <li key={reason}>✓ {reason}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-1 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400">예상 비용</p>
                      <p className="font-semibold text-slate-800">
                        {formatWon(venue.estimatedTotalCost)}원
                        <span className="ml-1 text-xs font-normal text-slate-400">
                          (1인당 {formatWon(venue.estimatedCostPerPerson)}원)
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {venue.mapUri && (
                        <a
                          href={venue.mapUri}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          자세히 보기
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onToggle(venue)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                          isSelected
                            ? 'bg-violet-600 text-white'
                            : 'border border-violet-200 text-violet-600 hover:bg-violet-50'
                        }`}
                      >
                        선택하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            이전 단계로
          </button>
          <span className="text-sm text-slate-500">{selectedIds.length}곳 선택됨</span>
          <button
            type="button"
            onClick={onCompare}
            disabled={venues.length === 0}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            비교하기
          </button>
        </div>
        <button
          type="button"
          onClick={handleNext}
          disabled={isSaving}
          className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          다음 단계로
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Step2PlaceRecommendation
