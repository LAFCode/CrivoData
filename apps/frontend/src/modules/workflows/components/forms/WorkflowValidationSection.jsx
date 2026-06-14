import React from 'react';
import { Plus, AlertTriangle, Check } from 'lucide-react';
import { useWorkflowFiles } from './workflow-files/useWorkflowFiles';
import { FileWorkflowCard } from './workflow-files/FileWorkflowCard';

const INITIAL_STATE = [];

export default function WorkflowFilesSection({ files, setFiles, errors = {} }) {
  const { files: managedFiles, notification, actions } = useWorkflowFiles(INITIAL_STATE, files, setFiles);
  const displayFiles = files || managedFiles;

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
          {displayFiles.length === 0 ? (
            <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed bg-zinc-50 py-12 px-6 text-center ${errors.files ? 'border-rose-300' : 'border-zinc-200'}`}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <Plus className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-700">
                No expected files configured
              </p>
              <p className="mt-1 text-xs text-zinc-500 max-w-xs">
                Add at least one expected file so the system knows which documents to validate. Click the button above to get started.
              </p>
              {errors.files && (
                <p className="mt-3 text-xs font-medium text-rose-600">{errors.files}</p>
              )}
            </div>
          ) : (
            displayFiles.map((file) => (
              <FileWorkflowCard 
                key={file.id}
                file={file}
                actions={actions}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}