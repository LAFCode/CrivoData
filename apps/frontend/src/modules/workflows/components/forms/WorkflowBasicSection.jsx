import { useTranslation } from 'react-i18next'

import Input from '@/shared/components/ui/Input'

export default function WorkflowBasicSection({
  form,
  setForm,
  errors = {},
}) {
  const { t } = useTranslation()

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

  const subgroupOptions = {
    hr: [
      {
        value: 'payroll',
        label: t(
          'workflows.payroll'
        ),
      },

      {
        value: 'recruitment',
        label: t(
          'workflows.recruitment'
        ),
      },

      {
        value: 'benefits',
        label: t(
          'workflows.benefits'
        ),
      },
    ],

    finance: [
      {
        value: 'accounts-payable',
        label: t(
          'workflows.accountsPayable'
        ),
      },

      {
        value:
          'accounts-receivable',

        label: t(
          'workflows.accountsReceivable'
        ),
      },

      {
        value: 'billing',

        label: t(
          'workflows.billing'
        ),
      },
    ],

    operations: [
      {
        value: 'logistics',

        label: t(
          'workflows.logistics'
        ),
      },

      {
        value: 'supply-chain',

        label: t(
          'workflows.supplyChain'
        ),
      },
    ],
  }

  const availableSubgroups =
    subgroupOptions[
      form.workflow_group_id
    ] || []

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">
          {t(
            'workflows.basicInformation'
          )}
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          {t(
            'workflows.basicInformationDescription'
          )}
        </p>
      </div>

      {/* WORKFLOW IDENTITY */}
      <div className="space-y-6">
        <div>
          <h3
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-zinc-500
            "
          >
            {t(
              'workflows.workflowIdentity'
            )}
          </h3>
        </div>

        {/* NAME + SLUG */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* NAME */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="
                text-sm
                font-medium
                text-zinc-700
              "
            >
              {t(
                'workflows.workflowName'
              )}
            </label>

            <Input
              id="name"
              placeholder={t(
                'workflows.workflowNamePlaceholder'
              )}
              value={form.name}
              onChange={(e) =>
                handleNameChange(
                  e.target.value
                )
              }
              className={errors.name ? 'border-rose-300 focus:border-rose-400' : ''}
            />

            {errors.name ? (
              <p className="text-xs text-rose-600">{errors.name}</p>
            ) : (
              <p className="text-xs text-zinc-500">
                {t(
                  'workflows.workflowNameHelp'
                )}
              </p>
            )}
          </div>

          {/* SLUG */}
          <div className="space-y-2">
            <label
              htmlFor="slug"
              className="
                text-sm
                font-medium
                text-zinc-700
              "
            >
              {t(
                'workflows.workflowSlug'
              )}
            </label>

            <Input
              id="slug"
              value={form.slug}
              disabled
            />

            <p className="text-xs text-zinc-500">
              {t(
                'workflows.workflowSlugHelp'
              )}
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="
              text-sm
              font-medium
              text-zinc-700
            "
          >
            {t(
              'workflows.description'
            )}
          </label>

          <textarea
            id="description"
            rows={5}
            placeholder={t(
              'workflows.descriptionPlaceholder'
            )}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,

                description:
                  e.target.value,
              }))
            }
            className="
              w-full
              rounded-2xl
              border
              border-zinc-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition-colors

              focus:border-zinc-400
            "
          />

          <p className="text-xs text-zinc-500">
            {t(
              'workflows.descriptionHelp'
            )}
          </p>
        </div>
      </div>

      {/* ORGANIZATION */}
      <div className="space-y-6">
        <div>
          <h3
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-zinc-500
            "
          >
            {t(
              'workflows.organization'
            )}
          </h3>
        </div>

        {/* GROUP + SUBGROUP */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* GROUP */}
          <div className="space-y-2">
            <label
              htmlFor="group"
              className="
                text-sm
                font-medium
                text-zinc-700
              "
            >
              {t(
                'workflows.workflowGroup'
              )}
            </label>

            <select
              id="group"
              value={form.workflow_group_id}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  workflow_group_id:
                    e.target.value,

                  workflow_subgroup_id:
                    '',
                }))
              }
              className={`
                h-11
                w-full
                rounded-2xl
                border
                bg-white
                px-3
                text-sm
                outline-none
                transition-colors

                focus:border-zinc-400
                ${errors.workflow_group_id ? 'border-rose-300' : 'border-zinc-200'}
              `}
            >
              <option value="">
                {t(
                  'workflows.workflowGroupPlaceholder'
                )}
              </option>

              <option value="hr">
                {t(
                  'workflows.humanResources'
                )}
              </option>

              <option value="finance">
                {t(
                  'workflows.finance'
                )}
              </option>

              <option value="operations">
                {t(
                  'workflows.operations'
                )}
              </option>
            </select>

            {errors.workflow_group_id ? (
              <p className="text-xs text-rose-600">{errors.workflow_group_id}</p>
            ) : (
              <p className="text-xs text-zinc-500">
                {t(
                  'workflows.workflowGroupHelp'
                )}
              </p>
            )}
          </div>

          {/* SUBGROUP */}
          <div className="space-y-2">
            <label
              htmlFor="subgroup"
              className="
                text-sm
                font-medium
                text-zinc-700
              "
            >
              {t(
                'workflows.workflowSubgroup'
              )}
            </label>

            <select
              id="subgroup"
              value={
                form.workflow_subgroup_id
              }
              disabled={
                !form.workflow_group_id
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  workflow_subgroup_id:
                    e.target.value,
                }))
              }
              className="
                h-11
                w-full
                rounded-2xl
                border
                border-zinc-200
                bg-white
                px-3
                text-sm
                outline-none
                transition-colors

                focus:border-zinc-400

                disabled:cursor-not-allowed
                disabled:bg-zinc-100
              "
            >
              <option value="">
                {t(
                  'workflows.workflowSubgroupPlaceholder'
                )}
              </option>

              {availableSubgroups.map(
                (subgroup) => (
                  <option
                    key={subgroup.value}
                    value={subgroup.value}
                  >
                    {subgroup.label}
                  </option>
                )
              )}
            </select>

            <p className="text-xs text-zinc-500">
              {t(
                'workflows.workflowSubgroupHelp'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* LIFECYCLE */}
      <div className="space-y-6">
        <div>
          <h3
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-zinc-500
            "
          >
            {t(
              'workflows.lifecycle'
            )}
          </h3>
        </div>

        {/* STATUS */}
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="
              text-sm
              font-medium
              text-zinc-700
            "
          >
            {t(
              'workflows.workflowStatus'
            )}
          </label>

          <select
            id="status"
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,

                status: e.target.value,
              }))
            }
            className="
              h-11
              w-full
              rounded-2xl
              border
              border-zinc-200
              bg-white
              px-3
              text-sm
              outline-none
              transition-colors

              focus:border-zinc-400
            "
          >
            <option value="draft">
              {t(
                'workflows.draft'
              )}
            </option>

            <option value="active">
              {t(
                'workflows.active'
              )}
            </option>

            <option value="paused">
              {t(
                'workflows.paused'
              )}
            </option>

            <option value="archived">
              {t(
                'workflows.archived'
              )}
            </option>
          </select>

          <p className="text-xs text-zinc-500">
            {t(
              'workflows.workflowStatusHelp'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}