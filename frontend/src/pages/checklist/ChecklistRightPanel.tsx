import { AlertIcon, DownloadIcon, LightbulbIcon, ShareIcon } from '@/components/icons'
import CircularProgress from '../workshop-create/CircularProgress'
import {
  doneChecklistCount,
  incompleteChecklistItems,
  totalChecklistCount,
} from './checklistData'

const readinessPercent = Math.round((doneChecklistCount / totalChecklistCount) * 100)

const downloadOptions = [
  { label: '체크리스트 PDF 다운로드', icon: DownloadIcon },
  { label: '엑셀 파일 다운로드', icon: DownloadIcon },
  { label: '체크리스트 공유하기', icon: ShareIcon },
]

function ChecklistRightPanel() {
  return (
    <>
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-sm">
        <h2 className="self-start font-semibold text-slate-800">AI 준비도 분석</h2>
        <CircularProgress
          percent={readinessPercent}
          size={140}
          strokeWidth={10}
          labelClassName="text-2xl font-bold text-violet-700"
        />
        <p className="font-semibold text-emerald-600">아주 좋아요! 🎉</p>
        <p className="text-xs text-slate-500">조금만 더 확인하면 완벽해요.</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1 font-semibold text-slate-800">
          <AlertIcon className="h-4 w-4 text-amber-500" />
          AI가 발견한 누락 항목 ({incompleteChecklistItems.length})
        </h2>
        <ul className="flex flex-col gap-1.5 text-xs text-slate-600">
          {incompleteChecklistItems.map((label) => (
            <li key={label}>• {label}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 flex items-center gap-1 font-semibold text-slate-800">
          <LightbulbIcon className="h-4 w-4 text-amber-500" />
          AI 추천
        </h2>
        <p className="text-xs leading-relaxed text-slate-500">
          참석자가 많으므로 객실 배정을 미리 완료하는 것을 추천해요. 숙소 측에 요청하면 더 좋은
          배정을 받을 수 있어요.
        </p>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          객실 배정 바로가기
        </button>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">다운로드 &amp; 공유</h2>
        <ul className="flex flex-col gap-1">
          {downloadOptions.map(({ label, icon: Icon }) => (
            <li key={label}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default ChecklistRightPanel
