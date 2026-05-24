import Card from "@/shared/components/ui/Card"

export default function StatCard({ label, value }) {
  return (
    <Card>
      {/* Usando a cor cinza padrão para o label */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
        {label}
      </p>
      
      {/* Usando a sua nova cor 'brand-main' para o valor principal */}
      <h2 className="mt-3 text-4xl font-bold text-brand-main dark:text-white">
        {value}
      </h2>
    </Card>
  )
}