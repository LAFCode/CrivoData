import { useState } from 'react';

export function useWorkflowFiles(initialFiles = []) {
  const [files, setFiles] = useState(initialFiles);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

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

  const handleAddColumn = (fileId) => {
    setFiles(files.map(f => f.id === fileId ? {
      ...f,
      columns: [...f.columns, { id: Date.now().toString(), name: 'nova_coluna', type: 'string', required: false }]
    } : f));
  };

  const handleUpdateColumn = (fileId, colId, fields) => {
    setFiles(files.map(f => f.id === fileId ? {
      ...f,
      columns: f.columns.map(c => c.id === colId ? { ...c, ...fields } : c)
    } : f));
  };

  const handleRemoveColumn = (fileId, colId) => {
    setFiles(files.map(f => f.id === fileId ? {
      ...f,
      columns: f.columns.filter(c => c.id !== colId)
    } : f));
  };

  const handleAddRule = (fileId) => {
    setFiles(files.map(f => {
      if (f.id === fileId) {
        const defaultField = f.columns.length > 0 ? f.columns[0].name : '';
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
    setFiles(files.map(f => f.id === fileId ? {
      ...f,
      customRules: f.customRules.map(r => r.id === ruleId ? { ...r, ...fields } : r)
    } : f));
  };

  const handleRemoveRule = (fileId, ruleId) => {
    setFiles(files.map(f => f.id === fileId ? {
      ...f,
      customRules: f.customRules.filter(r => r.id !== ruleId)
    } : f));
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

  return {
    files,
    notification,
    actions: {
      handleAddFile,
      handleRemoveFile,
      toggleExpand,
      handleUpdateFile,
      handleAddColumn,
      handleUpdateColumn,
      handleRemoveColumn,
      handleAddRule,
      handleUpdateRule,
      handleRemoveRule,
      toggleFormat
    }
  };
}