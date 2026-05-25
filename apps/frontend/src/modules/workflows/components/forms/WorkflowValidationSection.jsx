import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  FileCode,
  Sparkles
} from 'lucide-react';

// Simulando o seu componente personalizado de Input (@/shared/components/ui/Input)
// Quando for utilizar no seu sistema, você pode remover esta declaração local e 
// descomentar o import original: import Input from '@/shared/components/ui/Input'
const Input = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`
        h-11
        w-full
        rounded-xl
        border
        border-zinc-200
        bg-white
        px-3
        text-sm
        outline-none
        transition-all
        focus:border-zinc-400
        focus:ring-1
        focus:ring-zinc-450
        placeholder:text-zinc-400
        ${className}
      `}
    />
  );
};

export default function WorkflowFilesSection() {
  // Estado que gerencia a lista de arquivos e suas respectivas validações internas
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'Relatório de Vendas Semanal',
      pattern: 'vendas_*.csv',
      required: true,
      maxSize: 15, // MB
      allowedFormats: ['csv', 'xlsx'],
      columns: [
        { id: 'c1', name: 'id_venda', type: 'number', required: true },
        { id: 'c2', name: 'valor_total', type: 'number', required: true },
        { id: 'c3', name: 'data_pagamento', type: 'date', required: true },
        { id: 'c4', name: 'cpf_cliente', type: 'string', required: false }
      ],
      customRules: [
        { id: 'r1', field: 'valor_total', operator: 'greater_than', value: '0', message: 'O valor não pode ser negativo' }
      ],
      isExpanded: true
    },
    {
      id: '2',
      name: 'Cadastro de Novos Clientes',
      pattern: 'clientes_cadastro_YYYYMMDD.xlsx',
      required: false,
      maxSize: 5, // MB
      allowedFormats: ['xlsx'],
      columns: [
        { id: 'c1', name: 'nome', type: 'string', required: true },
        { id: 'c2', name: 'email', type: 'string', required: true }
      ],
      customRules: [],
      isExpanded: false
    }
  ]);

  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Manipuladores para gerenciar os arquivos
  const handleAddFile = () => {
    const newId = Date.now().toString();
    const newFile = {
      id: newId,
      name: `Novo Arquivo Esperado (${files.length + 1})`,
      pattern: 'nome_arquivo_*.csv',
      required: true,
      maxSize: 10,
      allowedFormats: ['csv'],
      columns: [{ id: '1', name: 'id', type: 'number', required: true }],
      customRules: [],
      isExpanded: true
    };
    
    // Recolhe os outros arquivos para dar foco ao novo que acabou de ser criado
    setFiles(files.map(f => ({ ...f, isExpanded: false })).concat(newFile));
    showToast('Novo arquivo adicionado!');
  };

  const handleRemoveFile = (id, event) => {
    event.stopPropagation();
    if (files.length === 1) {
      showToast('O fluxo necessita de ao menos um arquivo esperado.', 'error');
      return;
    }
    setFiles(files.filter(f => f.id !== id));
    showToast('Arquivo removido.');
  };

  const toggleExpand = (id) => {
    setFiles(files.map(f => f.id === id ? { ...f, isExpanded: !f.isExpanded } : f));
  };

  const handleUpdateFile = (id, fields) => {
    setFiles(files.map(f => f.id === id ? { ...f, ...fields } : f));
  };

  // Manipuladores de Colunas do Arquivo Selecionado
  const handleAddColumn = (fileId) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          columns: [...f.columns, { id: Date.now().toString(), name: 'nova_coluna', type: 'string', required: false }]
        };
      }
      return f;
    }));
  };

  const handleUpdateColumn = (fileId, colId, fields) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          columns: f.columns.map(c => c.id === colId ? { ...c, ...fields } : c)
        };
      }
      return f;
    }));
  };

  const handleRemoveColumn = (fileId, colId) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          columns: f.columns.filter(c => c.id !== colId)
        };
      }
      return f;
    }));
  };

  // Manipuladores de Condições / Regras Personalizadas
  const handleAddRule = (fileId) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        const availableCols = f.columns;
        const defaultField = availableCols.length > 0 ? availableCols[0].name : '';
        return {
          ...f,
          customRules: [...f.customRules, { 
            id: Date.now().toString(), 
            field: defaultField, 
            operator: 'not_null', 
            value: '', 
            message: 'Valor inválido encontrado' 
          }]
        };
      }
      return f;
    }));
  };

  const handleUpdateRule = (fileId, ruleId, fields) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          customRules: f.customRules.map(r => r.id === ruleId ? { ...r, ...fields } : r)
        };
      }
      return f;
    }));
  };

  const handleRemoveRule = (fileId, ruleId) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          customRules: f.customRules.filter(r => r.id !== ruleId)
        };
      }
      return f;
    }));
  };

  const toggleFormat = (fileId, format) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        const allowedFormats = f.allowedFormats.includes(format)
          ? f.allowedFormats.filter(fmt => fmt !== format)
          : [...f.allowedFormats, format];
        return { ...f, allowedFormats };
      }
      return f;
    }));
  };

  return (
    <div className="w-full bg-white font-sans text-zinc-800">
      
      {/* Notificação flutuante de feedback */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-md border text-xs font-medium transition-all duration-300 ${
          notification.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' : 
          notification.type === 'info' ? 'bg-zinc-100 border-zinc-200 text-zinc-800' :
          'bg-zinc-900 border-zinc-900 text-white'
        }`}>
          {notification.type === 'error' ? <AlertTriangle className="h-4 w-4 text-rose-600" /> : <Check className="h-4 w-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="space-y-6 border-t border-zinc-100 pt-6">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Expected Files & Validation
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Configure expected data files and their integrity constraints
            </p>
          </div>
          
          <button 
            type="button"
            onClick={handleAddFile}
            className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 h-11 rounded-xl text-xs font-semibold transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Expected File
          </button>
        </div>

        {/* CONTAINER DA LISTA DE ARQUIVOS */}
        <div className="space-y-4">
          {files.map((file) => (
            <div 
              key={file.id} 
              className={`border rounded-xl transition-all duration-200 ${
                file.isExpanded 
                  ? 'border-zinc-300 ring-4 ring-zinc-50 bg-white' 
                  : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/20'
              }`}
            >
              {/* ACCORDION TRIGGER */}
              <div 
                onClick={() => toggleExpand(file.id)}
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
                        <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
                          Required
                        </span>
                      ) : (
                        <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
                          Optional
                        </span>
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
                    onClick={(e) => handleRemoveFile(file.id, e)}
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
                  
                  {/* Linha 1: Nome e Pattern usando o seu Input */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                        File Display Name
                      </label>
                      <Input 
                        type="text"
                        value={file.name}
                        onChange={(e) => handleUpdateFile(file.id, { name: e.target.value })}
                        placeholder="Ex: Weekly billing report"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                        Filename Pattern (Regex)
                      </label>
                      <Input 
                        type="text"
                        value={file.pattern}
                        onChange={(e) => handleUpdateFile(file.id, { pattern: e.target.value })}
                        placeholder="Ex: billing_*.csv"
                        className="font-mono"
                      />
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={file.required}
                          onChange={(e) => handleUpdateFile(file.id, { required: e.target.checked })}
                          className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 h-4 w-4 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-zinc-700">File is mandatory for completion</span>
                      </label>
                    </div>
                  </div>

                  {/* Formatos e Tamanhos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 rounded-xl p-4.5 border border-zinc-150">
                    <div className="space-y-2.5">
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                        Allowed File Formats
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['csv', 'xlsx', 'txt', 'xml'].map((format) => {
                          const active = file.allowedFormats.includes(format);
                          return (
                            <button
                              key={format}
                              type="button"
                              onClick={() => toggleFormat(file.id, format)}
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
                          onChange={(e) => handleUpdateFile(file.id, { maxSize: parseInt(e.target.value) })}
                          className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mapeamento de Colunas do Schema */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        File Schema Columns ({file.columns.length})
                      </h4>
                      <button 
                        type="button"
                        onClick={() => handleAddColumn(file.id)}
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
                                  onChange={(e) => handleUpdateColumn(file.id, col.id, { name: e.target.value })}
                                  className="w-full bg-transparent border-none focus:bg-white focus:ring-1 focus:ring-zinc-300 outline-none text-xs font-mono py-1.5 px-2 rounded-lg"
                                  placeholder="column_name"
                                />
                              </td>
                              <td className="px-3.5 py-2">
                                <select
                                  value={col.type}
                                  onChange={(e) => handleUpdateColumn(file.id, col.id, { type: e.target.value })}
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
                                  onChange={(e) => handleUpdateColumn(file.id, col.id, { required: e.target.checked })}
                                  className="rounded border-zinc-350 text-zinc-900 focus:ring-zinc-900 h-4 w-4 cursor-pointer ml-2"
                                />
                              </td>
                              <td className="px-3.5 py-2 text-right">
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveColumn(file.id, col.id)}
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

                  {/* Condições de Validação Linha-a-Linha */}
                  <div className="pt-4 border-t border-zinc-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Row Content Rules & Valuations
                      </h4>
                      <button 
                        type="button"
                        onClick={() => handleAddRule(file.id)}
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
                                onChange={(e) => handleUpdateRule(file.id, rule.id, { field: e.target.value })}
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
                                onChange={(e) => handleUpdateRule(file.id, rule.id, { operator: e.target.value })}
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
                                onChange={(e) => handleUpdateRule(file.id, rule.id, { value: e.target.value })}
                                className="text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-2 w-full outline-none focus:ring-1 focus:ring-zinc-300"
                                placeholder="Value"
                              />
                            </div>

                            <div className="flex-1">
                              <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Validation Error Message:</label>
                              <input 
                                type="text"
                                value={rule.message}
                                onChange={(e) => handleUpdateRule(file.id, rule.id, { message: e.target.value })}
                                className="text-xs bg-white border border-zinc-200 rounded-lg px-2.5 py-2 w-full outline-none focus:ring-1 focus:ring-zinc-300 text-rose-700 font-medium"
                                placeholder="Error description shown to user"
                              />
                            </div>

                            <div className="flex items-end pb-1.5">
                              <button
                                type="button"
                                onClick={() => handleRemoveRule(file.id, rule.id)}
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

                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}