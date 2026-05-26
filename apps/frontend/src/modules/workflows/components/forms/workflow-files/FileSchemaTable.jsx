import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function FileSchemaTable({ file, actions }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          File Schema Columns ({file.columns.length})
        </h4>
        <button 
          type="button"
          onClick={() => actions.handleAddColumn(file.id)}
          className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Column
        </button>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-3.5 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider">Header Name</th>
              <th className="px-3.5 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider w-48">Data Type</th>
              <th className="px-3.5 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider w-32">Required</th>
              <th className="px-3.5 py-3 text-xs font-bold text-zinc-600 uppercase tracking-wider w-12"></th>
            </tr>
          </thead>
          <tbody>
            {file.columns.map((col) => (
              <tr key={col.id} className="border-b last:border-0 border-zinc-150 hover:bg-zinc-50/20 transition-colors">
                <td className="px-3.5 py-2">
                  <input 
                    type="text"
                    value={col.name}
                    onChange={(e) => actions.handleUpdateColumn(file.id, col.id, { name: e.target.value })}
                    className="w-full bg-transparent border-none focus:bg-white focus:ring-1 focus:ring-zinc-300 outline-none text-xs font-mono py-1.5 px-2 rounded-lg"
                    placeholder="column_name"
                  />
                </td>
                <td className="px-3.5 py-2">
                  <select
                    value={col.type}
                    onChange={(e) => actions.handleUpdateColumn(file.id, col.id, { type: e.target.value })}
                    className="text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none w-full focus:ring-1 focus:ring-zinc-300"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="date">Date (YYYY-MM-DD)</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </td>
                <td className="px-3.5 py-2">
                  <input 
                    type="checkbox"
                    checked={col.required}
                    onChange={(e) => actions.handleUpdateColumn(file.id, col.id, { required: e.target.checked })}
                    className="rounded border-zinc-350 text-zinc-900 focus:ring-zinc-900 h-4 w-4 cursor-pointer ml-2"
                  />
                </td>
                <td className="px-3.5 py-2 text-right">
                  <button 
                    type="button"
                    onClick={() => actions.handleRemoveColumn(file.id, col.id)}
                    className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}