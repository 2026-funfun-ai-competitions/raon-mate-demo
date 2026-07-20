import { useState } from 'react'
import {
  ArrowLeftIcon,
  BedIcon,
  BusIcon,
  ChecklistIcon,
  ChevronRightIcon,
  DiningIcon,
  PencilIcon,
  PeopleIcon,
  RefreshIcon,
  SparkleIcon,
  StarIcon,
} from '@/components/icons'

const categoryStyles: Record<string, string> = {
  이동: 'bg-blue-50 text-blue-600',
  식사: 'bg-amber-50 text-amber-600',
  세션: 'bg-violet-50 text-violet-600',
  액티비티: 'bg-emerald-50 text-emerald-600',
  자유: 'bg-yellow-50 text-yellow-700',
  휴식: 'bg-slate-100 text-slate-500',
}

const days = [
  {
    day: 'DAY 1',
    date: '09.09 (화)',
    items: [
      {
        time: '10:00 ~ 11:30',
        icon: BusIcon,
        title: '집결 및 이동',
        description: '회사 출발 → 가평 펜션 리조트 이동',
        category: '이동',
      },
      {
        time: '11:30 ~ 12:30',
        icon: DiningIcon,
        title: '점심 식사',
        description: '맛있는 점심 식사',
        category: '식사',
      },
      {
        time: '13:00 ~ 14:30',
        icon: PeopleIcon,
        title: '오프닝 & 아이스브레이킹',
        description: '팀 소개 및 워크숍 목표 공유',
        category: '세션',
      },
      {
        time: '14:30 ~ 17:30',
        icon: PeopleIcon,
        title: '팀빌딩 프로그램',
        description: '소통 강화 프로그램 진행',
        category: '액티비티',
      },
      {
        time: '18:00 ~ 19:30',
        icon: DiningIcon,
        title: '저녁 식사 & 바베큐',
        description: '바베큐 파티',
        category: '식사',
      },
      {
        time: '19:30 ~ 21:00',
        icon: StarIcon,
        title: '자유 시간',
        description: '자유로운 네트워킹 시간',
        category: '자유',
      },
      {
        time: '21:00 ~',
        icon: BedIcon,
        title: '휴식',
        description: '편안한 휴식 시간',
        category: '휴식',
      },
    ],
  },
  {
    day: 'DAY 2',
    date: '09.10 (수)',
    items: [
      {
        time: '08:00 ~ 09:00',
        icon: DiningIcon,
        title: '조식',
        description: '아침 식사',
        category: '식사',
      },
      {
        time: '09:30 ~ 11:00',
        icon: PeopleIcon,
        title: '워크숍 세션',
        description: '하반기 목표 및 계획 수립',
        category: '세션',
      },
      {
        time: '11:00 ~ 12:00',
        icon: ChecklistIcon,
        title: '정리 및 마무리',
        description: '결과 공유 및 마무리',
        category: '세션',
      },
      {
        time: '12:00 ~',
        icon: BusIcon,
        title: '이동 및 해산',
        description: '회사로 이동',
        category: '이동',
      },
    ],
  },
]

function Step3SchedulePlan({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [scheduleType, setScheduleType] = useState<'overnight' | 'oneday'>('overnight')

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-800">3. 일정을 계획해보세요</h2>
          <p className="mt-1 text-xs text-slate-500">
            선택한 장소에 맞춰 AI가 최적의 일정을 제안드려요.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshIcon className="h-3.5 w-3.5" />
            다른 일정 보기
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            직접 수정하기
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl">
          🏞️
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">가평 펜션 리조트</h3>
            <span className="flex items-center gap-0.5 text-xs text-amber-500">
              <StarIcon className="h-3.5 w-3.5" />
              4.8 (128)
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['세미나실 포함', '바베큐', '레크레이션 가능'].map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-6 text-xs text-slate-500">
          <div>
            <p className="text-slate-400">진행 일정</p>
            <p className="mt-0.5 font-medium text-slate-700">2025.09.09 (화) ~ 09.10 (수)</p>
          </div>
          <div>
            <p className="text-slate-400">참석 인원</p>
            <p className="mt-0.5 font-medium text-slate-700">25명</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setScheduleType('overnight')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            scheduleType === 'overnight'
              ? 'bg-violet-100 text-violet-700'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          1박 2일 일정
        </button>
        <button
          type="button"
          onClick={() => setScheduleType('oneday')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            scheduleType === 'oneday'
              ? 'bg-violet-100 text-violet-700'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          당일 일정
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {days.map(({ day, date, items }) => (
          <div key={day} className="overflow-hidden rounded-xl border border-slate-100">
            <div className="flex">
              <div className="flex w-20 flex-shrink-0 flex-col items-center justify-center bg-violet-50 px-2 py-4 text-center">
                <span className="text-sm font-bold text-violet-700">{day}</span>
                <span className="text-xs text-violet-500">{date}</span>
              </div>
              <ul className="flex-1 divide-y divide-slate-100">
                {items.map(({ time, icon: Icon, title, description, category }) => (
                  <li key={time + title} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="w-28 flex-shrink-0 text-xs text-slate-400">{time}</span>
                    <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <span className="w-44 flex-shrink-0 font-medium text-slate-800">{title}</span>
                    <span className="flex-1 text-xs text-slate-500">{description}</span>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${categoryStyles[category]}`}
                    >
                      {category}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700">
        <SparkleIcon className="h-4 w-4 flex-shrink-0" />
        AI가 추천한 일정이에요! 필요에 따라 수정하거나 다른 일정을 확인해보세요.
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

export default Step3SchedulePlan
