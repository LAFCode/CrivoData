import { cn } from '@/shared/utils/cn'

export default function Button({
  children,
  className,
  ...props
}) {
  return (
    <button
      {...props}
      className={cn(
        `
        flex
        items-center
        justify-center
        rounded-2xl
        bg-black
        px-4
        py-2
        text-sm
        font-medium
        text-white
        transition-all

        hover:opacity-90
      `,
        className
      )}
    >
      {children}
    </button>
  )
}