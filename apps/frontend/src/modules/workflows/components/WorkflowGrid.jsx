import WorkflowCard from './WorkflowCard'

export default function WorkflowGrid({
  workflows,
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5

        md:grid-cols-2
        2xl:grid-cols-3
      "
    >
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
        />
      ))}
    </div>
  )
}