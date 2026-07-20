import { ChevronRightIcon } from '@/components/icons'

const themeIdeas = [
  {
    emoji: '🏕️',
    title: '자연 속 힐링 워크숍',
    description: '자연에서 재충전하며 팀워크를 높여요',
    tags: ['힐링', '소통'],
  },
  {
    emoji: '🚣',
    title: '액티비티 워크숍',
    description: '다양한 액티비티로 협업과 유대감을!',
    tags: ['액티비티', '협업'],
  },
  {
    emoji: '💡',
    title: '인사이트 워크숍',
    description: '전문 강연과 워크샵으로 인사이트를 얻어요',
    tags: ['강연', '성장'],
  },
  {
    emoji: '🏙️',
    title: '도심형 워크숍',
    description: '도심 속 편리한 워크숍을 원한다면',
    tags: ['접근성', '효율'],
  },
]

function Step1ThemeIdeas() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">이런 워크숍은 어때요?</h2>
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
          >
            더 많은 테마 보기
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {themeIdeas.map(({ emoji, title, description, tags }) => (
            <div key={title} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex h-24 items-center justify-center rounded-xl bg-slate-100 text-4xl">
                {emoji}
              </div>
              <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
              <p className="text-xs leading-relaxed text-slate-500">{description}</p>
              <div className="flex gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm">
        <span className="text-sm text-slate-600">
          <span className="mr-2 rounded bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-600">
            TIP
          </span>
          워크숍 성공을 위한 체크리스트를 확인해보세요!
        </span>
        <button
          type="button"
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
        >
          체크리스트 보기
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}

export default Step1ThemeIdeas
