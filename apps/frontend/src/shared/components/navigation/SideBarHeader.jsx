import {
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

export default function SidebarHeader({
  collapsed,
  setCollapsed,
  t,
}) {
  return (
    <div
      className="
        flex items-center justify-between
        border-b border-zinc-800
        p-6 min-h-[88px]
      "
    >
      {/* LOGO + SUBTITLE */}
      <div
        className={`
          overflow-hidden whitespace-nowrap
          transition-all duration-500
          ${
            collapsed
              ? 'max-w-0 opacity-0'
              : 'max-w-[220px] opacity-100'
          }
        `}
      >
        <h1 className="text-lg font-semibold text-white">
          CrivoData
        </h1>

        <p className="text-sm text-zinc-500">
          {t('sidebar.subtitle')}
        </p>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => {
          setCollapsed(!collapsed)
        }}
        className="
          flex h-10 w-10 flex-shrink-0
          items-center justify-center
          rounded-xl text-zinc-400
          transition-all duration-300
          hover:bg-zinc-900 hover:text-white
        "
      >
        {collapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <PanelLeftClose size={18} />
        )}
      </button>
    </div>
  )
}