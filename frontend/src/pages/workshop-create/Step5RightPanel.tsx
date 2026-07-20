import { useEffect, useState } from 'react'
import { CalendarIcon, ChatIcon, MailIcon, SmsIcon } from '@/components/icons'
import { listNotifications, type NotificationResponse, type Venue, type WorkshopResponse } from '@/api/workshop'
import SelectedWorkshopSummary from './SelectedWorkshopSummary'

const sendMethods = [
  { id: 'email', label: '이메일', description: '이메일로 안내 메시지를 발송합니다.', icon: MailIcon },
  { id: 'messenger', label: '라온 메신저', description: '라온 메신저로 알림을 발송합니다.', icon: ChatIcon },
  { id: 'sms', label: '문자 메시지', description: 'SMS로 간단한 안내를 발송합니다.', icon: SmsIcon },
  { id: 'calendar', label: '캘린더 초대', description: '일정을 캘린더에 자동으로 추가합니다.', icon: CalendarIcon },
]

const channelLabel: Record<string, string> = {
  SLACK: '라온 메신저',
  EMAIL: '이메일',
}

function Step5RightPanel({
  workshop,
  venue,
  onEditWorkshop,
  refreshKey,
}: {
  workshop: WorkshopResponse
  venue?: Venue
  onEditWorkshop: () => void
  refreshKey: number
}) {
  const [selectedMethod, setSelectedMethod] = useState('messenger')
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    let cancelled = false

    listNotifications(workshop.id)
      .then((list) => {
        if (!cancelled) setNotifications(list)
      })
      .catch(() => {
        // 발송 내역을 못 불러와도 화면 전체를 막지 않는다.
      })
      .finally(() => {
        if (!cancelled) setIsLoadingHistory(false)
      })

    return () => {
      cancelled = true
    }
  }, [workshop.id, refreshKey])

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
        <h2 className="mb-3 font-semibold text-slate-800">발송 내역</h2>
        {isLoadingHistory ? (
          <p className="text-xs text-slate-400">불러오는 중...</p>
        ) : notifications.length === 0 ? (
          <p className="text-xs text-slate-400">아직 발송한 알림이 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-2.5 text-xs">
            {notifications.map((notification) => (
              <li key={notification.id} className="flex flex-col gap-0.5 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">
                    {channelLabel[notification.channel] ?? notification.channel}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      notification.status === 'SENT' || notification.status === 'SUCCESS'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {notification.status}
                  </span>
                </div>
                <p className="truncate text-slate-400">{notification.message}</p>
                <p className="text-[10px] text-slate-300">
                  {new Date(notification.sentAt).toLocaleString('ko-KR')} ·{' '}
                  {notification.recipientCount}명
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1 font-semibold text-slate-800">
          <span className="text-violet-500">✨</span>
          AI 어시스턴트의 한 마디
        </h2>
        <p className="text-xs leading-relaxed text-slate-500">
          알림 발송까지 완료하면 워크숍 준비가 모두 끝나요! 이제 즐거운 워크숍만 남았어요. 🎉
        </p>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-full bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          워크숍 체크리스트 보기
        </button>
      </div>
    </>
  )
}

export default Step5RightPanel
