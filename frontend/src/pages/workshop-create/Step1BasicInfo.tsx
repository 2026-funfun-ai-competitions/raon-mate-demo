import { useState } from 'react'
import { CalendarIcon, ChevronRightIcon, PeopleIcon } from '@/components/icons'

function Step1BasicInfo({ onNext }: { onNext: () => void }) {
  const [keyword, setKeyword] = useState('팀 빌딩, 소통 강화, 하반기 목표 공유')

  return (
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
        onClick={onNext}
        className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
      >
        다음 단계로
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Step1BasicInfo
