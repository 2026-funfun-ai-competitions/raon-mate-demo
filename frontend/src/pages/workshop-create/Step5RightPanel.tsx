import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarIcon, ChatIcon, MailIcon, SmsIcon } from '@/components/icons'
import { type Venue, type WorkshopResponse } from '@/api/workshop'
import SelectedWorkshopSummary from './SelectedWorkshopSummary'

const sendMethods = [
  { id: 'email', label: '이메일', description: '이메일로 안내 메시지를 발송합니다.', icon: MailIcon },
  { id: 'messenger', label: '라온 메신저', description: '라온 메신저로 알림을 발송합니다.', icon: ChatIcon },
  { id: 'sms', label: '문자 메시지', description: 'SMS로 간단한 안내를 발송합니다.', icon: SmsIcon },
  { id: 'calendar', label: '캘린더 초대', description: '일정을 캘린더에 자동으로 추가합니다.', icon: CalendarIcon },
]

function Step5RightPanel({
  workshop,
  venue,
  onEditWorkshop,
}: {
  workshop: WorkshopResponse
  venue?: Venue
  onEditWorkshop: () => void
}) {
  const [selectedMethod, setSelectedMethod] = useState('messenger')

  return (
    <>
      <SelectedWorkshopSummary workshop={workshop} venue={venue} onEdit={onEditWorkshop} />

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">발송 방법</h2>
        <div className="grid grid-cols-2 gap-2">
          {sendMethods.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedMethod(id)}
              className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left ${
                selectedMethod === id
                  ? 'border-violet-300 bg-violet-50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${selectedMethod === id ? 'text-violet-600' : 'text-slate-400'}`}
              />
              <span
                className={`text-xs font-semibold ${
                  selectedMethod === id ? 'text-violet-700' : 'text-slate-700'
                }`}
              >
                {label}
              </span>
              <span className="text-[11px] leading-tight text-slate-400">{description}</span>
            </button>
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <input type="checkbox" className="h-4 w-4 accent-violet-600" />
          발송 결과를 이메일로 받기
        </label>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1 font-semibold text-slate-800">
          <span className="text-violet-500">✨</span>
          AI 어시스턴트의 한 마디
        </h2>
        <p className="text-xs leading-relaxed text-slate-500">
          알림 발송까지 완료하면 워크숍 준비가 모두 끝나요! 이제 즐거운 워크숍만 남았어요. 🎉
        </p>
        <Link
          to={`/workshops/${workshop.id}/checklist`}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-full bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          워크숍 체크리스트 보기
        </Link>
      </div>
    </>
  )
}

export default Step5RightPanel
