import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: '홈', end: true },
  { to: '/workshops/new', label: '워크숍 만들기' },
  { to: '/progress', label: '진행 현황' },
]

function Layout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-1 items-baseline gap-2">
          <span className="text-xl font-bold text-violet-600">라온 메이트</span>
          <span className="text-xs font-medium tracking-wide text-slate-400">RAON MATE</span>
        </div>

        <nav className="flex flex-1 items-center justify-center gap-2">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium ${
                  isActive
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-slate-500 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <button
            type="button"
            aria-label="알림"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21a2 2 0 0 1-3.46 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-slate-300" />
            <span className="text-sm font-medium text-slate-700">김라온님</span>
            <span className="text-xs text-slate-400">▾</span>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
