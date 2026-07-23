import { useState } from 'react'
import { updateWorkshop, type WorkshopResponse, type WorkshopType } from '@/api/workshop'
import { getEndDate, PREFERRED_REGIONS } from './workshopFormOptions'

function WorkshopEditModal({
  workshop,
  onClose,
  onSaved,
}: {
  workshop: WorkshopResponse
  onClose: () => void
  onSaved: (workshop: WorkshopResponse) => void
}) {
  const [title, setTitle] = useState(workshop.title)
  const [expectedParticipants, setExpectedParticipants] = useState(workshop.expectedParticipants)
  const [budgetPerPerson, setBudgetPerPerson] = useState(workshop.budgetPerPerson)
  const [workshopType, setWorkshopType] = useState<WorkshopType>(workshop.workshopType)
  const [preferredRegion, setPreferredRegion] = useState(workshop.preferredRegion)
  const [preferredStartDate, setPreferredStartDate] = useState(workshop.preferredStartDate)
  const [preferredEndDate, setPreferredEndDate] = useState(workshop.preferredEndDate)
  const [purposeKeywords, setPurposeKeywords] = useState(workshop.purposeKeywords)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setIsSaving(true)
    setError(null)
    try {
      const updated = await updateWorkshop(workshop.id, {
        title,
        preferredRegion,
        expectedParticipants,
        budgetPerPerson,
        workshopType,
        preferredStartDate,
        preferredEndDate,
        purposeKeywords,
      })
      onSaved(updated)
      onClose()
    } catch {
      setError('저장에 실패했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="font-semibold text-slate-800">워크숍 조건 수정</h2>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          워크숍 제목
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            참석 인원
            <input
              type="number"
              value={expectedParticipants}
              onChange={(event) => setExpectedParticipants(Number(event.target.value))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            1인 예산 (원)
            <input
              type="number"
              value={budgetPerPerson}
              onChange={(event) => setBudgetPerPerson(Number(event.target.value))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            진행 방식
            <select
              value={workshopType}
              onChange={(event) => {
                const nextWorkshopType = event.target.value as WorkshopType
                setWorkshopType(nextWorkshopType)
                setPreferredEndDate(getEndDate(preferredStartDate, nextWorkshopType))
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            >
              <option value="OVERNIGHT">숙박형 (1박 2일)</option>
              <option value="DAY_TRIP">당일형</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            희망 지역
            <select
              value={preferredRegion}
              onChange={(event) => setPreferredRegion(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            >
              {PREFERRED_REGIONS.map((region) => (
                <option key={region}>{region}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            시작일
            <input
              type="date"
              value={preferredStartDate}
              onChange={(event) => {
                const nextStartDate = event.target.value
                setPreferredStartDate(nextStartDate)
                setPreferredEndDate(getEndDate(nextStartDate, workshopType))
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            종료일
            <input
              type="date"
              value={preferredEndDate}
              min={preferredStartDate}
              onChange={(event) => setPreferredEndDate(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          워크숍 목적 / 키워드
          <input
            type="text"
            value={purposeKeywords}
            maxLength={100}
            onChange={(event) => setPurposeKeywords(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
          />
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkshopEditModal
