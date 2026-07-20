import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import WorkshopCreatePage from '@/pages/WorkshopCreatePage'
import ProgressPage from '@/pages/ProgressPage'
import HistoryPage from '@/pages/HistoryPage'
import ChecklistPage from '@/pages/ChecklistPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'workshops/new', element: <WorkshopCreatePage /> },
      { path: 'workshops/:workshopId', element: <WorkshopCreatePage /> },
      { path: 'workshops/:workshopId/checklist', element: <ChecklistPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'history', element: <HistoryPage /> },
    ],
  },
])

export default router
 