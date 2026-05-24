import {
  FileSpreadsheet,
  FileText,
  File,
} from 'lucide-react'

const config = {
  xlsx: {
    icon: FileSpreadsheet,
    className:
      'bg-green-100 text-green-700',
  },

  csv: {
    icon: FileSpreadsheet,
    className:
      'bg-blue-100 text-blue-700',
  },

  pdf: {
    icon: FileText,
    className:
      'bg-red-100 text-red-700',
  },
}

export default function FileTypeIcon({
  type,
}) {
  const item = config[type] || {
    icon: File,
    className:
      'bg-zinc-100 text-zinc-700',
  }

  const Icon = item.icon

  return (
    <div
      className={`
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl

        ${item.className}
      `}
    >
      <Icon className="h-5 w-5" />
    </div>
  )
}