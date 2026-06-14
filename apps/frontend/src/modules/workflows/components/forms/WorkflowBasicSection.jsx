import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Input from '@/shared/components/ui/Input'
import { groupService } from '@/shared/services/groupService'
import { lookupService } from '@/shared/services/lookupService'

export default function WorkflowBasicSection({
  form,
  setForm,
  errors = {},
}) {
  const { t } = useTranslation()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [statuses, setStatuses] = useState([])
  const [workflowTypes, setWorkflowTypes] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setFetchError(null)
        const [groupsRes, statusesRes, typesRes] = await Promise.all([
          groupService.list(),
          lookupService.listWorkflowStatuses(),
          lookupService.listWorkflowTypes(),
        ])
        setGroups(groupsRes.data || [])
        setStatuses(statusesRes.data || [])
        setWorkflowTypes(typesRes.data || [])
      } catch (err) {
        console.error('Failed to fetch lookup data:', err)
        setFetchError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function handleNameChange(value) {
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: generatedSlug,
    }))
  }

  // Flatten groups into a list of all groups (top-level + children)
  // Indent children under their parent for visual hierarchy
  const allGroups = groups.flatMap((g) => [
    { ...g, indent: false },
    ...(g.children || []).map((child) => ({ ...child, indent: true })),
  ])

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">
          {t('workflows.basicInformation')}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {t('workflows.basicInformationDescription')}
        </p>
      </div>

      {/* WORKFLOW IDENTITY */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {t('workflows.workflowIdentity')}
          </h3>
        </div>

        {/* NAME + SLUG */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* NAME */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-700">
              {t('workflows.workflowName')}
            </label>
            <Input
              id="name"
              placeholder={t('workflows.workflowNamePlaceholder')}
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={errors.name ? 'border-rose-300 focus:border-rose-400' : ''}
            />
            {errors.name ? (
              <p className="text-xs text-rose-600">{errors.name}</p>
            ) : (
              <p className="text-xs text-zinc-500">
                {t('workflows.workflowNameHelp')}
              </p>
            )}
          </div>

          {/* SLUG */}
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
              {t('workflows.workflowSlug')}
            </label>
            <Input id="slug" value={form.slug} disabled />
            <p className="text-xs text-zinc-500">
              {t('workflows.workflowSlugHelp')}
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-zinc-700">
            {t('workflows.description')}
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder={t('workflows.descriptionPlaceholder')}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-zinc-400"
          />
          <p className="text-xs text-zinc-500">
            {t('workflows.descriptionHelp')}
          </p>
        </div>
      </div>

      {/* ORGANIZATION */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {t('workflows.organization')}
          </h3>
        </div>

        {/* GROUP (single select with all groups including children) */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="group" className="text-sm font-medium text-zinc-700">
              {t('workflows.workflowGroup')}
            </label>
            <select
              id="group"
              value={form.workflow_group_id}
              disabled={loading}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  workflow_group_id: e.target.value,
                }))
              }
              className={`
                h-11 w-full rounded-2xl border bg-white px-3 text-sm outline-none transition-colors
                focus:border-zinc-400
                disabled:cursor-not-allowed disabled:bg-zinc-100
                ${errors.workflow_group_id ? 'border-rose-300' : 'border-zinc-200'}
              `}
            >
              <option value="">
                {loading
                  ? t('workflows.loading') || 'Loading...'
                  : t('workflows.workflowGroupPlaceholder')
                }
              </option>
              {allGroups.map((group) => (
                <option key={group.id} value={String(group.id)}>
                  {group.indent ? '\u00A0\u00A0\u00A0\u00A0\u2514 ' : ''}
                  {group.name}
                </option>
              ))}
            </select>
            {fetchError && (
              <p className="text-xs text-rose-600">{fetchError}</p>
            )}
            {errors.workflow_group_id ? (
              <p className="text-xs text-rose-600">{errors.workflow_group_id}</p>
            ) : (
              !fetchError && (
                <p className="text-xs text-zinc-500">
                  {t('workflows.workflowGroupHelp')}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* LIFECYCLE */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {t('workflows.lifecycle')}
          </h3>
        </div>

        {/* STATUS (from lookup table) */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-zinc-700">
              {t('workflows.workflowStatus')}
            </label>
            <select
              id="status"
              value={form.status_id || ''}
              disabled={loading}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status_id: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-400"
            >
              <option value="">
                {loading ? 'Loading...' : 'Select status'}
              </option>
              {statuses.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-500">
              {t('workflows.workflowStatusHelp')}
            </p>
          </div>

          {/* WORKFLOW TYPE (from lookup table) */}
          <div className="space-y-2">
            <label htmlFor="workflow_type" className="text-sm font-medium text-zinc-700">
              {t('workflows.workflowType') || 'Workflow Type'}
            </label>
            <select
              id="workflow_type"
              value={form.workflow_type_id || ''}
              disabled={loading}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  workflow_type_id: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-3 text-sm outline-none transition-colors focus:border-zinc-400"
            >
              <option value="">
                {loading ? 'Loading...' : 'Select type'}
              </option>
              {workflowTypes.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-500">
              Defines the validation mode for this workflow
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
