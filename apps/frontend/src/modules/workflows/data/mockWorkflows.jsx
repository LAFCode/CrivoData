export const workflows = [
  {
    id: 1,

    name: 'Payroll Validation',

    description:
      'Validate payroll spreadsheets before BI ingestion.',

    status: 'active',

    workflow_type: 'Spreadsheet Validation',

    group_name: 'HR',

    recurrence_type: 'Monthly',

    expected_files_count: 2,

    pending_executions: 3,

    last_execution_at: '2 hours ago',

    next_execution_at: 'Tomorrow - 08:00',
  },

  {
    id: 2,

    name: 'Invoice OCR Processing',

    description:
      'Process invoice PDFs with OCR and business validation.',

    status: 'draft',

    workflow_type: 'PDF Validation',

    group_name: 'Finance',

    recurrence_type: 'Daily',

    expected_files_count: 1,

    pending_executions: 0,

    last_execution_at: 'Yesterday',

    next_execution_at: 'Today - 18:00',
  },

  {
    id: 3,

    name: 'Cost Center Validation',

    description:
      'Cross validate cost centers between ERP exports.',

    status: 'paused',

    workflow_type: 'Hybrid',

    group_name: 'Finance',

    recurrence_type: 'Weekly',

    expected_files_count: 3,

    pending_executions: 7,

    last_execution_at: '5 days ago',

    next_execution_at: 'Paused',
  },
]