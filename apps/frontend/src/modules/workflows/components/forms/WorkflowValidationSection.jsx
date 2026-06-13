import React from 'react';
import { Plus, AlertTriangle, Check } from 'lucide-react';
import { useWorkflowFiles } from './workflow-files/useWorkflowFiles';
import { FileWorkflowCard } from './workflow-files/FileWorkflowCard';

const INITIAL_STATE = [
  {
    id: '1',
    name: 'Relatório de Vendas Semanal',
    pattern: 'vendas_*.csv',
    required: true,
    maxSize: 15,
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
    maxSize: 5,
    allowedFormats: ['xlsx'],
    columns: [
      { id: 'c1', name: 'nome', type: 'string', required: true },
      { id: 'c2', name: 'email', type: 'string', required: true }
    ],
    customRules: [],
    isExpanded: false
  }
];

export default function WorkflowFilesSection() {
  const { files, notification, actions } = useWorkflowFiles(INITIAL_STATE);

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
            onClick={actions.handleAddFile}
            className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 h-11 rounded-xl text-xs font-semibold transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Expected File
          </button>
        </div>

        {/* CONTAINER DA LISTA DE ARQUIVOS */}
        <div className="space-y-4">
          {files.map((file) => (
            <FileWorkflowCard 
              key={file.id}
              file={file}
              actions={actions}
            />
          ))}
        </div>

      </div>
    </div>
  );
}