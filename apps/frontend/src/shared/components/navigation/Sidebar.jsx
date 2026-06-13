import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import SidebarHeader from './SidebarHeader'
import SidebarNav from './SidebarNav'
import SidebarUser from './SidebarUser'
import LanguageSelector from './LanguageSelector'

import { sidebarItems } from './sidebar-items'
import { useAuthStore } from '@/modules/auth/stores/authStore'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const { t, i18n } = useTranslation()
  const user = useAuthStore((s) => s.user)

  const items = sidebarItems(t)

  return (
    <aside
      className={`
        relative
        flex h-full flex-col
        border-r border-zinc-800
        bg-zinc-950
        overflow-visible
        transition-all duration-700 ease-in-out
        ${collapsed ? 'w-24' : 'w-72'}
      `}
    >
      {/* HEADER */}
      <SidebarHeader
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        t={t}
      />

      {/* NAVIGATION */}
      <SidebarNav
        items={items}
        collapsed={collapsed}
      />

      {/* FOOTER */}
      <div
        className="
          flex flex-col gap-3
          border-t border-zinc-800
          p-4
        "
      >
        {/* LANGUAGE SELECTOR */}
        <LanguageSelector
          collapsed={collapsed}
          i18n={i18n}
          t={t}
        />

        {/* USER */}
        <SidebarUser
          collapsed={collapsed}
          user={user}
        />
      </div>
    </aside>
  )
}