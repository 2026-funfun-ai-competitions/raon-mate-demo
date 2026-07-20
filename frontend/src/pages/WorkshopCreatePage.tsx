import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalculatorIcon, CompassIcon, SendIcon, SparkleIcon } from '@/components/icons'
import {
  getBudget,
  getLatestVenueRecommendation,
  getSchedule,
  getWorkshop,
  type BudgetResponse,
  type ScheduleItem,
  type Venue,
  type WorkshopResponse,
} from '@/api/workshop'
import StepIndicator from './workshop-create/StepIndicator'
import Step1BasicInfo from './workshop-create/Step1BasicInfo'
import Step1ThemeIdeas from './workshop-create/Step1ThemeIdeas'
import Step1RightPanel from './workshop-create/Step1RightPanel'
import Step2PlaceRecommendation from './workshop-create/Step2PlaceRecommendation'
import Step2RightPanel from './workshop-create/Step2RightPanel'
import Step2CompareView from './workshop-create/Step2CompareView'
import Step2CompareRightPanel from './workshop-create/Step2CompareRightPanel'
import Step3SchedulePlan from './workshop-create/Step3SchedulePlan'
import Step3RightPanel from './workshop-create/Step3RightPanel'
import Step4BudgetManagement from './workshop-create/Step4BudgetManagement'
import Step4RightPanel from './workshop-create/Step4RightPanel'
import Step5NotificationSend from './workshop-create/Step5NotificationSend'
import Step5RightPanel from './workshop-create/Step5RightPanel'
import WorkshopEditModal from './workshop-create/WorkshopEditModal'

function WorkshopCreatePage() {
  const { workshopId: routeWorkshopId } = useParams()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [workshop, setWorkshop] = useState<WorkshopResponse | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenues, setSelectedVenues] = useState<Venue[]>([])
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [budget, setBudget] = useState<BudgetResponse | null>(null)
  const [isResuming, setIsResuming] = useState(Boolean(routeWorkshopId))
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [isEditingWorkshop, setIsEditingWorkshop] = useState(false)
  const [notificationsRefreshKey, setNotificationsRefreshKey] = useState(0)
  const [isComparingVenues, setIsComparingVenues] = useState(false)

  useEffect(() => {
    if (!routeWorkshopId) return
    let cancelled = false

    async function resume(id: string) {
      setIsResuming(true)
      setResumeError(null)
      try {
        const loadedWorkshop = await getWorkshop(id)
        if (cancelled) return
        setWorkshop(loadedWorkshop)

        let resumedStep = 2
        let loadedVenues: Venue[] = []
        try {
          const recommendation = await getLatestVenueRecommendation(id)
          loadedVenues = recommendation.recommendations
          if (!cancelled) setVenues(loadedVenues)
        } catch {
          // 아직 추천받은 장소가 없음 — 2단계에서 새로 추천받는다.
        }

        if (loadedWorkshop.selectedVenuePlaceIds.length > 0) {
          const matched = loadedVenues.filter((venue) =>
            loadedWorkshop.selectedVenuePlaceIds.includes(venue.placeId),
          )
          if (!cancelled) setSelectedVenues(matched)
          resumedStep = 3
        }

        try {
          const scheduleResponse = await getSchedule(id)
          if (!cancelled) setSchedule(scheduleResponse.items)
          resumedStep = 4
        } catch {
          // 아직 생성된 일정이 없음
        }

        try {
          const budgetResponse = await getBudget(id)
          if (!cancelled) setBudget(budgetResponse)
          resumedStep = 5
        } catch {
          // 아직 초기화된 예산이 없음
        }

        if (!cancelled) setCurrentStep(resumedStep)
      } catch {
        if (!cancelled) setResumeError('워크숍을 불러오지 못했어요. 링크가 올바른지 확인해주세요.')
      } finally {
        if (!cancelled) setIsResuming(false)
      }
    }

    resume(routeWorkshopId)
    return () => {
      cancelled = true
    }
  }, [routeWorkshopId])

  function handleWorkshopCreated(created: WorkshopResponse) {
    // 1단계를 다시 제출하면 서버에 새 워크숍이 생성되므로, 이전 워크숍에 딸려있던
    // 추천/선택/일정/예산 데이터는 더 이상 유효하지 않다 — 함께 초기화한다.
    setWorkshop(created)
    setVenues([])
    setSelectedVenues([])
    setSchedule([])
    setBudget(null)
    setIsComparingVenues(false)
    setCurrentStep(2)
    navigate(`/workshops/${created.id}`, { replace: true })
  }

  function toggleSelectedVenue(venue: Venue) {
    setSelectedVenues((current) =>
      current.some((v) => v.placeId === venue.placeId)
        ? current.filter((v) => v.placeId !== venue.placeId)
        : [...current, venue],
    )
  }

  const primaryVenue = selectedVenues[0]
  const BadgeIcon = currentStep === 4 ? CalculatorIcon : currentStep === 5 ? SendIcon : CompassIcon

  if (isResuming) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-24 text-sm text-slate-400">
        <SparkleIcon className="h-5 w-5 animate-pulse text-violet-400" />
        워크숍을 불러오는 중이에요...
      </div>
    )
  }

  if (resumeError) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-24 text-sm text-slate-500">
        {resumeError}
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <BadgeIcon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">워크숍 플래너</h1>
            <p className="text-sm text-slate-500">워크숍 진행 전 과정을 라온 메이트가 도와드려요.</p>
          </div>
        </div>

        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <>
            <Step1BasicInfo onNext={handleWorkshopCreated} />
            <Step1ThemeIdeas />
          </>
        )}

        {workshop && currentStep === 2 && !isComparingVenues && (
          <Step2PlaceRecommendation
            workshopId={workshop.id}
            initialVenues={venues}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            selectedIds={selectedVenues.map((v) => v.placeId)}
            onToggle={toggleSelectedVenue}
            onVenuesLoaded={setVenues}
            onEditWorkshop={() => setIsEditingWorkshop(true)}
            onCompare={() => setIsComparingVenues(true)}
          />
        )}

        {workshop && currentStep === 2 && isComparingVenues && (
          <Step2CompareView
            venues={venues}
            selectedIds={selectedVenues.map((v) => v.placeId)}
            onToggle={toggleSelectedVenue}
            onBack={() => setIsComparingVenues(false)}
            onResetSelection={() => setSelectedVenues([])}
          />
        )}

        {workshop && currentStep === 3 && (
          <Step3SchedulePlan
            workshopId={workshop.id}
            initialItems={schedule}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
            onScheduleLoaded={setSchedule}
          />
        )}

        {workshop && currentStep === 4 && (
          <Step4BudgetManagement
            workshopId={workshop.id}
            initialBudget={budget}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
            onBudgetLoaded={setBudget}
          />
        )}

        {workshop && currentStep === 5 && (
          <Step5NotificationSend
            workshopId={workshop.id}
            expectedParticipants={workshop.expectedParticipants}
            onBack={() => setCurrentStep(4)}
            onSent={() => setNotificationsRefreshKey((key) => key + 1)}
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {currentStep === 1 && <Step1RightPanel />}
        {workshop && currentStep === 2 && !isComparingVenues && (
          <Step2RightPanel
            workshop={workshop}
            venues={venues}
            onEditWorkshop={() => setIsEditingWorkshop(true)}
          />
        )}
        {workshop && currentStep === 2 && isComparingVenues && (
          <Step2CompareRightPanel
            workshopId={workshop.id}
            venues={venues}
            selectedVenues={selectedVenues}
            onToggle={toggleSelectedVenue}
            onNext={() => {
              setIsComparingVenues(false)
              setCurrentStep(3)
            }}
          />
        )}
        {currentStep === 3 && <Step3RightPanel items={schedule} />}
        {workshop && currentStep === 4 && (
          <Step4RightPanel
            workshop={workshop}
            venue={primaryVenue}
            onEditWorkshop={() => setIsEditingWorkshop(true)}
          />
        )}
        {workshop && currentStep === 5 && (
          <Step5RightPanel
            workshop={workshop}
            venue={primaryVenue}
            onEditWorkshop={() => setIsEditingWorkshop(true)}
            refreshKey={notificationsRefreshKey}
          />
        )}
      </div>

      {isEditingWorkshop && workshop && (
        <WorkshopEditModal
          workshop={workshop}
          onClose={() => setIsEditingWorkshop(false)}
          onSaved={(updated) => setWorkshop(updated)}
        />
      )}
    </div>
  )
}

export default WorkshopCreatePage
