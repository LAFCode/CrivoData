import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function FileRulesSection({ file, actions }) {
  return (
    <div className="pt-4 border-t border-zinc-100 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Row Content Rules & Valuations
        </h4>
        <button 
          type="button"
          onClick={() => actions.handleAddRule(file.id)}
          className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Rule
        </button>
      </div>

      {file.customRules.length === 0 ? (
        <div className="bg-zinc-50/50 rounded-xl p-4 border border-dashed border-zinc-200 text-center text-xs text-zinc-400">
          No advanced validations created. The file data will only be verified against column schema types.
        </div>
      ) : (
        <div className="space-y-3.5">
          {file.customRules.map((rule) => (
            <div key={rule.id} className="flex flex-col lg:flex-row items-stretch gap-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl p-3.5">
              
              <div className="flex-1 min-w-[120px]">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">If Column:</label>
                <select
                  value={rule.field}
                  onChange={(e) => actions.handleUpdateRule(file.id, rule.id, { field: e.target.value })}
                  className="text-xs bg-white border border-zinc-200 rounded-lg px-2 py-2 w-full outline-none focus:ring-1 focus:ring-zinc-300"
                >
                  {file.columns.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="w-full lg:w-48">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Is invalid when:</label>
                <select
                  value={rule.operator}
                  onChange={(e) => actions.handleUpdateRule(file.id, rule.id, { operator: e.target.value })}
                  className="text-xs bg-white border border-zinc-200 rounded-lg px-2 py-2 w-full outline-none focus:ring-1 focus:ring-zinc-300"
                >
                  <option value="greater_than">Is less than (&lt;)</option>
                  <option value="less_than">Is greater than (&gt;)</option>
                  <option value="regex_not_match">Doesn't match Regex pattern</option>
                  <option value="is_null">Is empty or null</option>
                  <option value="not_in_list">Is not in predefined values</option>
                </select>
              </div>

              <div className="w-full lg:w-36">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Threshold:</label>
                <input 
                  type="text"
                  value={rule.value}
                  onChange={(e) => actions.handleUpdateRule(file.id, rule.id, { value: e.target.value })}
                  className="text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-2 w-full outline-none focus:ring-1 focus:ring-zinc-300"
                  placeholder="Value"
                />
              </div>

              <div className="flex-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Validation Error Message:</label>
                <input 
                  type="text"
                  value={rule.message}
                  onChange={(e) => actions.handleUpdateRule(file.id, rule.id, { message: e.target.value })}
                  className="text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-2 w-full outline-none focus:ring-1 focus:ring-zinc-300 text-rose-700 font-medium"
                  placeholder="Error description shown to user"
                />
              </div>

              <div className="flex items-end pb-1.5">
                <button
                  type="button"
                  onClick={() => actions.handleRemoveRule(file.id, rule.id)}
                  className="p-2 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-200/55 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}