import { NavLink } from 'react-router-dom'

export default function SidebarItem({
  item,
  collapsed,
  index,
}) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        relative group flex items-center
        rounded-2xl px-4 py-3
        transition-all duration-200
        ${collapsed ? 'justify-center' : 'gap-3'}
        ${
          isActive
            ? 'bg-white text-black'
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
        }
      `}
    >
      {/* ÍCONE */}
      <Icon
        size={20}
        className="flex-shrink-0"
      />

      {/* LABEL */}
      <span
        style={{
          transitionDelay: collapsed
            ? '0ms'
            : `${index * 120}ms`,
        }}
        className={`
          overflow-hidden whitespace-nowrap
          text-sm font-medium
          transition-all duration-500 ease-in-out
          ${
            collapsed
              ? `
                max-w-0
                opacity-0
                -translate-x-2
              `
              : `
                max-w-[200px]
                opacity-100
                translate-x-0
              `
          }
        `}
      >
        {item.label}
      </span>

      {/* TOOLTIP */}
      {collapsed && (
        <div
          className="
            pointer-events-none
            fixed

            whitespace-nowrap

            rounded-xl
            border border-zinc-800
            bg-zinc-900

            px-3 py-2
            text-sm font-medium text-white

            opacity-0
            shadow-2xl

            transition-all duration-200

            translate-x-2
            group-hover:translate-x-0
            group-hover:opacity-100

            z-[9999]
          "
          style={{
            left: '96px',
          }}
        >
          {item.label}
        </div>
      )}
    </NavLink>
  )
}