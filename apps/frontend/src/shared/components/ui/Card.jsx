export default function Card({ children, className = "" }) {
  return (
    <div className={`
      bg-surface 
      dark:bg-surface-dark 
      rounded-card 
      shadow-sm 
      border border-zinc-100 
      dark:border-zinc-800 
      p-6 
      ${className}
    `}>
      {children}
    </div>
  )
}