// Simulando o que viria do banco de dados
export const getDashboardStats = () => [
  { label: "Pending Validations", value: "148" },
  { label: "Approved Documents", value: "2,847" },
  { label: "Rejected Documents", value: "39" },
]

export const getRecentSubmissions = () => [
  { id: 101, time: "2 hours ago", status: "Pending" },
  { id: 102, time: "5 hours ago", status: "Pending" },
  { id: 103, time: "1 day ago", status: "Approved" },
  { id: 104, time: "2 days ago", status: "Rejected" },
]