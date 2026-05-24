import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import PageHeader from '@/shared/components/PageHeader'

import Button from '@/shared/components/ui/Button'
import Card from '@/shared/components/ui/Card'

import WorkflowBasicSection from '@/modules/workflows/components/forms/WorkflowBasicSection'
import WorkflowSchedulingSection from '@/modules/workflows/components/forms/WorkflowSchedulingSection'

const steps = [
  {
    id: 'basic',
    title: 'Basic Information',
    description:
      'Workflow identity and grouping',
  },

  {
    id: 'scheduling',
    title: 'Scheduling',
    description:
      'Execution frequency and cron',
  },

  {
    id: 'files',
    title: 'Files',
    description:
      'Expected files configuration',
  },

  {
    id: 'validation',
    title: 'Validation',
    description:
      'Validation rules and behavior',
  },
]

export default function WorkflowFormPage() {
  const navigate = useNavigate()

  const [activeStep, setActiveStep] =
    useState('basic')

  const [form, setForm] = useState({
    name: '',
    slug: '',

    workflow_group_id: '',
    workflow_subgroup_id: '',

    description: '',

    status: 'draft',

    scheduling_type: 'daily',

    cron_expression:
      '0 8 * * *',

    timezone: 'America/Sao_Paulo',
  })

  function handleSubmit(e) {
    e.preventDefault()

    console.log(form)
  }

  return (
    <div>
      <PageHeader
        title="New Workflow"
        description="Create and configure a workflow"
      />

      <form onSubmit={handleSubmit}>
        <div
          className="
            grid
            gap-6

            lg:grid-cols-[1fr_300px]
          "
        >
          {/* LEFT CONTENT */}
          <div>
            <Card className="space-y-6">
              {/* BASIC */}
              {activeStep ===
                'basic' && (
                <WorkflowBasicSection
                  form={form}
                  setForm={setForm}
                />
              )}

              {/* SCHEDULING */}
              {activeStep ===
                'scheduling' && (
                <WorkflowSchedulingSection
                  form={form}
                  setForm={setForm}
                />
              )}

              {/* EMPTY STATES */}
              {activeStep === 'files' && (
                <div className="py-16 text-center">
                  <h3
                    className="
                      text-lg
                      font-semibold
                      text-zinc-900
                    "
                  >
                    Files Configuration
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    This section will be
                    implemented next.
                  </p>
                </div>
              )}

              {activeStep ===
                'validation' && (
                <div className="py-16 text-center">
                  <h3
                    className="
                      text-lg
                      font-semibold
                      text-zinc-900
                    "
                  >
                    Validation Rules
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    This section will be
                    implemented next.
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-3
                  border-t
                  border-zinc-100
                  pt-6
                "
              >
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    navigate('/workflows')
                  }
                >
                  Cancel
                </Button>

                <Button type="submit">
                  Save Workflow
                </Button>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="h-fit">
            <Card className="space-y-2">
              {/* HEADER */}
              <div className="mb-4">
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wide
                    text-zinc-500
                  "
                >
                  Workflow Setup
                </h3>
              </div>

              {/* STEPS */}
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const isActive =
                    activeStep === step.id

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() =>
                        setActiveStep(
                          step.id
                        )
                      }
                      className={`
                        group
                        flex
                        w-full
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition-all

                        ${
                          isActive
                            ? `
                              border-zinc-900
                              bg-zinc-900
                              text-white
                              shadow-lg
                            `
                            : `
                              border-zinc-200
                              bg-white

                              hover:border-zinc-300
                              hover:bg-zinc-50
                            `
                        }
                      `}
                    >
                      {/* STEP NUMBER */}
                      <div
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          text-xs
                          font-semibold

                          ${
                            isActive
                              ? `
                                bg-white/20
                                text-white
                              `
                              : `
                                bg-zinc-100
                                text-zinc-600
                              `
                          }
                        `}
                      >
                        {index + 1}
                      </div>

                      {/* CONTENT */}
                      <div>
                        <p
                          className={`
                            text-sm
                            font-medium

                            ${
                              isActive
                                ? 'text-white'
                                : 'text-zinc-900'
                            }
                          `}
                        >
                          {step.title}
                        </p>

                        <p
                          className={`
                            mt-1
                            text-xs
                            leading-relaxed

                            ${
                              isActive
                                ? 'text-zinc-300'
                                : 'text-zinc-500'
                            }
                          `}
                        >
                          {
                            step.description
                          }
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* SUMMARY */}
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  p-4
                "
              >
                <h4
                  className="
                    mb-3
                    text-sm
                    font-semibold
                    text-zinc-900
                  "
                >
                  Workflow Summary
                </h4>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Status
                    </p>

                    <p className="text-sm font-medium text-zinc-900">
                      {form.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Group
                    </p>

                    <p className="text-sm font-medium text-zinc-900">
                      {form.workflow_group_id ||
                        '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Cron
                    </p>

                    <p
                      className="
                        break-all
                        font-mono
                        text-xs
                        text-zinc-700
                      "
                    >
                      {
                        form.cron_expression
                      }
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}