const variants = {
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
      ${variants[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
}