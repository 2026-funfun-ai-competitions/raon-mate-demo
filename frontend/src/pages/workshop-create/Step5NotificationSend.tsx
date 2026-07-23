import { useState } from 'react'
import { ArrowLeftIcon, EyeIcon, PaperclipIcon, PeopleIcon, SendIcon } from '@/components/icons'
import { sendNotification, type ScheduleItem, type Venue, type WorkshopResponse } from '@/api/workshop'

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y}년 ${Number(m)}월 ${Number(d)}일`
}

function buildDefaultMessage(
  workshop: WorkshopResponse,
  selectedVenues: Venue[],
  schedule: ScheduleItem[],
): string {
  const dateRange =
    workshop.preferredStartDate === workshop.preferredEndDate
      ? formatDate(workshop.preferredStartDate)
      : `${formatDate(workshop.preferredStartDate)} ~ ${formatDate(workshop.preferredEndDate)}`

  const venueText =
    selectedVenues.length > 0
      ? selectedVenues.map((v) => v.name).join(', ')
      : '미정'

  const budgetText = workshop.budgetPerPerson
    ? `${workshop.budgetPerPerson.toLocaleString()}원`
    : '미정'

  let scheduleText = ''
  if (schedule.length > 0) {
    const byDate = new Map<string, ScheduleItem[]>()
    for (const item of schedule) {
      const list = byDate.get(item.date) ?? []
      list.push(item)
      byDate.set(item.date, list)
    }
    const lines: string[] = []
    for (const [date, items] of byDate) {
      lines.push(`\n  [${formatDate(date)}]`)
      for (const item of items) {
        const time = item.endTime ? `${item.startTime}~${item.endTime}` : item.startTime
        lines.push(`  • ${time} ${item.title}`)
      }
    }
    scheduleText = lines.join('\n')
  }

  return `안녕하세요, 라온인 여러분!

다가오는 워크숍 일정을 안내드립니다.
함께 소통하고 성장하는 의미있는 시간이 되길 기대합니다! 😊

📅 일정: ${dateRange}
📍 장소: ${venueText}
👥 참석 인원: ${workshop.expectedParticipants}명
💰 1인 예산: ${budgetText}
🎯 워크숍 목적: ${workshop.purposeKeywords}
${scheduleText ? `\n📋 세부 일정:${scheduleText}` : ''}
자세한 내용은 아래 버튼을 통해 확인해주세요.

감사합니다.`
}

const extraRecipientGroups = [
  { label: '운영진', count: 3, checked: false },
  { label: '참관자', count: 2, checked: false },
  { label: '예비 참석자', count: 0, checked: false },
]

function Step5NotificationSend({
  workshopId,
  workshop,
  selectedVenues,
  schedule,
  onBack,
  onSent,
}: {
  workshopId: string
  workshop: WorkshopResponse
  selectedVenues: Venue[]
  schedule: ScheduleItem[]
  onBack: () => void
  onSent: () => void
}) {
  const [message, setMessage] = useState(() => buildDefaultMessage(workshop, selectedVenues, schedule))
  const [sendTiming, setSendTiming] = useState<'now' | 'scheduled'>('now')
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; message: string } | null>(null)

  async function handleSend() {
    if (!message.trim()) {
      setSendResult({ ok: false, message: '알림 메시지를 입력해주세요.' })
      return
    }
    if (workshop.expectedParticipants < 1) {
      setSendResult({ ok: false, message: '수신할 참석 인원이 없어요.' })
      return
    }

    setIsSending(true)
    setSendResult(null)
    try {
      await sendNotification(workshopId, {
        channel: 'SLACK',
        recipientCount: workshop.expectedParticipants,
        message,
      })
      setSendResult({ ok: true, message: '알림을 발송했어요!' })
      onSent()
    } catch (err) {
      const backendMessage = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message
      setSendResult({ ok: false, message: backendMessage ?? '알림 발송에 실패했어요.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-800">
            5. 알림을 발송하고, 워크숍 준비를 마무리하세요!
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            참석자에게 워크숍 안내를 발송하고, 일정과 정보를 공유해보세요.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <EyeIcon className="h-3.5 w-3.5" />
            미리보기
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <SendIcon className="h-3.5 w-3.5" />
            테스트 발송
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-2 rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">알림 메시지</h3>
            <div className="flex items-center gap-2">
              <select className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600">
                <option>기본 템플릿</option>
                <option>간단 안내형</option>
              </select>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
              >
                템플릿 관리
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            참석자에게 발송될 메시지 내용을 확인하고 수정할 수 있습니다.
          </p>
          <div className="relative">
            <textarea
              value={message}
              maxLength={1000}
              onChange={(event) => setMessage(event.target.value)}
              rows={10}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none"
            />
            <span className="absolute bottom-2 right-3 text-xs text-slate-400">
              {message.length}/1000
            </span>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              <PaperclipIcon className="h-3.5 w-3.5" />
              첨부파일 추가
            </button>
            <span className="text-xs text-slate-400">2개 첨부됨</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-100 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                <PeopleIcon className="h-4 w-4 text-slate-400" />
                수신 대상
              </h3>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                명단 확인
              </button>
            </div>
            <p className="mb-2 text-xs text-slate-500">참석자 {workshop.expectedParticipants}명</p>
            <label className="mb-2 flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-violet-600" />
              전체 선택
            </label>
            <ul className="flex flex-col gap-1.5 border-t border-slate-100 pt-2">
              <li className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-violet-600" />
                  참석자
                </label>
                <span className="text-slate-400">{workshop.expectedParticipants}명</span>
              </li>
              {extraRecipientGroups.map(({ label, count, checked }) => (
                <li key={label} className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      defaultChecked={checked}
                      className="h-4 w-4 accent-violet-600"
                    />
                    {label}
                  </label>
                  <span className="text-slate-400">{count}명</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">발송 설정</h3>
            <p className="mb-2 text-xs text-slate-400">발송 일시</p>
            <div className="flex flex-col gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="radio"
                  name="sendTiming"
                  checked={sendTiming === 'now'}
                  onChange={() => setSendTiming('now')}
                  className="h-4 w-4 accent-violet-600"
                />
                즉시 발송
              </label>
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="radio"
                  name="sendTiming"
                  checked={sendTiming === 'scheduled'}
                  onChange={() => setSendTiming('scheduled')}
                  className="h-4 w-4 accent-violet-600"
                />
                예약 발송
              </label>
              {sendTiming === 'scheduled' && (
                <div className="ml-6 flex gap-2">
                  <input
                    type="date"
                    defaultValue="2025-07-16"
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600"
                  />
                  <input
                    type="time"
                    defaultValue="10:00"
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600"
                  />
                </div>
              )}
              <p className="text-[11px] text-slate-400">(KST, 한국 시간)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 border-t border-slate-100 pt-4">
        {sendResult && (
          <p className={`text-xs ${sendResult.ok ? 'text-emerald-600' : 'text-red-500'}`}>
            {sendResult.message}
          </p>
        )}
        <div className="flex w-full items-center justify-between">
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
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            <SendIcon className="h-4 w-4" />
            {isSending ? '발송 중...' : '알림 발송하기'}
          </button>
        </div>
        <p className="text-xs text-slate-400">
          발송 후 수정이 어려울 수 있으니, 내용을 다시 한번 확인해주세요!
        </p>
      </div>
    </div>
  )
}

export default Step5NotificationSend
