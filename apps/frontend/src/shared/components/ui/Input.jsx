import { cn } from '@/shared/utils/cn'

export default function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        `
        h-11
        w-full
        rounded-2xl
        border
        border-zinc-200
        bg-white
        px-4
        text-sm
        outline-none
        transition-all

        focus:border-zinc-400
      `,
        props.className
      )}
    />
  )
}