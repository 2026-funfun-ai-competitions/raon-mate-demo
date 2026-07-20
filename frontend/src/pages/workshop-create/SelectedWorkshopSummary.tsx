import type { Venue, WorkshopResponse } from '@/api/workshop'
import { formatDayLabel } from './scheduleMeta'

function durationLabel(startDate: string, endDate: string) {
  const nights = Math.round(
    (new Date(`${endDate}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) /
      86_400_000,
  )
  return nights <= 0 ? '당일' : `${nights}박 ${nights + 1}일`
}

function SelectedWorkshopSummary({
  workshop,
  venue,
  onEdit,
}: {
  workshop: WorkshopResponse
  venue?: Venue
  onEdit: () => void
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">선택한 워크숍 요약</h2>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          수정
        </button>
      </div>

      {venue ? (
        <>
          <div className="flex h-24 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-3xl">
            {venue.imageUri ? (
              <img src={venue.imageUri} alt={venue.name} className="h-full w-full object-cover" />
            ) : (
              '🏞️'
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">{venue.name}</h3>
            {venue.rating != null && (
              <span className="text-xs text-amber-500">
                ★ {venue.rating} ({venue.reviewCount ?? 0})
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(venue.tags ?? []).slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {tag}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-xs text-slate-400">
          아직 선택한 장소가 없어요.
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-1.5 text-xs">
        <li className="flex justify-between text-slate-500">
          <span>진행 일정</span>
          <span className="text-slate-700">
            {formatDayLabel(workshop.preferredStartDate)} ~{' '}
            {formatDayLabel(workshop.preferredEndDate)} ·{' '}
            {durationLabel(workshop.preferredStartDate, workshop.preferredEndDate)}
          </span>
        </li>
        <li className="flex justify-between text-slate-500">
          <span>참석 인원</span>
          <span className="text-slate-700">{workshop.expectedParticipants}명</span>
        </li>
        <li className="flex justify-between text-slate-500">
          <span>1인 예산</span>
          <span className="text-slate-700">
            {workshop.budgetPerPerson.toLocaleString()}원 (총{' '}
            {(workshop.budgetPerPerson * workshop.expectedParticipants).toLocaleString()}원)
          </span>
        </li>
        <li className="flex justify-between text-slate-500">
          <span>워크숍 목적</span>
          <span className="text-right text-slate-700">{workshop.purposeKeywords || '-'}</span>
        </li>
      </ul>
    </div>
  )
}

export default SelectedWorkshopSummary
