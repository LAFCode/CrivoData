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
          className="
            h-11
            w-full
            rounded-xl
            border
            border-zinc-200
            bg-white
            px-3
            text-sm
            outline-none
          "
        >
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

            <select
              value={form.schedule_preset}
              onChange={(e) =>
                handlePresetChange(
                  e.target.value
                )
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-3
                text-sm
                outline-none
              "
            >
              <option value="">
                Select preset
              </option>

              <option value="hourly">
                Hourly
              </option>

              <option value="daily">
                Daily
              </option>

              <option value="weekly">
                Weekly
              </option>

              <option value="monthly">
                Monthly
              </option>
            </select>
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

          {/* ENABLED */}
          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-zinc-200
              p-4
            "
          >
            <div>
              <p className="font-medium text-zinc-900">
                Enable Workflow
              </p>

              <p className="text-sm text-zinc-500">
                Allow automatic execution
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.is_enabled}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  is_enabled:
                    e.target.checked,
                }))
              }
            />
          </div>
        </>
      )}
    </div>
  )
}