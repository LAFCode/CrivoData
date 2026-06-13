import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/stores/authStore'

export default function SidebarUser({
  collapsed,
  user,
}) {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div
      className={`
        flex items-center rounded-2xl bg-zinc-900 p-3
        ${collapsed ? 'justify-center' : 'gap-3'}
      `}
    >
      <div
        className="
          flex h-11 w-11 flex-shrink-0 items-center justify-center
          rounded-full bg-zinc-700 text-base font-bold text-white
        "
      >
        {user?.name?.charAt(0) || '?'}
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {user?.name || 'Usuário'}
          </p>

          <p className="truncate text-xs text-zinc-500">
            {user?.role || '-'}
          </p>
        </div>
      )}

      <button
        onClick={handleLogout}
        title="Sair"
        className="
          flex h-8 w-8 shrink-0 items-center justify-center
          rounded-xl text-zinc-500
          transition-all
          hover:bg-zinc-800 hover:text-red-400
        "
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
}
