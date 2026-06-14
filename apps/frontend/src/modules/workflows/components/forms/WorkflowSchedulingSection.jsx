import Input from '@/shared/components/ui/Input'

const cronPresets = {
  hourly: '0 * * * *',

  daily: '0 8 * * *',

  weekly: '0 8 * * 1',

  monthly: '0 8 1 * *',
}

export default function WorkflowSchedulingSection({
  form,
  setForm,
  errors = {},
}) {
  function handlePresetChange(value) {
    setForm((prev) => ({
      ...prev,

      schedule_preset: value,

      cron_expression:
        cronPresets[value] || '',
    }))
  }

  return (
    <div className="space-y-6 border-t border-zinc-100 pt-6">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">
          Scheduling Configuration
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Configure workflow execution
        </p>
      </div>

      {/* EXECUTION TYPE */}
      <div className="space-y-2">
        <label
          className="
            text-sm
            font-medium
            text-zinc-700
          "
        >
          Execution Type
        </label>

        <select
          value={form.execution_type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,

              execution_type:
                e.target.value,
            }))
          }
          className={`
            h-11
            w-full
            rounded-xl
            border
            bg-white
            px-3
            text-sm
            outline-none
            ${errors.execution_type ? 'border-rose-300' : 'border-zinc-200'}
          `}
        >
          <option value="">
            Select execution type
          </option>

          <option value="manual">
            Manual
          </option>

          <option value="scheduled">
            Scheduled
          </option>

          <option value="event_driven">
            Event Driven
          </option>
        </select>

        {errors.execution_type && (
          <p className="text-xs text-rose-600">{errors.execution_type}</p>
        )}
      </div>

      {/* SCHEDULED CONFIG */}
      {form.execution_type ===
        'scheduled' && (
        <>
          {/* PRESET */}
          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-zinc-700
              "
            >
              Schedule Preset
            </label>

            <div className="flex flex-wrap gap-1.5">
              {[
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ].map((preset) => {
                const isSelected = form.schedule_preset === preset.value

                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() =>
                      handlePresetChange(
                        preset.value
                      )
                    }
                    className={`
                      rounded-lg
                      border
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      transition-all
                      ${
                        isSelected
                          ? 'border-zinc-800 bg-zinc-800 text-white'
                          : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* CRON */}
          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-zinc-700
              "
            >
              Cron Expression
            </label>

            <Input
              placeholder="0 8 * * *"
              value={form.cron_expression}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  cron_expression:
                    e.target.value,
                }))
              }
            />
          </div>

          {/* TIMEZONE */}
          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-zinc-700
              "
            >
              Timezone
            </label>

            <Input
              value={form.timezone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  timezone:
                    e.target.value,
                }))
              }
            />
          </div>

        </>
      )}
    </div>
  )
}