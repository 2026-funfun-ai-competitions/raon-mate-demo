import { ChevronRightIcon, SparkleIcon } from '@/components/icons'
import type { Venue, WorkshopResponse } from '@/api/workshop'
import SelectedWorkshopSummary from './SelectedWorkshopSummary'

const budgetCompare = [
  { label: '이번 워크숍', value: '143,200원', percent: 94, color: 'bg-violet-500' },
  { label: '유사 워크숍 평균', value: '152,000원', percent: 100, color: 'bg-slate-300' },
  { label: '절약 가능 예산', value: '8,800원 ↓', percent: 6, color: 'bg-emerald-400' },
]

const budgetTips = [
  '평일 진행으로 숙박비를 절약했어요.',
  '대형버스 단체 이용으로 교통비를 절감했어요.',
  '액티비티를 패키지로 구성해 비용 효율을 높였어요.',
]

function Step4RightPanel({
  workshop,
  venue,
  onEditWorkshop,
}: {
  workshop: WorkshopResponse
  venue?: Venue
  onEditWorkshop: () => void
}) {
  return (
    <>
      <SelectedWorkshopSummary workshop={workshop} venue={venue} onEdit={onEditWorkshop} />

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">예산 비교 가이드</h2>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs text-slate-400 hover:text-slate-600"
          >
            더보기
            <ChevronRightIcon className="h-3 w-3" />
          </button>
        </div>
        <p className="mb-3 text-xs text-slate-500">
          유사 규모 워크숍의 평균 예산과 비교해보세요.
        </p>
        <p className="mb-2 text-[11px] text-slate-400">
          {workshop.expectedParticipants}명 기준 (1인당)
        </p>
        <div className="flex flex-col gap-2">
          {budgetCompare.map(({ label, value, percent, color }) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <span className="w-24 flex-shrink-0 text-slate-500">{label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
              </div>
              <span className="w-16 flex-shrink-0 text-right font-medium text-slate-700">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1 font-semibold text-slate-800">
          <SparkleIcon className="h-4 w-4 text-violet-500" />
          AI 예산 팁
        </h2>
        <ul className="flex flex-col gap-2 text-xs text-slate-600">
          {budgetTips.map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-full bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          예산 조정 제안 받기
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl">
          🤖
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">더 좋은 장소를 찾고 싶다면?</p>
          <p className="mb-2 text-xs text-slate-500">
            예산에 맞는 다른 장소를 다시 추천받아보세요!
          </p>
          <button
            type="button"
            className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white"
          >
            장소 다시 추천받기
          </button>
        </div>
      </div>
    </>
  )
}

export default Step4RightPanel
