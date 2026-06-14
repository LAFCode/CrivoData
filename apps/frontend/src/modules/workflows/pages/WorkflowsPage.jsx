import { useMemo, useState, useEffect } from 'react'

import { Plus } from 'lucide-react'

import PageHeader from '@/shared/components/PageHeader'
import EmptyState from '@/shared/components/EmptyState'

import Button from '@/shared/components/ui/Button'

import WorkflowCard from '@/modules/workflows/components/WorkflowCard'
import WorkflowFilters from '@/modules/workflows/components/WorkflowFilters'

import { workflowService } from '@/modules/workflows/services/workflowService'

import { useNavigate } from 'react-router-dom'

export default function WorkflowsPage() {

  const navigate = useNavigate()

  const [workflows, setWorkflows] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')

  const [selectedGroup, setSelectedGroup] =

    useState('All Groups')

  const [selectedStatus, setSelectedStatus] =

    useState('All Status')

  useEffect(() => {

    fetchWorkflows()

  }, [])

  const fetchWorkflows = async () => {

    try {

      setLoading(true)

      const response = await workflowService.list()

      setWorkflows(response.data)

    } catch (err) {

      console.error('Failed to fetch workflows:', err)

      setError('Failed to load workflows')

    } finally {

      setLoading(false)

    }

  }

  const groups = useMemo(() => {

    const unique = [

      ...new Set(workflows.map((w) => w.workflow_group_id).filter((id) => id != null)),

    ]

    return ['All Groups', ...unique.map(String)]

  }, [workflows])

  const statuses = useMemo(() => {

    const unique = [

      ...new Set(workflows.map((w) => w.status_id).filter((id) => id != null)),

    ]

    return ['All Status', ...unique.map(String)]

  }, [workflows])

  const filtered = useMemo(() => {

    return workflows.filter((workflow) => {

      const matchesSearch =

        workflow.name

          .toLowerCase()

          .includes(search.toLowerCase())

      const matchesGroup =

        selectedGroup === 'All Groups'

          ? true

          : String(workflow.workflow_group_id) ===

            selectedGroup

      const matchesStatus =

        selectedStatus === 'All Status'

          ? true

          : String(workflow.status_id) ===

            selectedStatus

      return (

        matchesSearch &&

        matchesGroup &&

        matchesStatus

      )

    })

  }, [

    workflows,

    search,

    selectedGroup,

    selectedStatus,

  ])

  if (loading) {

    return (

      <div className="flex items-center justify-center h-64">

        <div className="text-gray-500">Loading workflows...</div>

      </div>

    )

  }

  if (error) {

    return (

      <div className="flex items-center justify-center h-64">

        <div className="text-red-500">{error}</div>

        <Button

          className="ml-4"

          onClick={fetchWorkflows}

        >

          Retry

        </Button>

      </div>

    )

  }

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

        groups={groups}

        selectedStatus={selectedStatus}

        onStatusChange={setSelectedStatus}

        statuses={statuses}

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
