export default function PageHeader({
  title,
  description,
  children,
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-zinc-500">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  )
}