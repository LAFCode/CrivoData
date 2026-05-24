export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
          <Icon className="h-6 w-6 text-zinc-500" />
        </div>
      )}

      <h3 className="mb-1 text-lg font-semibold">
        {title}
      </h3>

      {description && (
        <p className="max-w-sm text-sm text-zinc-500">
          {description}
        </p>
      )}

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}