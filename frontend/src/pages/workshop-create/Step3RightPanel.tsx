import { BusIcon, CalendarIcon, DiningIcon, PeopleIcon, SparkleIcon } from '@/components/icons'

const recommendationPoints = [
  '팀빌딩과 소통 강화를 위한 최적의 프로그램 배치',
  '업무 몰입도 향상을 위한 적절한 휴식 시간 포함',
  '식사 시간과 이동 시간을 고려한 효율적인 일정',
  '참가자 만족도가 높은 인기 프로그램 구성',
]

const scheduleOverview = [
  { icon: CalendarIcon, label: '진행 기간', value: '1박 2일' },
  { icon: CalendarIcon, label: '총 일정', value: '9개' },
  { icon: DiningIcon, label: '식사', value: '3회' },
  { icon: BusIcon, label: '이동', value: '2회' },
  { icon: PeopleIcon, label: '주요 활동', value: '팀빌딩, 세션, 네트워킹' },
]

const timeline = [
  {
    day: 'DAY 1',
    color: 'bg-violet-400',
    points: [
      { time: '10:00', label: '집결 및 이동' },
      { time: '13:00', label: '오프닝 & 아이스브레이킹' },
      { time: '18:00', label: '저녁 식사 & 바베큐' },
    ],
  },
  {
    day: 'DAY 2',
    color: 'bg-emerald-400',
    points: [
      { time: '08:00', label: '조식' },
      { time: '09:30', label: '워크숍 세션' },
      { time: '12:00', label: '이동 및 해산' },
    ],
  },
]

function Step3RightPanel() {
  return (
    <>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1 font-semibold text-slate-800">
          <SparkleIcon className="h-4 w-4 text-violet-500" />
          AI 일정 추천 포인트
        </h2>
        <ul className="flex flex-col gap-2 text-xs text-slate-600">
          {recommendationPoints.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">
                ✓
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">일정 한눈에 보기</h2>
        <ul className="flex flex-col gap-2.5 text-xs">
          {scheduleOverview.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <span className="w-16 flex-shrink-0 text-slate-400">{label}</span>
              <span className="font-medium text-slate-700">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-800">
          일정 미리보기 <span className="text-xs font-normal text-slate-400">(간단 타임라인)</span>
        </h2>
        <div className="flex flex-col gap-5">
          {timeline.map(({ day, color, points }) => (
            <div key={day}>
              <p className="mb-2 text-xs font-semibold text-slate-500">{day}</p>
              <div className="flex items-start justify-between">
                {points.map(({ time, label }) => (
                  <div key={time} className="flex flex-1 flex-col items-center gap-1 text-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    <span className="text-xs font-medium text-slate-700">{time}</span>
                    <span className="text-[11px] leading-tight text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl">
          🤖
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">더 다양한 일정이 궁금하다면?</p>
          <p className="mb-2 text-xs text-slate-500">AI에게 원하는 스타일을 알려주세요!</p>
          <button
            type="button"
            className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white"
          >
            AI에게 요청하기
          </button>
        </div>
      </div>
    </>
  )
}

export default Step3RightPanel
