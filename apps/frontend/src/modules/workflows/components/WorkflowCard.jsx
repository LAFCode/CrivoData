import {
  Calendar,
  Clock3,
  Layers3,
  Play,
  MoreHorizontal,
  AlertTriangle,
} from 'lucide-react'

import Card from '@/shared/components/ui/Card'
import Button from '@/shared/components/ui/Button'
import StatusBadge from '@/shared/components/StatusBadge'

export default function WorkflowCard({
  workflow,
}) {
  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        border
        border-zinc-200
        transition-all
        duration-200

        hover:-translate-y-1
        hover:border-zinc-300
        hover:shadow-xl
      "
    >
      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-zinc-100
            "
          >
            <Layers3 className="h-5 w-5 text-zinc-700" />
          </div>

          <div>
            <span
              className="
                rounded-full
                bg-zinc-100
                px-2.5
                py-1
                text-xs
                font-medium
                text-zinc-600
              "
            >
              {workflow.workflow_group_id ? `Group #${workflow.workflow_group_id}` : 'No Group'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={workflow.status_id} />

          <button
            className="
              rounded-lg
              p-1.5
              text-zinc-500
              transition-colors

              hover:bg-zinc-100
            "
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="mb-5">
        <h3
          className="
            mb-2
            text-lg
            font-semibold
            text-zinc-900
          "
        >
          {workflow.name}
        </h3>

        <p
          className="
            line-clamp-2
            text-sm
            leading-relaxed
            text-zinc-500
          "
        >
          {workflow.description}
        </p>
      </div>

      {/* TYPE */}
      <div className="mb-5">
        <span
          className="
            rounded-xl
            border
            border-zinc-200
            bg-zinc-50
            px-3
            py-1.5
            text-xs
            font-medium
            text-zinc-700
          "
        >
          {workflow.workflow_type_id ? `Type #${workflow.workflow_type_id}` : 'No Type'}
        </span>
      </div>

      {/* METRICS */}
      <div
        className="
          mb-5
          grid
          grid-cols-2
          gap-3
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-zinc-100
            bg-zinc-50
            p-3
          "
        >
          <p className="mb-1 text-xs text-zinc-500">
            Expected Files
          </p>

          <strong className="text-base">
            {workflow.expected_files_count}
          </strong>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-zinc-100
            bg-zinc-50
            p-3
          "
        >
          <p className="mb-1 text-xs text-zinc-500">
            Pending
          </p>

          <div className="flex items-center gap-1">
            {workflow.pending_executions > 0 && (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            )}

            <strong className="text-base">
              {workflow.pending_executions}
            </strong>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div
        className="
          mb-6
          space-y-3
          border-t
          border-zinc-100
          pt-4
          text-sm
        "
      >
        <div className="flex items-center gap-2 text-zinc-600">
          <Clock3 className="h-4 w-4" />

          <span>
            Last execution:{' '}
            <strong>
              {workflow.last_execution_at}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-600">
          <Calendar className="h-4 w-4" />

          <span>
            Next execution:{' '}
            <strong>
              {workflow.next_execution_at}
            </strong>
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center gap-3">
        <Button className="flex-1 gap-2">
          <Play className="h-4 w-4" />
          Run
        </Button>

        <Button
          variant="secondary"
          className="flex-1"
        >
          Details
        </Button>
      </div>
    </Card>
  )
}
