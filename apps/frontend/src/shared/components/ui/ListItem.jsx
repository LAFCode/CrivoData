export default function ListItem({ children, className = "", onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center justify-between 
        rounded-card 
        border border-zinc-100 
        p-4 
        hover:bg-brand-light 
        dark:border-zinc-800 
        dark:hover:bg-zinc-800/50 
        transition-all 
        ${onClick ? "cursor-pointer" : ""} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}