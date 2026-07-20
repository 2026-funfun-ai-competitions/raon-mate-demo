import {
  BusIcon,
  ChecklistIcon,
  DiningIcon,
  LocationIcon,
  PeopleIcon,
  PresentationIcon,
} from '@/components/icons'

export interface ChecklistItem {
  label: string
  done: boolean
}

export interface ChecklistCategory {
  name: string
  icon: typeof LocationIcon
  color: string
  items: ChecklistItem[]
}

// 워크숍 준비 체크리스트 API가 아직 없어서, 데모용 고정 데이터로 구성했다.
export const checklistCategories: ChecklistCategory[] = [
  {
    name: '장소',
    icon: LocationIcon,
    color: 'bg-violet-100 text-violet-600',
    items: [
      { label: '예약 완료', done: true },
      { label: '계약서 확인', done: true },
      { label: '세미나실 예약', done: true },
      { label: '빔프로젝터 테스트', done: false },
      { label: '주차 공간 확인', done: true },
    ],
  },
  {
    name: '식사',
    icon: DiningIcon,
    color: 'bg-amber-100 text-amber-600',
    items: [
      { label: '점심 예약', done: true },
      { label: '저녁 예약', done: true },
      { label: '알레르기 인원 확인', done: true },
      { label: '채식 메뉴 확인', done: false },
      { label: '식사 장소 확인', done: true },
    ],
  },
  {
    name: '참석자',
    icon: PeopleIcon,
    color: 'bg-blue-100 text-blue-600',
    items: [
      { label: '참석자 확정', done: true },
      { label: '불참자 확인', done: true },
      { label: '객실 배정', done: false },
      { label: '차량 배정', done: true },
      { label: '비상 연락망 공유', done: true },
    ],
  },
  {
    name: '프로그램',
    icon: PresentationIcon,
    color: 'bg-pink-100 text-pink-600',
    items: [
      { label: '일정 확정', done: true },
      { label: '발표자료 준비', done: true },
      { label: '레크레이션 준비', done: true },
      { label: '상품 준비', done: true },
      { label: '강사 확인', done: true },
    ],
  },
  {
    name: '이동',
    icon: BusIcon,
    color: 'bg-teal-100 text-teal-600',
    items: [
      { label: '버스 예약 확인', done: true },
      { label: '기사 연락처 저장', done: false },
      { label: '집결지 안내', done: true },
    ],
  },
  {
    name: '기타',
    icon: ChecklistIcon,
    color: 'bg-purple-100 text-purple-600',
    items: [
      { label: '비용 정산 담당 지정', done: true },
      { label: '문서 보관 폴더 정리', done: true },
    ],
  },
]

export const allChecklistItems = checklistCategories.flatMap((category) => category.items)
export const totalChecklistCount = allChecklistItems.length
export const doneChecklistCount = allChecklistItems.filter((item) => item.done).length
export const incompleteChecklistItems = allChecklistItems
  .filter((item) => !item.done)
  .map((item) => item.label)
