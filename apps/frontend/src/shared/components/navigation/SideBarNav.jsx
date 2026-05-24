import SidebarItem from './SidebarItem'

export default function SidebarNav({
  items,
  collapsed,
}) {
  return (
    <div
      className="
        flex-1
        overflow-y-auto
        overflow-x-hidden
        p-4
      "
    >
      <div className="flex flex-col gap-1">
        {items.map((item, index) => (
          <SidebarItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}