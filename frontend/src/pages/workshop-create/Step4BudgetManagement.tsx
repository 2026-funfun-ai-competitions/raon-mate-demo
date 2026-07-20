import { useState } from 'react'
import {
  ActivityIcon,
  ArrowLeftIcon,
  BedIcon,
  BusIcon,
  ChevronRightIcon,
  DiningIcon,
  DownloadIcon,
  RoomIcon,
  SparkleIcon,
  StarIcon,
} from '@/components/icons'
import CircularProgress from './CircularProgress'

const budgetItems = [
  {
    icon: BedIcon,
    label: '숙박',
    detail: '가평 펜션 리조트 1박 (2~4인 1실)',
    perPerson: '55,000원',
    total: '1,375,000원',
    percent: 38,
  },
  {
    icon: DiningIcon,
    label: '식사',
    detail: '3식 (첫날 중식 ~ 둘째날 중식)',
    perPerson: '28,000원',
    total: '700,000원',
    percent: 20,
  },
  {
    icon: BusIcon,
    label: '교통',
    detail: '대형버스 왕복',
    perPerson: '12,000원',
    total: '300,000원',
    percent: 8,
  },
  {
    icon: ActivityIcon,
    label: '액티비티',
    detail: '팀빌딩 & 레크레이션 프로그램',
    perPerson: '25,000원',
    total: '625,000원',
    percent: 17,
  },
  {
    icon: RoomIcon,
    label: '회의실 대관',
    detail: '세미나실 1일 이용',
    perPerson: '10,000원',
    total: '250,000원',
    percent: 7,
  },
  {
    icon: StarIcon,
    label: '기타',
    detail: '기념품, 현수막, 운영비 등',
    perPerson: '13,200원',
    total: '330,000원',
    percent: 10,
  },
]

function Step4BudgetManagement({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [tab, setTab] = useState<'byItem' | 'detail'>('byItem')

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-800">4. 예산을 확인하고 관리해보세요</h2>
          <p className="mt-1 text-xs text-slate-500">
            AI가 추천한 일정과 장소 기준으로 예산을 산출했어요.
          </p>
        </div>
        <button
          type="button"
          className="flex flex-shrink-0 items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          엑셀 다운로드
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-100 p-4">
          <p className="text-xs text-slate-400">총 예산 (1인 기준)</p>
          <p className="mt-1 font-semibold text-slate-800">150,000원</p>
          <p className="text-xs text-slate-400">(총 3,750,000원)</p>
        </div>
        <div className="rounded-xl border border-slate-100 p-4">
          <p className="text-xs text-slate-400">예상 지출 합계</p>
          <p className="mt-1 font-semibold text-slate-800">3,580,000원</p>
          <p className="text-xs text-slate-400">(1인 143,200원)</p>
        </div>
        <div className="rounded-xl border border-slate-100 p-4">
          <p className="text-xs text-slate-400">예산 대비</p>
          <p className="mt-1 font-semibold text-emerald-600">169,000원 남음</p>
          <p className="text-xs text-slate-400">(1인 6,800원)</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
          <CircularProgress percent={95} />
          <p className="text-xs text-slate-400">예산 사용률</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('byItem')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === 'byItem' ? 'bg-violet-100 text-violet-700' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          항목별 예산
        </button>
        <button
          type="button"
          onClick={() => setTab('detail')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === 'detail' ? 'bg-violet-100 text-violet-700' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          상세 항목 보기
        </button>
      </div>

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
            {budgetItems.map(({ icon: Icon, label, detail, perPerson, total, percent }) => (
              <tr key={label}>
                <td className="flex items-center gap-2 px-4 py-3 font-medium text-slate-700">
                  <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  {label}
                </td>
                <td className="px-4 py-3 text-slate-500">{detail}</td>
                <td className="px-4 py-3 text-slate-700">{perPerson}</td>
                <td className="px-4 py-3 text-slate-700">{total}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{percent}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-100 font-semibold text-slate-800">
              <td className="px-4 py-3" colSpan={2}>
                합계
              </td>
              <td className="px-4 py-3">143,200원</td>
              <td className="px-4 py-3">3,580,000원</td>
              <td className="px-4 py-3">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700">
        <SparkleIcon className="h-4 w-4 flex-shrink-0" />
        AI 분석 결과, 예산 내에서 여유가 있어요! 액티비티 업그레이드나 기념품 추가를 고려해보세요.
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
          className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
        >
          다음 단계로
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Step4BudgetManagement
