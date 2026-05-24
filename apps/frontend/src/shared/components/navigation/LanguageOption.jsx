export default function LanguageOption({
  label,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2 text-sm
        rounded-lg transition-colors duration-150
        flex items-center justify-between
        ${
          active
            ? 'bg-zinc-800 text-white font-medium'
            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
        }
      `}
    >
      <span>{label}</span>

      {active && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      )}
    </button>
  )
}