import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getEffectiveStatus,
  listWorkshops,
  type WorkshopResponse,
  type WorkshopStatus,
  type WorkshopType,
} from '@/api/workshop'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, SparkleIcon } from '@/components/icons'
import WorkshopCard from './progress/WorkshopCard'

const PAGE_SIZE = 6

const statusFilterOptions: { value: 'ALL' | WorkshopStatus; label: string }[] = [
  { value: 'ALL', label: '상태 전체' },
  { value: 'DRAFT', label: '작성 중' },
  { value: 'SURVEY_OPEN', label: '설문 진행 중' },
  { value: 'SURVEY_CLOSED', label: '설문 마감' },
  { value: 'ANALYZING', label: '분석 중' },
  { value: 'PROPOSAL_VOTING', label: '투표 중' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'PLAN_COMPLETED', label: '완료' },
]

const typeFilterOptions: { value: 'ALL' | WorkshopType; label: string }[] = [
  { value: 'ALL', label: '워크숍 유형 전체' },
  { value: 'OVERNIGHT', label: '1박 2일' },
  { value: 'DAY_TRIP', label: '당일' },
]

function ProgressPage() {
  const [workshops, setWorkshops] = useState<WorkshopResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | WorkshopStatus>('ALL')
  const [typeFilter, setTypeFilter] = useState<'ALL' | WorkshopType>('ALL')
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt'>('updatedAt')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    listWorkshops()
      .then((list) => {
        if (!cancelled) setWorkshops(list)
      })
      .catch(() => {
        if (!cancelled) setError('워크숍 목록을 불러오지 못했어요.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return workshops
      .filter((workshop) => {
        if (statusFilter !== 'ALL' && getEffectiveStatus(workshop) !== statusFilter) return false
        if (typeFilter !== 'ALL' && workshop.workshopType !== typeFilter) return false
        if (!query) return true
        return (
          workshop.title.toLowerCase().includes(query) ||
          workshop.preferredRegion.toLowerCase().includes(query) ||
          workshop.purposeKeywords.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime())
  }, [workshops, search, statusFilter, typeFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedWorkshops = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const totalCount = workshops.length
  const completedCount = workshops.filter((w) => getEffectiveStatus(w) === 'PLAN_COMPLETED').length
  const inProgressCount = totalCount - completedCount

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">내 워크숍</h1>
            <p className="mt-1 text-sm text-slate-500">
              지금까지 생성한 워크숍을 확인하고 이어서 준비하거나 수정할 수 있습니다.
            </p>
          </div>
          <Link
            to="/workshops/new"
            className="flex flex-shrink-0 items-center gap-1 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <PlusIcon className="h-4 w-4" />
            새 워크숍 만들기
          </Link>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <SearchIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="워크숍 제목, 지역, 목적 검색"
              className="w-full text-sm text-slate-800 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as 'ALL' | WorkshopStatus)
              setPage(1)
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
          >
            {statusFilterOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value as 'ALL' | WorkshopType)
              setPage(1)
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
          >
            {typeFilterOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as 'updatedAt' | 'createdAt')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
          >
            <option value="updatedAt">최근 수정일</option>
            <option value="createdAt">최근 생성일</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-16 text-sm text-slate-400">
            <SparkleIcon className="h-5 w-5 animate-pulse text-violet-400" />
            불러오는 중...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
            {error}
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <p className="text-sm text-slate-500">
              {workshops.length === 0 ? '아직 만든 워크숍이 없어요.' : '조건에 맞는 워크숍이 없어요.'}
            </p>
            {workshops.length === 0 && (
              <Link
                to="/workshops/new"
                className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                워크숍 만들기
              </Link>
            )}
          </div>
        )}

        {!isLoading && !error && pagedWorkshops.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pagedWorkshops.map((workshop, index) => (
                <WorkshopCard key={workshop.id} workshop={workshop} colorIndex={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      pageNumber === currentPage
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">워크숍 요약</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xl font-bold text-slate-800">{totalCount}</p>
              <p className="text-xs text-slate-500">전체 워크숍</p>
            </div>
            <div className="rounded-xl bg-violet-50 p-3">
              <p className="text-xl font-bold text-violet-600">{inProgressCount}</p>
              <p className="text-xs text-slate-500">진행 중</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xl font-bold text-slate-800">{completedCount}</p>
              <p className="text-xs text-slate-500">완료</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🤖
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">워크숍 관리가 어렵다면?</p>
            <p className="mb-2 text-xs text-slate-500">AI에게 도움을 요청해보세요!</p>
            <button
              type="button"
              className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white"
            >
              AI에게 물어보기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage
