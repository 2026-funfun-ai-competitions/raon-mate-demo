import { useState } from 'react'
import { CompassIcon } from '@/components/icons'
import StepIndicator from './workshop-create/StepIndicator'
import Step1BasicInfo from './workshop-create/Step1BasicInfo'
import Step1ThemeIdeas from './workshop-create/Step1ThemeIdeas'
import Step1RightPanel from './workshop-create/Step1RightPanel'
import Step2PlaceRecommendation from './workshop-create/Step2PlaceRecommendation'
import Step2RightPanel from './workshop-create/Step2RightPanel'

function WorkshopCreatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>(['gapyeong'])

  function toggleSelectedPlace(id: string) {
    setSelectedPlaceIds((current) =>
      current.includes(id) ? current.filter((placeId) => placeId !== id) : [...current, id],
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <CompassIcon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">워크숍 플래너</h1>
            <p className="text-sm text-slate-500">워크숍 진행 전 과정을 라온 메이트가 도와드려요.</p>
          </div>
        </div>

        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <>
            <Step1BasicInfo onNext={() => setCurrentStep(2)} />
            <Step1ThemeIdeas />
          </>
        )}

        {currentStep === 2 && (
          <Step2PlaceRecommendation
            onNext={() => setCurrentStep(3)}
            selectedIds={selectedPlaceIds}
            onToggle={toggleSelectedPlace}
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {currentStep === 1 && <Step1RightPanel />}
        {currentStep === 2 && <Step2RightPanel />}
      </div>
    </div>
  )
}

export default WorkshopCreatePage
