import { ActivityIcon, BedIcon, BusIcon, DiningIcon, PeopleIcon, StarIcon } from '@/components/icons'
import type { ScheduleItem } from '@/api/workshop'

export const categoryMeta: Record<string, { label: string; icon: typeof BusIcon; style: string }> = {
  MOVE: { label: '이동', icon: BusIcon, style: 'bg-blue-50 text-blue-600' },
  MEAL: { label: '식사', icon: DiningIcon, style: 'bg-amber-50 text-amber-600' },
  SESSION: { label: '세션', icon: PeopleIcon, style: 'bg-violet-50 text-violet-600' },
  ACTIVITY: { label: '액티비티', icon: ActivityIcon, style: 'bg-emerald-50 text-emerald-600' },
  FREE: { label: '자유', icon: StarIcon, style: 'bg-yellow-50 text-yellow-700' },
  REST: { label: '휴식', icon: BedIcon, style: 'bg-slate-100 text-slate-500' },
}

export const defaultCategoryMeta = { label: '기타', icon: PeopleIcon, style: 'bg-slate-100 text-slate-500' }

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']

export function formatDayLabel(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day} (${weekdayLabels[date.getDay()]})`
}

export function formatTimeRange(item: ScheduleItem) {
  const start = item.startTime.slice(0, 5)
  const end = item.endTime ? item.endTime.slice(0, 5) : ''
  return end ? `${start} ~ ${end}` : `${start} ~`
}

export function uniqueSortedDates(items: ScheduleItem[]) {
  return [...new Set(items.map((item) => item.date))].sort()
}

export function groupByDate(items: ScheduleItem[]) {
  return uniqueSortedDates(items).map((date, index) => ({
    day: `DAY ${index + 1}`,
    date: formatDayLabel(date),
    rawDate: date,
    items: items.filter((item) => item.date === date),
  }))
}

export function durationLabel(items: ScheduleItem[]) {
  const dayCount = uniqueSortedDates(items).length
  if (dayCount <= 1) return '당일'
  return `${dayCount - 1}박 ${dayCount}일`
}
