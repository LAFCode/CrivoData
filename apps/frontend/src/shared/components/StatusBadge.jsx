import {
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'

import Badge from '@/shared/components/ui/Badge'

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className:
      'bg-yellow-100 text-yellow-700 border-yellow-200',
  },

  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    className:
      'bg-green-100 text-green-700 border-green-200',
  },

  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className:
      'bg-red-100 text-red-700 border-red-200',
  },
}

export default function StatusBadge({
  status,
}) {
  const config =
    statusConfig[status] ||
    statusConfig.pending

  const Icon = config.icon

  return (
    <Badge className={config.className}>
      <Icon className="mr-1 h-3 w-3" />

      {config.label}
    </Badge>
  )
}