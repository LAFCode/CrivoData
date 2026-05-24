import { Search } from 'lucide-react'

import Input from '@/shared/components/ui/Input'

import {
  groupOptions,
  statusOptions,
} from '@/modules/workflows/data/workflowOptions'

export default function WorkflowFilters({
  search,
  onSearchChange,

  selectedGroup,
  onGroupChange,

  selectedStatus,
  onStatusChange,
}) {
  return (
    <div
      className="
        mb-6
        flex
        flex-col
        gap-4

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      {/* SEARCH */}
      <div className="relative w-full max-w-md">
        <Search
          className="
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-zinc-400
          "
        />

        <Input
          placeholder="Search workflows..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          className="pl-10"
        />
      </div>

      {/* SELECTS */}
      <div className="flex gap-3">
        <select
          value={selectedGroup}
          onChange={(e) =>
            onGroupChange(e.target.value)
          }
          className="
            h-10
            rounded-xl
            border
            border-zinc-200
            bg-white
            px-3
            text-sm
            outline-none
          "
        >
          {groupOptions.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
          className="
            h-10
            rounded-xl
            border
            border-zinc-200
            bg-white
            px-3
            text-sm
            outline-none
          "
        >
          {statusOptions.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}