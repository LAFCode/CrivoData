import {
  LayoutDashboard,
  FileText,
  GitBranch,
  Bell,
  Settings,
} from 'lucide-react'

export const sidebarItems = (t) => [
  {
    label: t('sidebar.dashboard'),
    icon: LayoutDashboard,
    path: '/',
  },
  {
    label: t('sidebar.submissions'),
    icon: FileText,
    path: '/submissions',
  },
  {
    label: t('sidebar.workflows'),
    icon: GitBranch,
    path: '/workflows',
  },
  {
    label: t('sidebar.notifications'),
    icon: Bell,
    path: '/notifications',
  },
  {
    label: t('sidebar.settings'),
    icon: Settings,
    path: '/settings',
  },
]