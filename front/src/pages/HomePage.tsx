import bannerImage from '@/assets/banner.png'
import {
  CalculatorIcon,
  CalendarIcon,
  ChecklistIcon,
  ChevronRightIcon,
  DiningIcon,
  LocationIcon,
  MegaphoneIcon,
  PeopleIcon,
  RocketIcon,
  SparkleIcon,
} from '@/components/icons'

const features = [
  {
    icon: LocationIcon,
    title: '장소 추천',
    description: '인원과 예산에 맞는 최적의 장소를 추천해드려요.',
  },
  {
    icon: CalendarIcon,
    title: '일정 생성',
    description: '1박2일, 당일 일정까지 AI가 알아서 짜드려요.',
  },
  {
    icon: PeopleIcon,
    title: '인원 관리',
    description: '참석 인원과 역할을 쉽게 관리할 수 있어요.',
  },
  {
    icon: CalculatorIcon,
    title: '예산 계산',
    description: '항목별 예산을 계산하고 비용을 한눈에 확인해요.',
  },
  {
    icon: ChecklistIcon,
    title: '준비물 체크리스트',
    description: '필수 준비물을 자동으로 정리해드려요.',
  },
  {
    icon: DiningIcon,
    title: '식당 추천',
    description: '워크숍 장소 근처 맛집을 추천해드려요.',
  },
]

const suggestedQuestions = [
  '강원도 워크숍 장소 추천',
  '20명 예산 계산해줘',
  '1박2일 일정 짜줘',
  '준비물 체크리스트 만들어줘',
  '비 오면 대체 일정 추천',
]

const newsItems = ['7월 워크숍 시즌! 인기 장소는 미리 예약하는 센스!', '여름휴가 지원 제도 변경 안내']

function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
      <section className="flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-50 px-10 py-12">
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-[2.55rem] font-extrabold text-slate-900">워크숍 플래너</h1>
          <p className="text-lg leading-relaxed text-slate-600">
            AI가 장소부터 일정, 예산까지
            <br />
            워크숍 준비를 한 번에 도와드려요.
          </p>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
          >
            <RocketIcon className="h-5 w-5" />
            워크숍 시작하기
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        <img src={bannerImage} alt="" className="w-96 flex-shrink-0" />
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <Icon className="h-6 w-6" />
            </span>
            <h2 className="font-semibold text-slate-800">{title}</h2>
            <p className="text-xs leading-relaxed text-slate-500">{description}</p>
          </div>
        ))}
      </section>

      <section className="flex items-center gap-3 overflow-x-auto rounded-2xl bg-white px-5 py-4 shadow-sm">
        <span className="flex flex-shrink-0 items-center gap-1 text-sm font-semibold text-violet-600">
          <SparkleIcon className="h-4 w-4" />
          추천 질문
        </span>
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            type="button"
            className="flex-shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            {question}
          </button>
        ))}
        <ChevronRightIcon className="ml-auto h-5 w-5 flex-shrink-0 text-slate-400" />
      </section>

      <section className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
        <span className="flex flex-shrink-0 items-center gap-1 text-sm font-semibold text-slate-800">
          <MegaphoneIcon className="h-4 w-4" />
          라온 메이트 소식
        </span>
        <p className="flex-1 truncate text-sm text-slate-500">{newsItems.join('  |  ')}</p>
        <button
          type="button"
          className="flex flex-shrink-0 items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
        >
          더보기
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </section>
    </div>
  )
}

export default HomePage
