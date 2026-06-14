import { useState, useEffect } from 'react'
import Input from '@/shared/components/ui/Input'
import { lookupService } from '@/shared/services/lookupService'

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
  const [executionTypes, setExecutionTypes] = useState([])
  const [recurrenceTypes, setRecurrenceTypes] = useState([])
  const [timezones, setTimezones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [execRes, recRes, tzRes] = await Promise.all([
          lookupService.listExecutionTypes(),
          lookupService.listRecurrenceTypes(),
          lookupService.listTimezones(),
        ])
        setExecutionTypes(execRes.data || [])
        setRecurrenceTypes(recRes.data || [])
        setTimezones(tzRes.data || [])
      } catch (err) {
        console.error('Failed to fetch scheduling lookups:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function handlePresetChange(value) {
    setForm((prev) => ({
      ...prev,
      schedule_preset: value,
      cron_expression: cronPresets[value] || '',
    }))
  }

  // Find the recurrence type id for a given preset name
  function getRecurrenceTypeId(name) {
    const found = recurrenceTypes.find((rt) => rt.name === name)
    return found ? found.id : null
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

      {/* EXECUTION TYPE (from lookup table) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">
          Execution Type
        </label>
        <select
          value={form.execution_type_id || ''}
          disabled={loading}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              execution_type_id: e.target.value ? Number(e.target.value) : null,
            }))
          }
          className={`
            h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none
            ${errors.execution_type_id ? 'border-rose-300' : 'border-zinc-200'}
          `}
        >
          <option value="">
            {loading ? 'Loading...' : 'Select execution type'}
          </option>
          {executionTypes.map((et) => (
            <option key={et.id} value={String(et.id)}>
              {et.name.charAt(0).toUpperCase() + et.name.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.execution_type_id && (
          <p className="text-xs text-rose-600">{errors.execution_type_id}</p>
        )}
      </div>

      {/* SCHEDULED CONFIG */}
      {form.execution_type_id && executionTypes.find(
        (et) => et.id === Number(form.execution_type_id) && et.name === 'scheduled'
      ) && (
        <>
          {/* PRESET */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
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
                    onClick={() => {
                      handlePresetChange(preset.value)
                      // Auto-set recurrence_type_id from lookup
                      const rtId = getRecurrenceTypeId(preset.value)
                      if (rtId) {
                        setForm((prev) => ({
                          ...prev,
                          recurrence_type_id: rtId,
                        }))
                      }
                    }}
                    className={`
                      rounded-lg border px-3 py-1.5 text-xs font-medium transition-all
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

          {/* RECURRENCE TYPE (from lookup table) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Recurrence Type
            </label>
            <select
              value={form.recurrence_type_id || ''}
              disabled={loading}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  recurrence_type_id: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none"
            >
              <option value="">
                {loading ? 'Loading...' : 'Select recurrence'}
              </option>
              {recurrenceTypes.map((rt) => (
                <option key={rt.id} value={String(rt.id)}>
                  {rt.name.charAt(0).toUpperCase() + rt.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* CRON */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Cron Expression
            </label>
            <Input
              placeholder="0 8 * * *"
              value={form.cron_expression}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  cron_expression: e.target.value,
                }))
              }
            />
          </div>

          {/* TIMEZONE (from lookup table) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Timezone
            </label>
            <select
              value={form.timezone_id || ''}
              disabled={loading}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  timezone_id: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none"
            >
              <option value="">
                {loading ? 'Loading...' : 'Select timezone'}
              </option>
              {timezones.map((tz) => (
                <option key={tz.id} value={String(tz.id)}>
                  {tz.name} {tz.utc_offset ? `(${tz.utc_offset})` : ''}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  )
}
