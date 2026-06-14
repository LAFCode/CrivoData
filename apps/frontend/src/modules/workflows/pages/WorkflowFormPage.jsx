import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

import PageHeader from '@/shared/components/PageHeader'
import Button from '@/shared/components/ui/Button'
import Card from '@/shared/components/ui/Card'

import WorkflowBasicSection from '@/modules/workflows/components/forms/WorkflowBasicSection'
import WorkflowSchedulingSection from '@/modules/workflows/components/forms/WorkflowSchedulingSection'
import WorkflowValidationSection from '@/modules/workflows/components/forms/WorkflowValidationSection'

import { workflowService } from '@/modules/workflows/services/workflowService'

const steps = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Workflow identity and grouping',
  },
  {
    id: 'scheduling',
    title: 'Scheduling',
    description: 'Execution frequency and cron',
  },
  {
    id: 'validation',
    title: 'Validation',
    description: 'Validation rules and behavior',
  },
]

export default function WorkflowFormPage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState('basic')
  const [savedWorkflowId, setSavedWorkflowId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    workflow_group_id: '',
    workflow_subgroup_id: '',
    description: '',
    status: 'draft',
    scheduling_type: 'daily',
    cron_expression: '0 8 * * *',
    timezone: 'America/Sao_Paulo',
    
    // Configurações Gerais do Workflow
    validation_type: 'strict',
    allow_empty_files: false,
    max_error_threshold: 0,
    
    // Lista de arquivos esperados
    files: [],
  })

  const [validationErrors, setValidationErrors] = useState({})
  const [notification, setNotification] = useState(null)

  function validateStep(stepId) {
    const errors = {}

    if (stepId === 'basic' || stepId === '__all__') {
      if (!form.name.trim()) {
        errors.name = 'Workflow name is required'
      }
      if (!form.workflow_group_id) {
        errors.workflow_group_id = 'Select a group'
      }
    }

    if (stepId === 'scheduling') {
      if (!form.execution_type) {
        errors.execution_type = 'Select an execution type'
      }
    }

    if (stepId === 'validation' || stepId === '__all__') {
      if (form.files.length === 0) {
        errors.files = 'Add at least one expected file'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function collectAllErrors() {
    const allErrors = {}

    if (!form.name.trim()) {
      allErrors.name = 'Workflow name is required'
    }

    if (!form.workflow_group_id) {
      allErrors.workflow_group_id = 'Select a group'
    }

    if (!form.execution_type) {
      allErrors.execution_type = 'Select an execution type'
    }

    if (form.files.length === 0) {
      allErrors.files = 'Add at least one expected file'
    }

    return allErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const allErrors = collectAllErrors()
    setValidationErrors(allErrors)

    if (Object.keys(allErrors).length > 0) {
      // Scroll to the first step with errors
      if (allErrors.name || allErrors.workflow_group_id) setActiveStep('basic')
      else if (allErrors.execution_type) setActiveStep('scheduling')
      else if (allErrors.files) setActiveStep('validation')

      const missing = []
      if (allErrors.name) missing.push('Workflow name')
      if (allErrors.workflow_group_id) missing.push('Group')
      if (allErrors.execution_type) missing.push('Execution type')
      if (allErrors.files) missing.push('At least one expected file')

      setNotification({
        type: 'error',
        message: `Missing: ${missing.join(', ')}.`,
      })
      return
    }

    try {
      if (savedWorkflowId) {
        await workflowService.update(savedWorkflowId, {
          name: form.name,
          description: form.description,
          status: form.status,
          workflow_type: form.validation_type,
          group_name: form.workflow_group_id,
          recurrence_type: form.scheduling_type,
          expected_files_count: form.files.length,
        })
      } else {
        await workflowService.create({
          name: form.name,
          description: form.description,
          status: form.status,
          workflow_type: form.validation_type,
          group_name: form.workflow_group_id,
          recurrence_type: form.scheduling_type,
          expected_files_count: form.files.length,
        })
      }

      setNotification({
        type: 'success',
        message: 'Workflow saved successfully!',
      })
      setTimeout(() => navigate('/workflows'), 800)
    } catch (err) {
      console.error('Failed to save workflow:', err)
      setNotification({
        type: 'error',
        message: 'Failed to save workflow. Try again.',
      })
    }
  }

  const handleNextStep = useCallback(() => {
    const currentIndex = steps.findIndex(s => s.id === activeStep)

    // Validate current step before advancing
    if (!validateStep(activeStep)) {
      setNotification({
        type: 'error',
        message: 'Fix the highlighted fields before continuing.',
      })
      return
    }

    setActiveStep(steps[currentIndex + 1].id)
  }, [activeStep, form, savedWorkflowId])

  // Cálculos dinâmicos para o sumário lateral baseado na tipagem camelCase
  const totalFiles = form.files.length
  const totalTypesConfigured = form.files.reduce((acc, file) => acc + (file.columns?.length || 0), 0)
  const totalLogicsConfigured = form.files.reduce((acc, file) => acc + (file.customRules?.length || 0), 0)

  return (
    <div>
      <PageHeader
        title="New Workflow"
        description="Create and configure a workflow"
      />

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-medium shadow-md transition-all duration-300 ${
          notification.type === 'error'
            ? 'border-rose-100 bg-rose-50 text-rose-800'
            : 'border-zinc-900 bg-zinc-900 text-white'
        }`}>
          {notification.type === 'error' ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          ) : (
            <svg className="h-4 w-4 shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="ml-auto text-zinc-400 hover:text-zinc-600"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          
          {/* LEFT CONTENT */}
          <div>
            <Card className="space-y-6">
              
              {/* BASIC - Mantido na DOM, visibilidade via CSS */}
              <div className={activeStep === 'basic' ? 'block' : 'hidden'}>
                <WorkflowBasicSection
                  form={form}
                  setForm={setForm}
                  errors={validationErrors}
                />
              </div>

              {/* SCHEDULING - Mantido na DOM, visibilidade via CSS */}
              <div className={activeStep === 'scheduling' ? 'block' : 'hidden'}>
                <WorkflowSchedulingSection
                  form={form}
                  setForm={setForm}
                  errors={validationErrors}
                />
              </div>

              {/* VALIDATION - Mantido na DOM, visibilidade via CSS */}
              <div className={activeStep === 'validation' ? 'block' : 'hidden'}>
                <WorkflowValidationSection
                  files={form.files}
                  setFiles={(updatedFiles) => 
                    setForm((prev) => ({ ...prev, files: updatedFiles }))
                  }
                  errors={validationErrors}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
                <div>
                  {activeStep !== 'basic' ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const currentIndex = steps.findIndex(s => s.id === activeStep)
                        setActiveStep(steps[currentIndex - 1].id)
                      }}
                    >
                      Back
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/workflows')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeStep !== 'validation' ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button type="submit">
                      Save Workflow
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="h-fit">
            <Card className="space-y-2">
              <div className="mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  Workflow Setup
                </h3>
              </div>

              {/* STEPS */}
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const isActive = activeStep === step.id

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStep(step.id)}
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
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
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
                              ? 'bg-white/20 text-white'
                              : 'bg-zinc-100 text-zinc-600'
                          }
                        `}
                      >
                        {index + 1}
                      </div>

                      {/* CONTENT */}
                      <div>
                        <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-900'}`}>
                          {step.title}
                        </p>
                        <p className={`mt-1 text-xs leading-relaxed ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          {step.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* SUMMARY */}
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-zinc-900">
                  Workflow Summary
                </h4>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-zinc-500">Status</p>
                    <p className="text-sm font-medium text-zinc-900 capitalize">{form.status}</p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Group</p>
                    <p className="text-sm font-medium text-zinc-900">{form.workflow_group_id || '-'}</p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Validation Mode</p>
                    <p className="text-sm font-medium text-zinc-900 capitalize">{form.validation_type}</p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Expected Files</p>
                    <p className="text-sm font-medium text-zinc-900">
                      {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
                    </p>
                  </div>

                  {totalFiles > 0 && (
                    <div>
                      <p className="text-xs text-zinc-500">Total Pipeline Rules</p>
                      <p className="text-xs font-medium text-zinc-700">
                        {totalTypesConfigured} Types / {totalLogicsConfigured} Assertions
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-zinc-500">Cron</p>
                    <p className="break-all font-mono text-xs text-zinc-700">{form.cron_expression}</p>
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