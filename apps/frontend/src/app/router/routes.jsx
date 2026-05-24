import NavigationShell from '@/shared/components/navigation/NavigationShell'

import DashboardPage from '@/modules/dashboard/pages/DashboardPage'
import SubmissionsPage from '@/modules/submissions/pages/SubmissionsPage'
import WorkflowsPage from '@/modules/workflows/pages/WorkflowsPage'
import WorkflowFormPage from '@/modules/workflows/pages/WorkflowFormPage'
import NotificationsPage from '@/modules/notifications/pages/NotificationsPage'
import SettingsPage from '@/modules/settings/pages/SettingsPage'

function withLayout(component) {
  return (
    <NavigationShell>
      {component}
    </NavigationShell>
  )
}

export const routes = [
  {
    path: '/',
    element: withLayout(<DashboardPage />),
  },

  {
    path: '/submissions',
    element: withLayout(<SubmissionsPage />),
  },

  {
    path: '/workflows',
    element: withLayout(<WorkflowsPage />),
  },

  {
    path: '/workflows/new',
    element: withLayout(<WorkflowFormPage />),
  },

  {
    path: '/notifications',
    element: withLayout(<NotificationsPage />),
  },

  {
    path: '/settings',
    element: withLayout(<SettingsPage />),
  },
]