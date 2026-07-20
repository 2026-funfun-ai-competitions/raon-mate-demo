import { useState } from 'react'
import { CalendarIcon, ChevronRightIcon, PeopleIcon } from '@/components/icons'
import { createWorkshop, type WorkshopResponse, type WorkshopType } from '@/api/workshop'

type FieldErrors = Partial<
  Record<
    | 'title'
    | 'expectedParticipants'
    | 'budgetPerPerson'
    | 'workshopType'
    | 'preferredRegion'
    | 'preferredStartDate'
    | 'preferredEndDate',
    string
  >
>

function inputClass(hasError: boolean) {
  return `rounded-lg border px-3 py-2 text-sm text-slate-800 ${
    hasError ? 'border-red-300' : 'border-slate-200'
  }`
}

function formatNumber(value: number | '') {
  return value === '' ? '' : value.toLocaleString()
}

function parseNumberInput(raw: string): number | '' {
  const digitsOnly = raw.replace(/[^0-9]/g, '')
  return digitsOnly === '' ? '' : Number(digitsOnly)
}

function Step1BasicInfo({ onNext }: { onNext: (workshop: WorkshopResponse) => void }) {
  const [title, setTitle] = useState('')
  const [expectedParticipants, setExpectedParticipants] = useState<number | ''>('')
  const [budgetPerPerson, setBudgetPerPerson] = useState<number | ''>('')
  const [workshopType, setWorkshopType] = useState<WorkshopType | ''>('')
  const [preferredRegion, setPreferredRegion] = useState('')
  const [preferredStartDate, setPreferredStartDate] = useState('')
  const [preferredEndDate, setPreferredEndDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {}

    if (!title.trim()) {
      errors.title = '워크숍 제목을 입력해주세요.'
    } else if (title.length > 100) {
      errors.title = '워크숍 제목은 100자 이내로 입력해주세요.'
    }

    if (expectedParticipants === '') {
      errors.expectedParticipants = '참석 인원을 입력해주세요.'
    } else if (expectedParticipants < 2 || expectedParticipants > 500) {
      errors.expectedParticipants = '참석 인원은 2명 이상 500명 이하로 입력해주세요.'
    }

    if (budgetPerPerson === '') {
      errors.budgetPerPerson = '1인 예산을 입력해주세요.'
    } else if (budgetPerPerson < 0) {
      errors.budgetPerPerson = '예산은 0원 이상이어야 해요.'
    }

    if (!workshopType) {
      errors.workshopType = '진행 방식을 선택해주세요.'
    }

    if (!preferredRegion) {
      errors.preferredRegion = '희망 지역을 선택해주세요.'
    }

    if (!preferredStartDate) {
      errors.preferredStartDate = '희망 일정을 선택해주세요.'
    } else if (!preferredEndDate) {
      errors.preferredEndDate = '희망 일정의 종료일을 선택해주세요.'
    } else if (preferredEndDate < preferredStartDate) {
      errors.preferredEndDate = '종료일은 시작일보다 빠를 수 없어요.'
    }

    return errors
  }

  async function handleNext() {
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError('입력하신 내용을 다시 확인해주세요.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const workshop = await createWorkshop({
        title,
        preferredRegion,
        expectedParticipants: expectedParticipants === '' ? undefined : expectedParticipants,
        budgetPerPerson: budgetPerPerson === '' ? undefined : budgetPerPerson,
        workshopType: workshopType === '' ? undefined : workshopType,
        preferredStartDate,
        preferredEndDate,
        purposeKeywords: keyword,
      })
      onNext(workshop)
    } catch {
      setError('워크숍 생성에 실패했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-800">1. 기본 정보를 입력해주세요</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          워크숍 제목
          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              clearFieldError('title')
            }}
            placeholder="예: 2025 하반기 팀 워크숍"
            className={inputClass(Boolean(fieldErrors.title))}
          />
          {fieldErrors.title && <span className="text-xs text-red-500">{fieldErrors.title}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          참석 인원
          <div className={`flex items-center gap-2 ${inputClass(Boolean(fieldErrors.expectedParticipants))}`}>
            <PeopleIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
            <input
              type="number"
              value={expectedParticipants}
              onChange={(event) => {
                setExpectedParticipants(event.target.value === '' ? '' : Number(event.target.value))
                clearFieldError('expectedParticipants')
              }}
              placeholder="0"
              className="w-full text-sm text-slate-800 outline-none"
            />
            <span className="flex-shrink-0 text-sm text-slate-400">명</span>
          </div>
          {fieldErrors.expectedParticipants && (
            <span className="text-xs text-red-500">{fieldErrors.expectedParticipants}</span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          예산 (1인 기준)
          <div className={`flex items-center gap-2 ${inputClass(Boolean(fieldErrors.budgetPerPerson))}`}>
            <span className="flex-shrink-0 text-sm font-semibold text-slate-400">₩</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumber(budgetPerPerson)}
              onChange={(event) => {
                setBudgetPerPerson(parseNumberInput(event.target.value))
                clearFieldError('budgetPerPerson')
              }}
              placeholder="0"
              className="w-full text-sm text-slate-800 outline-none"
            />
            <span className="flex-shrink-0 text-sm text-slate-400">원</span>
          </div>
          {fieldErrors.budgetPerPerson && (
            <span className="text-xs text-red-500">{fieldErrors.budgetPerPerson}</span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          진행 방식
          <select
            value={workshopType}
            onChange={(event) => {
              setWorkshopType(event.target.value as WorkshopType | '')
              clearFieldError('workshopType')
            }}
            className={inputClass(Boolean(fieldErrors.workshopType))}
          >
            <option value="">선택해주세요</option>
            <option value="OVERNIGHT">숙박형 (1박 2일)</option>
            <option value="DAY_TRIP">당일형</option>
          </select>
          {fieldErrors.workshopType && (
            <span className="text-xs text-red-500">{fieldErrors.workshopType}</span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          희망 지역
          <select
            value={preferredRegion}
            onChange={(event) => {
              setPreferredRegion(event.target.value)
              clearFieldError('preferredRegion')
            }}
            className={inputClass(Boolean(fieldErrors.preferredRegion))}
          >
            <option value="">선택해주세요</option>
            <option>서울 근교</option>
            <option>강원도</option>
            <option>제주도</option>
          </select>
          {fieldErrors.preferredRegion && (
            <span className="text-xs text-red-500">{fieldErrors.preferredRegion}</span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          희망 일정
          <div
            className={`flex items-center gap-1 ${inputClass(
              Boolean(fieldErrors.preferredStartDate || fieldErrors.preferredEndDate),
            )} px-2`}
          >
            <CalendarIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
            <input
              type="date"
              value={preferredStartDate}
              onChange={(event) => {
                setPreferredStartDate(event.target.value)
                clearFieldError('preferredStartDate')
                clearFieldError('preferredEndDate')
              }}
              className="w-full text-xs text-slate-800 outline-none"
            />
            <span className="text-slate-300">~</span>
            <input
              type="date"
              value={preferredEndDate}
              onChange={(event) => {
                setPreferredEndDate(event.target.value)
                clearFieldError('preferredEndDate')
              }}
              className="w-full text-xs text-slate-800 outline-none"
            />
          </div>
          {(fieldErrors.preferredStartDate || fieldErrors.preferredEndDate) && (
            <span className="text-xs text-red-500">
              {fieldErrors.preferredStartDate || fieldErrors.preferredEndDate}
            </span>
          )}
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
            placeholder="예: 팀 빌딩, 소통 강화"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-14 text-sm text-slate-800"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {keyword.length}/100
          </span>
        </div>
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleNext}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
      >
        {isSubmitting ? '생성 중...' : '다음 단계로'}
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Step1BasicInfo
