import { CheckCircleIcon } from '@/components/icons'

const steps = ['기본 정보 입력', '장소 추천', '일정 계획', '예산 관리', '알림 발송']

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-start rounded-2xl bg-white px-8 py-6 shadow-sm">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-2 last:flex-none">
            <div className="flex w-full items-center">
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isCompleted || isActive
                    ? 'bg-violet-600 text-white'
                    : 'border border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircleIcon className="h-4 w-4" /> : stepNumber}
              </span>
              {index < steps.length - 1 && <span className="h-px flex-1 bg-slate-200" />}
            </div>
            <span
              className={`text-xs font-medium ${
                isActive || isCompleted ? 'text-violet-700' : 'text-slate-400'
              }`}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default StepIndicator
