import React from 'react';
import { FileCode, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import Input from '@/shared/components/ui/Input'; // Import original mapeado
import { FileSchemaTable } from './FileSchemaTable';
import { FileRulesSection } from './FileRulesSection';

export function FileWorkflowCard({ file, actions }) {
  return (
    <div 
      className={`border rounded-xl transition-all duration-200 ${
        file.isExpanded 
          ? 'border-zinc-300 ring-4 ring-zinc-50 bg-white' 
          : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/20'
      }`}
    >
      {/* ACCORDION TRIGGER */}
      <div 
        onClick={() => actions.toggleExpand(file.id)}
        className="p-4 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-lg ${file.isExpanded ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
            <FileCode className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-zinc-900 text-sm truncate">{file.name}</span>
              {file.required ? (
                <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] px-1.5 py-0.5 rounded-md font-semibold">Required</span>
              ) : (
                <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] px-1.5 py-0.5 rounded-md font-semibold">Optional</span>
              )}
            </div>
            <span className="text-xs text-zinc-400 font-mono mt-1 block truncate">
              Filename Match: {file.pattern} • {file.columns.length} schema columns defined
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <div className="hidden md:flex items-center gap-1">
            {file.allowedFormats.map(fmt => (
              <span key={fmt} className="text-[10px] font-bold font-mono bg-zinc-100 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md uppercase">
                {fmt}
              </span>
            ))}
          </div>
          
          <button 
            type="button"
            onClick={(e) => actions.handleRemoveFile(file.id, e)}
            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          
          <div className="text-zinc-400">
            {file.isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {/* ACCORDION CONTENT */}
      {file.isExpanded && (
        <div className="border-t border-zinc-100 p-5 bg-white rounded-b-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">File Display Name</label>
              <Input 
                type="text"
                value={file.name}
                onChange={(e) => actions.handleUpdateFile(file.id, { name: e.target.value })}
                placeholder="Ex: Weekly billing report"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">Filename Pattern (Regex)</label>
              <Input 
                type="text"
                value={file.pattern}
                onChange={(e) => actions.handleUpdateFile(file.id, { pattern: e.target.value })}
                placeholder="Ex: billing_*.csv"
                className="font-mono"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={file.required}
                  onChange={(e) => actions.handleUpdateFile(file.id, { required: e.target.checked })}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 h-4 w-4 cursor-pointer"
                />
                <span className="text-sm font-medium text-zinc-700">File is mandatory for completion</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 rounded-xl p-4.5 border border-zinc-150">
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">Allowed File Formats</label>
              <div className="flex flex-wrap gap-2">
                {['csv', 'xlsx', 'txt', 'xml'].map((format) => {
                  const active = file.allowedFormats.includes(format);
                  return (
                    <button
                      key={format}
                      type="button"
                      onClick={() => actions.toggleFormat(file.id, format)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                        active 
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {format}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Max Size Limit</label>
                <span className="text-xs font-bold text-zinc-950">{file.maxSize} MB</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={file.maxSize}
                  onChange={(e) => actions.handleUpdateFile(file.id, { maxSize: parseInt(e.target.value) })}
                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Subcomponente Tabela do Schema */}
          <FileSchemaTable file={file} actions={actions} />

          {/* Subcomponente Regras de Conteúdo */}
          <FileRulesSection file={file} actions={actions} />

        </div>
      )}
    </div>
  );
}