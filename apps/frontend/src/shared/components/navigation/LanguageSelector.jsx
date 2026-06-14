import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages, Check } from 'lucide-react'

function LanguageOption({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between
        px-3 py-2.5 rounded-lg
        text-sm font-medium transition-all
        ${active
          ? 'bg-zinc-800 text-white'
          : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
        }
      `}
    >
      <span>{label}</span>
      {active && <Check className="h-4 w-4 text-white" />}
    </button>
  )
}

export default function LanguageSelector({ collapsed }) {
  const [isOpen, setIsOpen] = useState(false)

  const { t, i18n } = useTranslation()

  const isPortuguese = i18n.language.startsWith('pt')

  const currentLanguage = isPortuguese
    ? 'Português (BR)'
    : 'English (US)'

  const handleToggle = () => {
    if (collapsed) {
      i18n.changeLanguage(isPortuguese ? 'en' : 'pt')
      return
    }

    setIsOpen((prev) => !prev)
  }

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* BOTÃO PRINCIPAL */}
      <button
        onClick={handleToggle}
        title={t('sidebar.toggle_language_hint')}
        className={`
          w-full flex items-center rounded-xl
          text-zinc-400 bg-zinc-900/40
          border border-zinc-800/60
          hover:bg-zinc-900 hover:text-white
          p-2.5 transition-all duration-200
          text-left text-sm font-medium
          ${collapsed ? 'justify-center' : 'justify-between'}
        `}
      >
        <div className="flex items-center gap-3">
          <Languages size={18} />

          {!collapsed && (
            <span>{currentLanguage}</span>
          )}
        </div>

        {!collapsed && (
          <svg
            className={`
              w-4 h-4 text-zinc-500
              transition-transform duration-200
              ${isOpen ? 'rotate-180' : ''}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && !collapsed && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* MENU */}
          <div
            className="
              absolute bottom-full mb-2 left-0
              w-full bg-zinc-900
              border border-zinc-800
              rounded-xl shadow-2xl
              p-1.5 z-20
              animate-in fade-in
              slide-in-from-bottom-2
              duration-150
            "
          >
            <LanguageOption
              active={isPortuguese}
              label="Português (BR)"
              onClick={() => changeLanguage('pt')}
            />

            <LanguageOption
              active={!isPortuguese}
              label="English (US)"
              onClick={() => changeLanguage('en')}
            />
          </div>
        </>
      )}
    </div>
  )
}