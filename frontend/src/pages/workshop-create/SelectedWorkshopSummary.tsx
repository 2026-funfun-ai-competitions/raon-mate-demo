function SelectedWorkshopSummary() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">선택한 워크숍 요약</h2>
        <button type="button" className="text-xs text-slate-400 hover:text-slate-600">
          수정
        </button>
      </div>
      <div className="flex h-24 items-center justify-center rounded-xl bg-slate-100 text-3xl">
        🏞️
      </div>
      <div className="mt-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-800">가평 펜션 리조트</h3>
        <span className="text-xs text-amber-500">★ 4.8 (128)</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {['세미나실 포함', '바베큐', '레크레이션 가능'].map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            {tag}
          </span>
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-1.5 text-xs">
        <li className="flex justify-between text-slate-500">
          <span>진행 일정</span>
          <span className="text-slate-700">2025.09.09 (화) ~ 09.10 (수) · 1박 2일</span>
        </li>
        <li className="flex justify-between text-slate-500">
          <span>참석 인원</span>
          <span className="text-slate-700">25명</span>
        </li>
        <li className="flex justify-between text-slate-500">
          <span>1인 예산</span>
          <span className="text-slate-700">150,000원 (총 3,750,000원)</span>
        </li>
        <li className="flex justify-between text-slate-500">
          <span>워크숍 목적</span>
          <span className="text-right text-slate-700">팀 빌딩, 소통 강화, 하반기 목표 공유</span>
        </li>
      </ul>
    </div>
  )
}

export default SelectedWorkshopSummary
