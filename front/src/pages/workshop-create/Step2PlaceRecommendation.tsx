import {
  ActivityIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DiningIcon,
  HomeIcon,
  LocationIcon,
  RoomIcon,
  SparkleIcon,
  StarIcon,
} from '@/components/icons'

const filters = [
  { label: '예산', icon: null },
  { label: '거리', icon: LocationIcon },
  { label: '숙소 타입', icon: HomeIcon },
  { label: '액티비티', icon: ActivityIcon },
  { label: '세미나실', icon: RoomIcon },
  { label: '식사 포함 여부', icon: DiningIcon },
]

const places = [
  {
    id: 'gapyeong',
    name: '가평 펜션 리조트',
    badge: 'AI 추천 1위',
    rating: 4.8,
    reviews: 128,
    tags: ['서울에서 1시간 30분', '세미나실 포함', '바베큐', '레크레이션 가능', '예산 적합'],
    totalCost: '3,580,000원',
    perPerson: '143,200원',
  },
  {
    id: 'yangpyeong',
    name: '양평 연수원',
    badge: null,
    rating: 4.7,
    reviews: 96,
    tags: ['대강당', '팀빌딩 프로그램', '숙박', '자연 친화적', '바베큐'],
    totalCost: '3,720,000원',
    perPerson: '148,800원',
  },
  {
    id: 'yongin',
    name: '용인 리조트',
    badge: null,
    rating: 4.6,
    reviews: 74,
    tags: ['워크숍 전문', '액티비티 다양', '세미나실', '교통 편리', '식사 포함'],
    totalCost: '3,890,000원',
    perPerson: '155,600원',
  },
]

function Step2PlaceRecommendation({
  onNext,
  selectedIds,
  onToggle,
}: {
  onNext: () => void
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 rounded-xl bg-violet-50 px-5 py-4">
        <div>
          <p className="flex items-center gap-1 font-semibold text-violet-700">
            <SparkleIcon className="h-4 w-4" />
            AI가 조건에 맞는 장소를 찾았어요!
          </p>
          <p className="mt-1 text-xs text-slate-500">
            25명 · 서울 근교 · 1박 2일 · 1인 15만원 · 팀빌딩, 소통 강화
          </p>
        </div>
        <button
          type="button"
          className="flex flex-shrink-0 items-center gap-1 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50"
        >
          조건 수정하기
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            {Icon ? (
              <Icon className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <span className="text-xs font-semibold text-slate-400">₩</span>
            )}
            {label}
            <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {places.map((place) => {
          const isSelected = selectedIds.includes(place.id)
          return (
            <div
              key={place.id}
              className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row ${
                isSelected ? 'border-violet-300 bg-violet-50/40' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 sm:items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(place.id)}
                  className="mt-1 h-5 w-5 flex-shrink-0 accent-violet-600 sm:mt-0"
                />
                <div className="relative flex h-28 w-40 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-3xl">
                  🏞️
                  {place.badge && (
                    <span className="absolute left-2 top-2 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {place.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{place.name}</h3>
                  <span className="flex items-center gap-0.5 text-xs text-amber-500">
                    <StarIcon className="h-3.5 w-3.5" />
                    {place.rating}
                  </span>
                  <span className="text-xs text-slate-400">({place.reviews})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {place.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-1 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400">예상 비용</p>
                    <p className="font-semibold text-slate-800">
                      {place.totalCost}
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        (1인당 {place.perPerson})
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      자세히 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggle(place.id)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'border border-violet-200 text-violet-600 hover:bg-violet-50'
                      }`}
                    >
                      선택하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>{selectedIds.length}곳 선택됨</span>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            비교하기
          </button>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center justify-center gap-1 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
        >
          다음 단계로
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Step2PlaceRecommendation
