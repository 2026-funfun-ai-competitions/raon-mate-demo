import {
  CalendarIcon,
  ChecklistIcon,
  LocationIcon,
  PencilIcon,
  PeopleIcon,
  PinIcon,
  SparkleIcon,
} from '@/components/icons'

const aiReasons = [
  '참석 인원 25명에 적합한 공간 보유',
  '서울에서 이동시간 2시간 이내',
  '예산 1인당 15만원 이내 충족',
  '팀빌딩 및 소통 강화에 적합한 프로그램 보유',
  '이용 후기 평점 4.7 이상',
]

const mapPins = [
  { rank: 1, name: '가평' },
  { rank: 2, name: '양평' },
  { rank: 3, name: '용인' },
]

const conditionSummary = [
  { icon: PeopleIcon, label: '참석 인원', value: '25명' },
  { icon: null, label: '예산', value: '1인 150,000원 (총 3,750,000원)' },
  { icon: CalendarIcon, label: '진행 방식', value: '1박 2일' },
  { icon: LocationIcon, label: '지역', value: '서울 근교' },
  { icon: ChecklistIcon, label: '워크숍 목적', value: '팀 빌딩, 소통 강화, 하반기 목표 공유' },
]

function Step2RightPanel() {
  return (
    <>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1 font-semibold text-slate-800">
          <SparkleIcon className="h-4 w-4 text-violet-500" />
          AI 추천 이유
        </h2>
        <ul className="flex flex-col gap-2 text-xs text-slate-600">
          {aiReasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">
                ✓
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">추천 장소 지도</h2>
        <div className="flex h-40 flex-col justify-center gap-2 rounded-xl bg-slate-100 p-4">
          {mapPins.map(({ rank, name }) => (
            <div key={name} className="flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-semibold text-white">
                {rank}
              </span>
              <PinIcon className="h-4 w-4 text-violet-500" />
              <span className="text-slate-600">{name}</span>
            </div>
          ))}
        </div>
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
