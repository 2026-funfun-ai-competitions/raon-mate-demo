import { useState } from 'react'
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CompassIcon,
  PeopleIcon,
  SparkleIcon,
} from '@/components/icons'

const steps = ['기본 정보 입력', '장소 추천', '일정 계획', '예산 관리', '알림 발송']

const themeIdeas = [
  {
    emoji: '🏕️',
    title: '자연 속 힐링 워크숍',
    description: '자연에서 재충전하며 팀워크를 높여요',
    tags: ['힐링', '소통'],
  },
  {
    emoji: '🚣',
    title: '액티비티 워크숍',
    description: '다양한 액티비티로 협업과 유대감을!',
    tags: ['액티비티', '협업'],
  },
  {
    emoji: '💡',
    title: '인사이트 워크숍',
    description: '전문 강연과 워크샵으로 인사이트를 얻어요',
    tags: ['강연', '성장'],
  },
  {
    emoji: '🏙️',
    title: '도심형 워크숍',
    description: '도심 속 편리한 워크숍을 원한다면',
    tags: ['접근성', '효율'],
  },
]

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

function WorkshopCreatePage() {
  const [keyword, setKeyword] = useState('팀 빌딩, 소통 강화, 하반기 목표 공유')

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <CompassIcon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">워크숍 플래너</h1>
            <p className="text-sm text-slate-500">워크숍 진행 전 과정을 라온 메이트가 도와드려요.</p>
          </div>
        </div>

        <div className="flex items-start rounded-2xl bg-white px-8 py-6 shadow-sm">
          {steps.map((label, index) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-2 last:flex-none">
              <div className="flex w-full items-center">
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    index === 0
                      ? 'bg-violet-600 text-white'
                      : 'border border-slate-300 text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>
                {index < steps.length - 1 && <span className="h-px flex-1 bg-slate-200" />}
              </div>
              <span
                className={`text-xs font-medium ${index === 0 ? 'text-violet-700' : 'text-slate-400'}`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">1. 기본 정보를 입력해주세요</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              워크숍 제목
              <input
                type="text"
                defaultValue="2025 라온 보안 기술본부 워크숍"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              참석 인원
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <PeopleIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <input
                  type="number"
                  defaultValue={25}
                  className="w-full text-sm text-slate-800 outline-none"
                />
                <span className="flex-shrink-0 text-sm text-slate-400">명</span>
              </div>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              예산 (1인 기준)
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <span className="flex-shrink-0 text-sm font-semibold text-slate-400">₩</span>
                <input
                  type="number"
                  defaultValue={150000}
                  className="w-full text-sm text-slate-800 outline-none"
                />
                <span className="flex-shrink-0 text-sm text-slate-400">원</span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              진행 방식
              <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800">
                <option>숙박형 (1박 2일)</option>
                <option>당일형</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              희망 지역
              <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800">
                <option>서울 근교</option>
                <option>강원도</option>
                <option>제주도</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              희망 일정
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <CalendarIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <input
                  type="text"
                  defaultValue="2025.09. ~ 2025.10."
                  className="w-full text-sm text-slate-800 outline-none"
                />
              </div>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-slate-600">
            워크숍 목적 / 키워드 (선택)
            <div className="relative">
              <input
                type="text"
                value={keyword}
                maxLength={100}
                onChange={(event) => setKeyword(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-14 text-sm text-slate-800"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                {keyword.length}/100
              </span>
            </div>
          </label>

          <button
            type="button"
            className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
          >
            다음 단계로
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">이런 워크숍은 어때요?</h2>
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
            >
              더 많은 테마 보기
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {themeIdeas.map(({ emoji, title, description, tags }) => (
              <div key={title} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-24 items-center justify-center rounded-xl bg-slate-100 text-4xl">
                  {emoji}
                </div>
                <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{description}</p>
                <div className="flex gap-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm">
          <span className="text-sm text-slate-600">
            <span className="mr-2 rounded bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-600">
              TIP
            </span>
            워크숍 성공을 위한 체크리스트를 확인해보세요!
          </span>
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
          >
            체크리스트 보기
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
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
      </div>
    </div>
  )
}

export default WorkshopCreatePage
