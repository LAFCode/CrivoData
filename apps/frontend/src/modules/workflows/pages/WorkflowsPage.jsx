import { useMemo, useState } from 'react'

import { Plus } from 'lucide-react'

import PageHeader from '@/shared/components/PageHeader'
import EmptyState from '@/shared/components/EmptyState'

import Button from '@/shared/components/ui/Button'

import WorkflowCard from '@/modules/workflows/components/WorkflowCard'
import WorkflowFilters from '@/modules/workflows/components/WorkflowFilters'

import { workflows } from '@/modules/workflows/data/mockWorkflows'

import { useNavigate } from 'react-router-dom'

export default function WorkflowsPage() {

  const navigate = useNavigate()

  const [search, setSearch] = useState('')

  const [selectedGroup, setSelectedGroup] =
    useState('All Groups')

  const [selectedStatus, setSelectedStatus] =
    useState('All Status')

  const filtered = useMemo(() => {
    return workflows.filter((workflow) => {
      const matchesSearch =
        workflow.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        workflow.group_name
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesGroup =
        selectedGroup === 'All Groups'
          ? true
          : workflow.group_name ===
            selectedGroup

      const matchesStatus =
        selectedStatus === 'All Status'
          ? true
          : workflow.status ===
            selectedStatus

      return (
        matchesSearch &&
        matchesGroup &&
        matchesStatus
      )
    })
  }, [
    search,
    selectedGroup,
    selectedStatus,
  ])

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Manage validation and operational workflows"
      >
        <Button
          className="gap-2 cursor-pointer"
          onClick={() => navigate('/workflows/new')}
        >
          <Plus className="h-4 w-4" />

          New Workflow
        </Button>
      </PageHeader>

      <WorkflowFilters
        search={search}
        onSearchChange={setSearch}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No workflows found"
          description="Try adjusting your filters."
        />
      ) : (
        <div
          className="
            grid
            grid-cols-1
            gap-5

            md:grid-cols-2
            2xl:grid-cols-3
          "
        >
          {filtered.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
            />
          ))}
        </div>
      )}
    </div>
  )
}