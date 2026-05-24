import React from 'react'
import { Plus, Trash2, FileCode } from 'lucide-react'

export default function WorkflowValidationSection({ form, setForm }) {
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // --- GERENCIAMENTO DE ARQUIVOS (PAI) ---
  const addFileBlock = () => {
    setForm((prev) => ({
      ...prev,
      files: [
        ...prev.files,
        {
          file_pattern: '',
          required_columns: '',
          not_null_columns: '',
          column_types: [],
          custom_rules: [],
        },
      ],
    }))
  }

  const removeFileBlock = (fileIdx) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, idx) => idx !== fileIdx),
    }))
  }

  const handleFileMetaChange = (fileIdx, field, value) => {
    setForm((prev) => {
      const updatedFiles = [...prev.files]
      updatedFiles[fileIdx] = { ...updatedFiles[fileIdx], [field]: value }
      return { ...prev, files: updatedFiles }
    })
  }

  // --- GERENCIAMENTO DE TIPOS DE COLUNA (POR ARQUIVO) ---
  const addColumnType = (fileIdx) => {
    setForm((prev) => {
      const updatedFiles = [...prev.files]
      updatedFiles[fileIdx].column_types = [
        ...updatedFiles[fileIdx].column_types,
        { column: '', type: 'string' },
      ]
      return { ...prev, files: updatedFiles }
    })
  }

  const removeColumnType = (fileIdx, typeIdx) => {
    setForm((prev) => {
      const updatedFiles = [...prev.files]
      updatedFiles[fileIdx].column_types = updatedFiles[fileIdx].column_types.filter(
        (_, idx) => idx !== typeIdx
      )
      return { ...prev, files: updatedFiles }
    })
  }

  const handleColumnTypeChange = (fileIdx, typeIdx, field, value) => {
    setForm((prev) => {
      const updatedFiles = [...prev.files]
      const updatedTypes = [...updatedFiles[fileIdx].column_types]
      updatedTypes[typeIdx] = { ...updatedTypes[typeIdx], [field]: value }
      updatedFiles[fileIdx].column_types = updatedTypes
      return { ...prev, files: updatedFiles }
    })
  }

  // --- GERENCIAMENTO DE REGRAS CUSTOMIZADAS (POR ARQUIVO) ---
  const addCustomRule = (fileIdx) => {
    setForm((prev) => {
      const updatedFiles = [...prev.files]
      updatedFiles[fileIdx].custom_rules = [
        ...updatedFiles[fileIdx].custom_rules,
        { column: '', operator: '>=', value: '' },
      ]
      return { ...prev, files: updatedFiles }
    })
  }

  const removeCustomRule = (fileIdx, ruleIdx) => {
    setForm((prev) => {
      const updatedFiles = [...prev.files]
      updatedFiles[fileIdx].custom_rules = updatedFiles[fileIdx].custom_rules.filter(
        (_, idx) => idx !== ruleIdx
      )
      return { ...prev, files: updatedFiles }
    })
  }

  const handleCustomRuleChange = (fileIdx, ruleIdx, field, value) => {
    setForm((prev) => {
      const updatedFiles = [...prev.files]
      const updatedRules = [...updatedFiles[fileIdx].custom_rules]
      updatedRules[ruleIdx] = { ...updatedRules[ruleIdx], [field]: value }
      updatedFiles[fileIdx].custom_rules = updatedRules
      return { ...prev, files: updatedFiles }
    })
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-lg font-medium text-zinc-900">Validation Rules</h3>
        <p className="text-sm text-zinc-500">
          Configure multi-file ingestion packages and specify structural or logic rules for each file type.
        </p>
      </div>

      {/* CONFIGURAÇÕES GERAIS DO WORKFLOW */}
      <div className="grid gap-4 sm:grid-cols-2 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="validation_type" className="text-sm font-medium text-zinc-700">
            Validation Type
          </label>
          <select
            id="validation_type"
            name="validation_type"
            value={form.validation_type}
            onChange={handleChange}
            className="rounded-lg border border-zinc-200 bg-white p-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          >
            <option value="strict">Strict (Fail package on any mismatch)</option>
            <option value="permissive">Permissive (Log errors, continue execution)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="max_error_threshold" className="text-sm font-medium text-zinc-700">
            Global Max Error Threshold (Rows)
          </label>
          <input
            id="max_error_threshold"
            type="number"
            name="max_error_threshold"
            min="0"
            value={form.max_error_threshold}
            onChange={handleChange}
            className="rounded-lg border border-zinc-200 p-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            placeholder="0"
          />
        </div>
      </div>

      {/* SEÇÃO DE ARQUIVOS DINÂMICOS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Expected Files Schema</h4>
          <button
            type="button"
            onClick={addFileBlock}
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> Add Expected File
          </button>
        </div>

        {form.files.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50">
            <p className="text-sm text-zinc-500 font-medium">No files specified for this workflow yet.</p>
            <p className="text-xs text-zinc-400 mt-1">Click the button above to add the first file criteria.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {form.files.map((file, fileIdx) => (
              <div key={fileIdx} className="relative border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm space-y-6">
                
                {/* HEADER DO ARQUIVO */}
                <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-zinc-100 rounded-xl text-zinc-700">
                      <FileCode className="h-5 w-5" />
                    </div>
                    <div className="flex-1 grid gap-1.5 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">File Pattern / Name</label>
                        <input
                          type="text"
                          placeholder="e.g. users_data_*.csv"
                          value={file.file_pattern}
                          onChange={(e) => handleFileMetaChange(fileIdx, 'file_pattern', e.target.value)}
                          className="rounded-lg border border-zinc-200 p-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeFileBlock(fileIdx)}
                    className="text-zinc-400 hover:text-red-500 p-1.5 border border-zinc-100 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all cursor-pointer mt-5"
                    title="Remove File Configuration"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* RESTRIÇÕES ESTRUTURAIS DO ARQUIVO */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Required Columns (Presence)</label>
                    <input
                      type="text"
                      placeholder="id, name, email"
                      value={file.required_columns}
                      onChange={(e) => handleFileMetaChange(fileIdx, 'required_columns', e.target.value)}
                      className="rounded-lg border border-zinc-200 p-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Not-Null Columns</label>
                    <input
                      type="text"
                      placeholder="id, status"
                      value={file.not_null_columns}
                      onChange={(e) => handleFileMetaChange(fileIdx, 'not_null_columns', e.target.value)}
                      className="rounded-lg border border-zinc-200 p-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                {/* TIPOS DE COLUNA INTERNOS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Column Typing</label>
                    <button
                      type="button"
                      onClick={() => addColumnType(fileIdx)}
                      className="flex items-center gap-1 text-xs text-zinc-900 hover:text-zinc-600 font-medium cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add Type Rule
                    </button>
                  </div>
                  
                  {file.column_types.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic bg-zinc-50 border border-dashed border-zinc-100 rounded-xl p-3 text-center">
                      No explicit column types enforced for this file.
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {file.column_types.map((typeRow, typeIdx) => (
                        <div key={typeIdx} className="flex items-center gap-2 bg-zinc-50 p-1.5 border border-zinc-100 rounded-lg">
                          <input
                            type="text"
                            placeholder="Column name"
                            value={typeRow.column}
                            onChange={(e) => handleColumnTypeChange(fileIdx, typeIdx, 'column', e.target.value)}
                            className="flex-1 bg-white border border-zinc-200 rounded p-1 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                          />
                          <select
                            value={typeRow.type}
                            onChange={(e) => handleColumnTypeChange(fileIdx, typeIdx, 'type', e.target.value)}
                            className="w-36 bg-white border border-zinc-200 rounded p-1 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                          >
                            <option value="string">String</option>
                            <option value="integer">Integer</option>
                            <option value="decimal">Decimal</option>
                            <option value="boolean">Boolean</option>
                            <option value="date">Date</option>
                            <option value="timestamp">Timestamp</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeColumnType(fileIdx, typeIdx)}
                            className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* REGRAS CUSTOMIZADAS INTERNAS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Row-Level Business Rules</label>
                    <button
                      type="button"
                      onClick={() => addCustomRule(fileIdx)}
                      className="flex items-center gap-1 text-xs text-zinc-900 hover:text-zinc-600 font-medium cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add Logical Assertion
                    </button>
                  </div>

                  {file.custom_rules.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic bg-zinc-50 border border-dashed border-zinc-100 rounded-xl p-3 text-center">
                      No custom integrity assertions defined for this file.
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {file.custom_rules.map((ruleRow, ruleIdx) => (
                        <div key={ruleIdx} className="flex items-center gap-2 bg-zinc-50 p-1.5 border border-zinc-100 rounded-lg">
                          <input
                            type="text"
                            placeholder="Column"
                            value={ruleRow.column}
                            onChange={(e) => handleCustomRuleChange(fileIdx, ruleIdx, 'column', e.target.value)}
                            className="flex-1 bg-white border border-zinc-200 rounded p-1 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                          />
                          <select
                            value={ruleRow.operator}
                            onChange={(e) => handleCustomRuleChange(fileIdx, ruleIdx, 'operator', e.target.value)}
                            className="w-24 bg-white border border-zinc-200 rounded p-1 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                          >
                            <option value="=">=</option>
                            <option value="!=">!=</option>
                            <option value=">">&gt;</option>
                            <option value="&lt;">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="&lt;=">&lt;=</option>
                            <option value="regex">regex</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Value"
                            value={ruleRow.value}
                            onChange={(e) => handleCustomRuleChange(fileIdx, ruleIdx, 'value', e.target.value)}
                            className="flex-1 bg-white border border-zinc-200 rounded p-1 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomRule(fileIdx, ruleIdx)}
                            className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-zinc-100" />

      {/* BYPASS SETTINGS */}
      <div className="flex items-center gap-3 pt-2">
        <input
          id="allow_empty_files"
          type="checkbox"
          name="allow_empty_files"
          checked={form.allow_empty_files}
          onChange={handleChange}
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
        />
        <label htmlFor="allow_empty_files" className="text-sm text-zinc-700 font-medium select-none cursor-pointer">
          Allow empty batches to bypass validation without raising system exceptions
        </label>
      </div>
    </div>
  )
}