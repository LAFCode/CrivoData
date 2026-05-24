export default function SidebarUser({
  collapsed,
  user,
}) {
  return (
    <div
      className={`
        flex items-center rounded-2xl bg-zinc-900 p-3
        ${collapsed ? 'justify-center' : 'gap-3'}
      `}
    >
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700 text-white font-bold">
        {user.name.charAt(0)}
      </div>

      {!collapsed && (
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user.name}
          </p>

          <p className="text-xs text-zinc-500 truncate">
            {user.role}
          </p>
        </div>
      )}
    </div>
  )
}