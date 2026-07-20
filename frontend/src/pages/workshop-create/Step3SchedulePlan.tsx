import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  RefreshIcon,
  SparkleIcon,
} from '@/components/icons'
import { generateSchedule, updateSchedule, type ScheduleItem } from '@/api/workshop'
import { categoryMeta, defaultCategoryMeta, formatTimeRange, groupByDate } from './scheduleMeta'

function itemKey(item: ScheduleItem) {
  return `${item.date}-${item.startTime}`
}

function Step3SchedulePlan({
  workshopId,
  initialItems,
  onNext,
  onBack,
  onScheduleLoaded,
}: {
  workshopId: string
  initialItems: ScheduleItem[]
  onNext: () => void
  onBack: () => void
  onScheduleLoaded: (items: ScheduleItem[]) => void
}) {
  const [items, setItems] = useState<ScheduleItem[]>(initialItems)
  const [isLoading, setIsLoading] = useState(initialItems.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const [isEditing, setIsEditing] = useState(false)
  const [draftItems, setDraftItems] = useState<ScheduleItem[]>(initialItems)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    // 이미 생성된 일정이 있으면(예: 이전에 방문했다가 다시 옴) 재생성하지 않는다.
    // "다른 일정 보기"로 명시적으로 요청했을 때(retryCount > 0)만 다시 생성한다.
    if (retryCount === 0 && initialItems.length > 0) return

    let cancelled = false

    async function loadSchedule() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await generateSchedule(workshopId)
        if (!cancelled) {
          setItems(response.items)
          setDraftItems(response.items)
          onScheduleLoaded(response.items)
        }
      } catch (err) {
        if (cancelled) return
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'AI 일정 생성을 불러오지 못했어요.'
        setError(message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadSchedule()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialItems is only read on mount by design
  }, [workshopId, retryCount, onScheduleLoaded])

  function startEditing() {
    setDraftItems(items)
    setSaveError(null)
    setIsEditing(true)
  }

  function updateDraftField(item: ScheduleItem, field: 'title' | 'description', value: string) {
    setDraftItems((current) =>
      current.map((draftItem) =>
        itemKey(draftItem) === itemKey(item) ? { ...draftItem, [field]: value } : draftItem,
      ),
    )
  }

  async function handleSaveEdits() {
    setIsSaving(true)
    setSaveError(null)
    try {
      const response = await updateSchedule(workshopId, draftItems)
      setItems(response.items)
      setDraftItems(response.items)
      onScheduleLoaded(response.items)
      setIsEditing(false)
    } catch {
      setSaveError('일정 저장에 실패했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  const displayedItems = isEditing ? draftItems : items
  const days = groupByDate(displayedItems)

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-800">3. 일정을 계획해보세요</h2>
          <p className="mt-1 text-xs text-slate-500">
            선택한 장소에 맞춰 AI가 최적의 일정을 제안드려요.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          {!isEditing && (
            <>
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <RefreshIcon className="h-3.5 w-3.5" />
                다른 일정 보기
              </button>
              <button
                type="button"
                onClick={startEditing}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                직접 수정하기
              </button>
            </>
          )}
          {isEditing && (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraftItems(items)
                  setIsEditing(false)
                }}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveEdits}
                disabled={isSaving}
                className="flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-12 text-sm text-slate-400">
          <SparkleIcon className="h-5 w-5 animate-pulse text-violet-400" />
          AI가 일정을 짜고 있어요...
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
          {saveError && <p className="text-xs text-red-500">{saveError}</p>}
          {days.map(({ day, date, items: dayItems }) => (
            <div key={day} className="overflow-hidden rounded-xl border border-slate-100">
              <div className="flex">
                <div className="flex w-20 flex-shrink-0 flex-col items-center justify-center bg-violet-50 px-2 py-4 text-center">
                  <span className="text-sm font-bold text-violet-700">{day}</span>
                  <span className="text-xs text-violet-500">{date}</span>
                </div>
                <ul className="flex-1 divide-y divide-slate-100">
                  {dayItems.map((item) => {
                    const meta = categoryMeta[item.type] ?? defaultCategoryMeta
                    const Icon = meta.icon
                    return (
                      <li
                        key={itemKey(item)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm"
                      >
                        <span className="w-28 flex-shrink-0 text-xs text-slate-400">
                          {formatTimeRange(item)}
                        </span>
                        <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(event) =>
                                updateDraftField(item, 'title', event.target.value)
                              }
                              className="w-44 flex-shrink-0 rounded border border-slate-200 px-2 py-1 text-sm font-medium text-slate-800"
                            />
                            <input
                              type="text"
                              value={item.description ?? ''}
                              onChange={(event) =>
                                updateDraftField(item, 'description', event.target.value)
                              }
                              className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-600"
                            />
                          </>
                        ) : (
                          <>
                            <span className="w-44 flex-shrink-0 font-medium text-slate-800">
                              {item.title}
                            </span>
                            <span className="flex-1 text-xs text-slate-500">
                              {item.description}
                            </span>
                          </>
                        )}
                        <span
                          className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${meta.style}`}
                        >
                          {meta.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700">
        <SparkleIcon className="h-4 w-4 flex-shrink-0" />
        AI가 추천한 일정이에요! 필요에 따라 수정하거나 다른 일정을 확인해보세요.
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          이전 단계로
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isEditing}
          className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          다음 단계로
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Step3SchedulePlan
