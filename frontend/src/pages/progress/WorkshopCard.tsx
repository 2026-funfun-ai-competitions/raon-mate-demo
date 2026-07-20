import { Link } from 'react-router-dom'
import { CalendarIcon, LocationIcon, MoreVerticalIcon, PeopleIcon } from '@/components/icons'
import type { WorkshopResponse, WorkshopStatus } from '@/api/workshop'

const statusLabel: Record<WorkshopStatus, string> = {
  DRAFT: '작성 중',
  SURVEY_OPEN: '설문 진행 중',
  SURVEY_CLOSED: '설문 마감',
  ANALYZING: '분석 중',
  PROPOSAL_VOTING: '투표 중',
  CONFIRMED: '확정',
  PLAN_COMPLETED: '완료',
}

const statusStyle: Record<WorkshopStatus, string> = {
  DRAFT: 'bg-amber-100 text-amber-700',
  SURVEY_OPEN: 'bg-blue-100 text-blue-700',
  SURVEY_CLOSED: 'bg-blue-100 text-blue-700',
  ANALYZING: 'bg-blue-100 text-blue-700',
  PROPOSAL_VOTING: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-violet-100 text-violet-700',
  PLAN_COMPLETED: 'bg-slate-200 text-slate-600',
}

const headerGradients = [
  'from-violet-200 to-indigo-100',
  'from-emerald-200 to-teal-100',
  'from-amber-200 to-orange-100',
  'from-blue-200 to-cyan-100',
  'from-pink-200 to-rose-100',
  'from-slate-200 to-slate-100',
]

function formatDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

function formatDateTime(isoStr: string) {
  return new Date(isoStr).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function WorkshopCard({ workshop, colorIndex }: { workshop: WorkshopResponse; colorIndex: number }) {
  const isCompleted = workshop.status === 'PLAN_COMPLETED'
  const gradient = headerGradients[colorIndex % headerGradients.length]

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className={`relative h-24 flex-shrink-0 bg-gradient-to-br ${gradient}`}>
        <span
          className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyle[workshop.status]}`}
        >
          {statusLabel[workshop.status]}
        </span>
        <button
          type="button"
          aria-label="더보기"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-white/60"
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="truncate font-semibold text-slate-800">{workshop.title}</h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <PeopleIcon className="h-3.5 w-3.5" />
            {workshop.expectedParticipants}명
          </span>
          <span>💰 {workshop.budgetPerPerson.toLocaleString()}원/인</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            {formatDate(workshop.preferredStartDate)}
            {workshop.preferredStartDate !== workshop.preferredEndDate &&
              ` ~ ${formatDate(workshop.preferredEndDate)}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
            <LocationIcon className="h-3 w-3" />
            {workshop.preferredRegion}
          </span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
            {workshop.workshopType === 'OVERNIGHT' ? '1박 2일 워크숍' : '당일 워크숍'}
          </span>
        </div>

        <p className="mt-auto pt-2 text-[11px] text-slate-400">
          {isCompleted ? '완료일' : '수정일'} {formatDateTime(workshop.updatedAt)}
        </p>

        <div className="flex gap-2 pt-1">
          <Link
            to={`/workshops/${workshop.id}`}
            className="flex-1 rounded-full bg-violet-600 py-2 text-center text-sm font-medium text-white hover:bg-violet-700"
          >
            {isCompleted ? '상세 보기' : '이어하기'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WorkshopCard
