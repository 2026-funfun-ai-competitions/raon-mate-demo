import {
  CalendarIcon,
  ChecklistIcon,
  LocationIcon,
  PencilIcon,
  PeopleIcon,
  PinIcon,
  SparkleIcon,
} from '@/components/icons'
import type { Venue, WorkshopResponse } from '@/api/workshop'

const workshopTypeLabel: Record<WorkshopResponse['workshopType'], string> = {
  OVERNIGHT: '1박 2일',
  DAY_TRIP: '당일',
}

function Step2RightPanel({
  workshop,
  venues,
  onEditWorkshop,
}: {
  workshop: WorkshopResponse
  venues: Venue[]
  onEditWorkshop: () => void
}) {
  const topVenue = venues[0]

  const conditionSummary = [
    { icon: PeopleIcon, label: '참석 인원', value: `${workshop.expectedParticipants}명` },
    {
      icon: null,
      label: '예산',
      value: `1인 ${workshop.budgetPerPerson.toLocaleString()}원 (총 ${(
        workshop.budgetPerPerson * workshop.expectedParticipants
      ).toLocaleString()}원)`,
    },
    { icon: CalendarIcon, label: '진행 방식', value: workshopTypeLabel[workshop.workshopType] },
    { icon: LocationIcon, label: '지역', value: workshop.preferredRegion },
    { icon: ChecklistIcon, label: '워크숍 목적', value: workshop.purposeKeywords || '-' },
  ]

  return (
    <>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1 font-semibold text-slate-800">
          <SparkleIcon className="h-4 w-4 text-violet-500" />
          AI 추천 이유
        </h2>
        {topVenue?.reasons && topVenue.reasons.length > 0 ? (
          <ul className="flex flex-col gap-2 text-xs text-slate-600">
            {topVenue.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">
                  ✓
                </span>
                {reason}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400">추천 결과를 기다리고 있어요.</p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">추천 장소 지도</h2>
        {venues.length > 0 ? (
          <div className="flex h-40 flex-col justify-center gap-2 rounded-xl bg-slate-100 p-4">
            {venues.map((venue) => (
              <div key={venue.placeId} className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-semibold text-white">
                  {venue.rank}
                </span>
                <PinIcon className="h-4 w-4 text-violet-500" />
                <span className="truncate text-slate-600">{venue.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
            추천 결과를 기다리고 있어요.
          </div>
        )}
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-slate-400 hover:text-slate-600"
        >
          전체 지도 보기
        </button>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">선택한 조건 요약</h2>
          <button
            type="button"
            onClick={onEditWorkshop}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
          >
            <PencilIcon className="h-3 w-3" />
            수정
          </button>
        </div>
        <ul className="flex flex-col gap-2.5 text-xs">
          {conditionSummary.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-start gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-slate-400">
                {Icon ? <Icon className="h-4 w-4" /> : <span className="font-semibold">₩</span>}
              </span>
              <span className="w-16 flex-shrink-0 text-slate-400">{label}</span>
              <span className="text-slate-700">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Step2RightPanel
