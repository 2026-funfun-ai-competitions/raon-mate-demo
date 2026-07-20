import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChecklistIcon, ChevronDownIcon, PencilIcon, SparkleIcon } from '@/components/icons'
import { getWorkshop, type WorkshopResponse } from '@/api/workshop'
import { checklistCategories, doneChecklistCount, totalChecklistCount } from './checklist/checklistData'
import ChecklistRightPanel from './checklist/ChecklistRightPanel'

type Tab = 'all' | 'incomplete' | 'complete'

const readinessPercent = Math.round((doneChecklistCount / totalChecklistCount) * 100)
const incompleteCount = totalChecklistCount - doneChecklistCount

function ChecklistPage() {
  const { workshopId } = useParams()
  const [workshop, setWorkshop] = useState<WorkshopResponse | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    if (!workshopId) return
    let cancelled = false
    getWorkshop(workshopId)
      .then((response) => {
        if (!cancelled) setWorkshop(response)
      })
      .catch(() => {
        // 워크숍 제목을 못 가져와도 체크리스트 자체는 보여준다.
      })
    return () => {
      cancelled = true
    }
  }, [workshopId])

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <ChecklistIcon className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">워크숍 체크리스트</h1>
              <p className="text-sm text-slate-500">
                {workshop ? `${workshop.title} — ` : ''}AI가 워크숍 준비 상황을 점검했어요. 마지막까지
                꼼꼼하게 확인해보세요!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">
                준비도 <span className="text-lg font-bold text-violet-700">{readinessPercent}%</span>
              </p>
              <div className="mt-1 h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {doneChecklistCount} / {totalChecklistCount} 완료
              </p>
            </div>
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(
              [
                { key: 'all', label: `전체 (${totalChecklistCount})` },
                { key: 'incomplete', label: `미완료 (${incompleteCount})` },
                { key: 'complete', label: `완료 (${doneChecklistCount})` },
              ] as { key: Tab; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeTab === key
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <ChevronDownIcon
                className={`h-3.5 w-3.5 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
              />
              {isExpanded ? '전체 접기' : '전체 펼치기'}
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <PencilIcon className="h-3.5 w-3.5" />
              카테고리 편집
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {checklistCategories.map(({ name, icon: Icon, color, items }) => {
            const visibleItems = items.filter((item) => {
              if (activeTab === 'incomplete') return !item.done
              if (activeTab === 'complete') return item.done
              return true
            })
            if (visibleItems.length === 0) return null

            const categoryDone = items.filter((item) => item.done).length
            const categoryPercent = Math.round((categoryDone / items.length) * 100)

            return (
              <div key={name} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">{name}</h3>
                      <span className="text-xs text-slate-400">
                        {categoryDone} / {items.length} 완료
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${categoryPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 flex flex-wrap gap-2 pl-12">
                    {visibleItems.map((item) => (
                      <span
                        key={item.label}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                          item.done
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                            : 'border-slate-200 text-slate-400'
                        }`}
                      >
                        <span
                          className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-[9px] ${
                            item.done ? 'bg-emerald-500 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {item.done ? '✓' : ''}
                        </span>
                        {item.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700">
          <SparkleIcon className="h-4 w-4 flex-shrink-0" />
          AI 한 줄 요약: 전반적으로 잘 준비되고 있어요! 미완료 항목 {incompleteCount}가지만 마무리하면
          완벽한 워크숍이 될 거예요.
        </div>

        <div className="flex flex-col items-center gap-1 pt-2">
          <button
            type="button"
            disabled={incompleteCount > 0}
            className="w-full max-w-md rounded-full bg-violet-600 py-3 text-center font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ✓ 워크숍 준비 완료!
          </button>
          <p className="text-xs text-slate-400">모든 항목을 완료하면 워크숍 준비를 완료할 수 있어요.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ChecklistRightPanel />
      </div>
    </div>
  )
}

export default ChecklistPage
