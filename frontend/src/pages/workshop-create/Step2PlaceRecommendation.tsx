import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  SparkleIcon,
  StarIcon,
} from '@/components/icons'
import { recommendVenues, selectVenues, type Venue } from '@/api/workshop'

const RECOMMENDATION_STAGES = [
  { title: '워크숍 조건 분석', description: '지역, 인원, 일정과 예산을 확인하고 있어요.', startsAt: 0 },
  { title: '장소 후보 탐색', description: '조건에 맞는 실제 장소를 지도에서 찾고 있어요.', startsAt: 7 },
  { title: '후기와 편의성 검토', description: '평점, 후기와 이동 편의성을 비교하고 있어요.', startsAt: 18 },
  { title: '예산 적합도 분석', description: '예상 비용과 워크숍 적합도를 살펴보고 있어요.', startsAt: 32 },
  { title: '추천 결과 정리', description: '가장 적합한 장소와 추천 이유를 정리하고 있어요.', startsAt: 48 },
] as const

// AI가 생성하는 값이라 숫자가 아니거나 비어있을 수 있어 방어적으로 포맷한다.
function formatWon(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString() : '정보 없음'
}

function RecommendationLoading({ elapsedSeconds }: { elapsedSeconds: number }) {
  const currentStageIndex = RECOMMENDATION_STAGES.findLastIndex(
    (stage) => elapsedSeconds >= stage.startsAt,
  )
  const progress = Math.min(92, 10 + Math.round(elapsedSeconds * 1.35))
  const elapsedLabel =
    elapsedSeconds < 60
      ? `${elapsedSeconds}초`
      : `${Math.floor(elapsedSeconds / 60)}분 ${elapsedSeconds % 60}초`

  return (
    <div
      className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/80 to-white"
      aria-live="polite"
    >
      <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
        <span className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-violet-300 opacity-20" />
          <SparkleIcon className="relative h-7 w-7 animate-pulse" />
        </span>
        <h3 className="font-semibold text-slate-800">AI가 최적의 워크숍 장소를 검토하고 있어요</h3>
        <p className="mt-1 text-xs text-slate-500">
          지도와 장소 정보를 꼼꼼히 비교하느라 보통 1분 정도 걸려요.
        </p>

        <div className="mt-5 w-full max-w-lg">
          <div className="mb-2 flex justify-between text-xs">
            <span className="font-medium text-violet-600">
              {RECOMMENDATION_STAGES[currentStageIndex].title}
            </span>
            <span className="tabular-nums text-slate-400">{elapsedLabel} 경과</span>
          </div>
          <div
            role="progressbar"
            aria-label="장소 추천 진행률"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-2 overflow-hidden rounded-full bg-violet-100"
          >
            <div
              className="h-full rounded-full bg-violet-600 transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-left text-xs text-slate-400">
            {RECOMMENDATION_STAGES[currentStageIndex].description}
          </p>
        </div>
      </div>

      <ol className="grid border-t border-violet-100 bg-white/70 px-5 py-5 sm:grid-cols-5">
        {RECOMMENDATION_STAGES.map((stage, index) => {
          const isComplete = index < currentStageIndex
          const isCurrent = index === currentStageIndex
          return (
            <li
              key={stage.title}
              className="relative flex gap-3 pb-4 last:pb-0 sm:flex-col sm:items-center sm:gap-2 sm:pb-0 sm:text-center"
            >
              {index < RECOMMENDATION_STAGES.length - 1 && (
                <span
                  className={`absolute left-3 top-6 h-[calc(100%-1.5rem)] w-px sm:left-1/2 sm:top-3 sm:h-px sm:w-full ${
                    isComplete ? 'bg-violet-400' : 'bg-slate-200'
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  isComplete
                    ? 'bg-violet-600 text-white'
                    : isCurrent
                      ? 'border-2 border-violet-600 bg-white text-violet-600'
                      : 'border border-slate-200 bg-white text-slate-300'
                }`}
              >
                {isComplete ? '✓' : index + 1}
              </span>
              <span
                className={`relative z-10 text-xs ${
                  isCurrent ? 'font-semibold text-violet-700' : 'text-slate-400'
                }`}
              >
                {stage.title}
              </span>
            </li>
          )
        })}
      </ol>

      {elapsedSeconds >= 60 && (
        <p className="border-t border-slate-100 bg-amber-50 px-5 py-3 text-center text-xs text-amber-700">
          장소 정보를 더 꼼꼼히 확인하고 있어요. 화면을 그대로 두면 완료 즉시 결과를 보여드릴게요.
        </p>
      )}
    </div>
  )
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
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!isLoading) return
    setElapsedSeconds(0)
    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isLoading, retryCount])

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
    if (selectedIds.length === 0) {
      setSelectionError('다음 단계로 이동하려면 장소를 한 곳 이상 선택해 주세요.')
      return
    }
    setIsSaving(true)
    setSelectionError(null)
    try {
      await selectVenues(workshopId, selectedIds)
      onNext()
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '선택한 장소를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.'
      setSelectionError(message)
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
            {isLoading ? 'AI 장소 추천을 시작했어요' : 'AI가 조건에 맞는 장소를 찾았어요!'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isLoading
              ? '선택한 조건을 바탕으로 실제 장소 정보를 검토하고 있어요.'
              : 'AI 추천 결과는 워크숍 조건을 기반으로 생성돼요.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onEditWorkshop}
          disabled={isLoading}
          className="flex flex-shrink-0 items-center gap-1 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          조건 수정하기
        </button>
      </div>

      {isLoading && (
        <RecommendationLoading elapsedSeconds={elapsedSeconds} />
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 px-6 py-10 text-center">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            조건 조정이 필요해요
          </span>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">{error}</p>
          <p className="text-xs text-slate-400">
            입력한 조건에 맞는 장소가 없습니다.
          </p>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={onEditWorkshop}
              className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700"
            >
              조건 수정하기
            </button>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              다시 검토하기
            </button>
          </div>
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
                    {venue.imageUri === '/images/venues/workshop-default.png' && (
                      <span className="absolute bottom-2 right-2 rounded-full bg-slate-800/70 px-2 py-0.5 text-[10px] font-medium text-white">
                        기본 이미지
                      </span>
                    )}
                    {venue.photoAttributions && venue.photoAttributions.length > 0 && (
                      <span className="absolute bottom-1 left-1 max-w-[90%] truncate rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                        사진: {venue.photoAttributions.join(', ')}
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
                  {venue.cautions && venue.cautions.length > 0 && (
                    <ul className="flex flex-col gap-0.5 text-xs text-amber-600">
                      {venue.cautions.map((caution) => (
                        <li key={caution}>※ {caution}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-1 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400">예상 비용</p>
                      {venue.estimatedTotalCostMin == null || venue.estimatedTotalCostMax == null ? (
                        <p className="font-semibold text-slate-600">업체 문의 필요</p>
                      ) : (
                        <div>
                          <p className="font-semibold text-slate-800">
                            약 {formatWon(venue.estimatedTotalCostMin)}~
                            {formatWon(venue.estimatedTotalCostMax)}원
                          </p>
                          <p className="text-xs text-slate-400">
                            1인당 {formatWon(venue.estimatedCostMinPerPerson)}~
                            {formatWon(venue.estimatedCostMaxPerPerson)}원 · AI 추정
                          </p>
                          {venue.costAssumptions && venue.costAssumptions.length > 0 && (
                            <p className="mt-0.5 text-[10px] text-slate-400">
                              가정: {venue.costAssumptions.join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {venue.mapUri && (
                        <a
                          href={venue.mapUri}
                          target="_blank"
                          rel="noreferrer"
                          className="whitespace-nowrap rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          자세히 보기
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onToggle(venue)}
                        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium ${
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
        <div className="flex flex-col items-end gap-1">
          {selectionError && <p className="text-xs text-red-500">{selectionError}</p>}
          <button
            type="button"
            onClick={handleNext}
            disabled={isSaving || isLoading || Boolean(error)}
            className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            다음 단계로
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step2PlaceRecommendation
