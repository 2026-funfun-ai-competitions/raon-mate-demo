import { useEffect, useState } from 'react'
import {
  ActivityIcon,
  ArrowLeftIcon,
  BedIcon,
  BusIcon,
  ChevronRightIcon,
  DiningIcon,
  DownloadIcon,
  PencilIcon,
  RoomIcon,
  SparkleIcon,
  StarIcon,
} from '@/components/icons'
import { initializeBudget, updateBudget, type BudgetItem, type BudgetResponse } from '@/api/workshop'
import CircularProgress from './CircularProgress'

const categoryMeta: Record<string, typeof BedIcon> = {
  ACCOMMODATION: BedIcon,
  MEAL: DiningIcon,
  TRANSPORTATION: BusIcon,
  ACTIVITY: ActivityIcon,
  MEETING_ROOM: RoomIcon,
  ETC: StarIcon,
}

function Step4BudgetManagement({
  workshopId,
  initialBudget,
  onNext,
  onBack,
  onBudgetLoaded,
}: {
  workshopId: string
  initialBudget: BudgetResponse | null
  onNext: () => void
  onBack: () => void
  onBudgetLoaded: (budget: BudgetResponse) => void
}) {
  const [budget, setBudget] = useState<BudgetResponse | null>(initialBudget)
  const [isLoading, setIsLoading] = useState(initialBudget === null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const [isEditing, setIsEditing] = useState(false)
  const [draftItems, setDraftItems] = useState<BudgetItem[]>(initialBudget?.items ?? [])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    // 이미 초기화된 예산이 있으면 재계산하지 않는다.
    if (retryCount === 0 && initialBudget !== null) return

    let cancelled = false

    async function loadBudget() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await initializeBudget(workshopId)
        if (!cancelled) {
          setBudget(response)
          setDraftItems(response.items)
          onBudgetLoaded(response)
        }
      } catch (err) {
        if (cancelled) return
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          '예산 정보를 불러오지 못했어요.'
        setError(message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadBudget()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialBudget is only read on mount by design
  }, [workshopId, retryCount, onBudgetLoaded])

  function startEditing() {
    if (!budget) return
    setDraftItems(budget.items)
    setSaveError(null)
    setIsEditing(true)
  }

  function updateDraftAmount(category: string, amount: number) {
    const participants = budget?.expectedParticipants ?? 1
    setDraftItems((current) =>
      current.map((item) =>
        item.category === category
          ? { ...item, amount, perPersonAmount: Math.round(amount / participants) }
          : item,
      ),
    )
  }

  async function handleSaveEdits() {
    setIsSaving(true)
    setSaveError(null)
    try {
      const response = await updateBudget(workshopId, draftItems)
      setBudget(response)
      setDraftItems(response.items)
      onBudgetLoaded(response)
      setIsEditing(false)
    } catch {
      setSaveError('예산 저장에 실패했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  const displayedItems = isEditing ? draftItems : (budget?.items ?? [])

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-800">4. 예산을 확인하고 관리해보세요</h2>
          <p className="mt-1 text-xs text-slate-500">
            AI가 추천한 일정과 장소 기준으로 예산을 산출했어요.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            엑셀 다운로드
          </button>
          {budget && !isEditing && (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <PencilIcon className="h-3.5 w-3.5" />
              직접 수정하기
            </button>
          )}
          {isEditing && (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraftItems(budget?.items ?? [])
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
          AI가 예산을 계산하고 있어요...
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

      {!isLoading && !error && budget && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400">총 예산 (1인 기준)</p>
              <p className="mt-1 font-semibold text-slate-800">
                {budget.budgetPerPerson.toLocaleString()}원
              </p>
              <p className="text-xs text-slate-400">(총 {budget.limitAmount.toLocaleString()}원)</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400">예상 지출 합계</p>
              <p className="mt-1 font-semibold text-slate-800">
                {budget.totalAmount.toLocaleString()}원
              </p>
              <p className="text-xs text-slate-400">
                (1인 {budget.estimatedPerPerson.toLocaleString()}원)
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400">예산 대비</p>
              <p
                className={`mt-1 font-semibold ${
                  budget.remainingAmount >= 0 ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {Math.abs(budget.remainingAmount).toLocaleString()}원{' '}
                {budget.remainingAmount >= 0 ? '남음' : '초과'}
              </p>
              <p className="text-xs text-slate-400">
                (1인{' '}
                {Math.abs(budget.budgetPerPerson - budget.estimatedPerPerson).toLocaleString()}원)
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
              <CircularProgress percent={Math.round(budget.usagePercent)} />
              <p className="text-xs text-slate-400">예산 사용률</p>
            </div>
          </div>

          {saveError && <p className="text-xs text-red-500">{saveError}</p>}

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">항목</th>
                  <th className="px-4 py-3 font-medium">세부 내용</th>
                  <th className="px-4 py-3 font-medium">1인 기준</th>
                  <th className="px-4 py-3 font-medium">총 금액</th>
                  <th className="px-4 py-3 font-medium">비율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedItems.map((item) => {
                  const Icon = categoryMeta[item.category] ?? StarIcon
                  return (
                    <tr key={item.category}>
                      <td className="flex items-center gap-2 px-4 py-3 font-medium text-slate-700">
                        <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{item.note}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.perPersonAmount.toLocaleString()}원
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {isEditing ? (
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(event) =>
                              updateDraftAmount(item.category, Number(event.target.value))
                            }
                            className="w-28 rounded border border-slate-200 px-2 py-1 text-sm text-slate-800"
                          />
                        ) : (
                          `${item.amount.toLocaleString()}원`
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-violet-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-100 font-semibold text-slate-800">
                  <td className="px-4 py-3" colSpan={2}>
                    합계
                  </td>
                  <td className="px-4 py-3">{budget.estimatedPerPerson.toLocaleString()}원</td>
                  <td className="px-4 py-3">{budget.totalAmount.toLocaleString()}원</td>
                  <td className="px-4 py-3">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700">
            <SparkleIcon className="h-4 w-4 flex-shrink-0" />
            {budget.remainingAmount >= 0
              ? 'AI 분석 결과, 예산 내에서 여유가 있어요! 액티비티 업그레이드나 기념품 추가를 고려해보세요.'
              : 'AI 분석 결과, 예산을 초과했어요. 항목별 비용을 조정해보세요.'}
          </div>
        </>
      )}

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

export default Step4BudgetManagement
