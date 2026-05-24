import StatCard from "../components/StatCard"
import SubmissionItem from "../components/SubmissionItem"
import { getDashboardStats, getRecentSubmissions } from "../services/api"

export default function DashboardPage() {
  // Chamamos os dados dos nossos serviços
  const stats = getDashboardStats()
  const submissions = getRecentSubmissions()

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Here is your operational validation overview.
        </p>
      </header>

      {/* GRID DE STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            label={stat.label} 
            value={stat.value} 
          />
        ))}
      </section>

      {/* LISTA DE SUBMISSÕES */}
      <section className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-white">
          Recent Submissions
        </h2>

        <div className="space-y-3">
          {submissions.map((doc) => (
            <SubmissionItem 
              key={doc.id}
              id={doc.id}
              time={doc.time}
              status={doc.status}
            />
          ))}
        </div>
      </section>
      
    </div>
  )
}