import { ChevronRightIcon, CheckCircleIcon, SparkleIcon } from '@/components/icons'

const progressStatus = [
  { label: '기본 정보 입력', status: '진행 중' },
  { label: '장소 추천', status: '대기' },
  { label: '일정 계획', status: '대기' },
  { label: '예산 관리', status: '대기' },
  { label: '알림 발송', status: '대기' },
]

const aiSummary = [
  '지역: 가평, 양평, 용인, 홍천 등',
  '숙소: 리조트, 팬션, 연수원',
  '액티비티: 레크레이션, 팀빌딩 프로그램',
  '최적 일정: 1박 2일',
  '예상 예산: 총 3,750,000원 (25명 기준)',
]

const workshopHistory = [
  { title: '2024 기술본부 워크숍', period: '24.10.18 ~ 10.19 · 가평 캔싱턴리조트' },
  { title: '2024 상반기 목표 워크숍', period: '24.04.12 ~ 04.13 · 용인 더스위트호텔' },
]

function Step1RightPanel() {
  return (
    <>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-800">워크숍 진행 현황</h2>
        <ul className="flex flex-col gap-3">
          {progressStatus.map(({ label, status }) => (
            <li key={label} className="flex items-center justify-between text-sm">
              <span
                className={status === '진행 중' ? 'font-medium text-violet-700' : 'text-slate-500'}
              >
                {label}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  status === '진행 중'
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1 font-semibold text-slate-800">
          <SparkleIcon className="h-4 w-4 text-violet-500" />
          AI 추천 요약
        </h2>
        <ul className="flex flex-col gap-1.5 text-xs text-slate-500">
          {aiSummary.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-full bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          추천 결과 미리보기
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">최근 워크숍 히스토리</h2>
          <button type="button" className="text-xs text-slate-400 hover:text-slate-600">
            전체 보기
          </button>
        </div>
        <ul className="flex flex-col gap-3">
          {workshopHistory.map(({ title, period }) => (
            <li key={title} className="flex items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-medium text-slate-700">{title}</p>
                <p className="text-slate-400">{period}</p>
              </div>
              <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">
                <CheckCircleIcon className="h-3 w-3" />
                완료
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl">
          🤖
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">도움이 필요하신가요?</p>
          <p className="mb-2 text-xs text-slate-500">
            워크숍 준비에 어려움이 있다면 라온 메이트에게 물어보세요!
          </p>
          <button
            type="button"
            className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white"
          >
            AI에게 질문하기
          </button>
        </div>
      </div>
    </>
  )
}

export default Step1RightPanel
