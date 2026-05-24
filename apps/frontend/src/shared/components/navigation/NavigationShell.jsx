import Sidebar from './Sidebar'

export default function NavigationShell({
  children,
}) {
  return (
    <div
      className="
        flex h-screen w-full
        bg-zinc-950
      "
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1 h-full
          overflow-y-auto
          bg-zinc-50 dark:bg-zinc-900
          transition-all duration-300 ease-in-out
        "
      >
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}