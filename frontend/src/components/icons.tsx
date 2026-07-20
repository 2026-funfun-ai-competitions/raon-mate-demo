import type { SVGProps } from 'react'

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  )
}

export function LocationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 22s7-7.582 7-13a7 7 0 1 0-14 0c0 5.418 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </IconBase>
  )
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </IconBase>
  )
}

export function PeopleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.5c2.485.32 4.5 2.53 4.5 5.5" />
    </IconBase>
  )
}

export function CalculatorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
    </IconBase>
  )
}

export function ChecklistIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z" />
      <path d="m9 13 2 2 4-4" />
    </IconBase>
  )
}

export function DiningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M8 3v8M6 3v5a2 2 0 0 0 4 0V3M8 11v10" />
      <path d="M16 3c-1.5 0-2 2-2 4s.5 4 2 4v10" />
    </IconBase>
  )
}

export function RocketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 2c2 2 3 5 3 8 0 2-1 4-3 6-2-2-3-4-3-6 0-3 1-6 3-8Z" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <path d="m9 15-2 5 4-2M15 15l2 5-4-2" />
    </IconBase>
  )
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </IconBase>
  )
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  )
}

export function MegaphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 11v2a2 2 0 0 0 2 2h1l1 4h2l-1-4h2l7 4V5l-7 4H6a2 2 0 0 0-2 2Z" />
    </IconBase>
  )
}

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </IconBase>
  )
}

export function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-4.5 1.5L9 15l4.5-1.5Z" />
    </IconBase>
  )
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
    </IconBase>
  )
}

export function ActivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
    </IconBase>
  )
}

export function RoomIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M9 21h6M12 17v4" />
    </IconBase>
  )
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  )
}

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" />
    </svg>
  )
}

export function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </IconBase>
  )
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z" />
    </svg>
  )
}

export function BusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="13" rx="2" />
      <path d="M4 11h16M8 21v-2M16 21v-2" />
      <circle cx="8" cy="15" r="0.5" fill="currentColor" />
      <circle cx="16" cy="15" r="0.5" fill="currentColor" />
    </IconBase>
  )
}

export function PresentationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4M8 20h8M7 8h6M7 11h4" />
    </IconBase>
  )
}

export function BedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
      <path d="M3 18v2M21 18v2M3 12V8a2 2 0 0 1 2-2h4v4" />
    </IconBase>
  )
}

export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5" />
    </IconBase>
  )
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m15 6-6 6 6 6" />
    </IconBase>
  )
}

export function SendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
    </IconBase>
  )
}

export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 3v12m0 0-4-4m4 4 4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </IconBase>
  )
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  )
}

export function PaperclipIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M21 12.5 12.5 21a4.95 4.95 0 0 1-7-7L14 5.5a3.5 3.5 0 0 1 5 5L10.5 19a2 2 0 0 1-3-3l7.5-7.5" />
    </IconBase>
  )
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  )
}

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5a8.38 8.38 0 0 1-1-4A8.38 8.38 0 0 1 11.5 2 8.5 8.5 0 0 1 21 11.5Z" />
    </IconBase>
  )
}

export function SmsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M11 18h2" />
    </IconBase>
  )
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </IconBase>
  )
}

export function MoreVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  )
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m15 18-6-6 6-6" />
    </IconBase>
  )
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  )
}
