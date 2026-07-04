const employees = [
  { id: "EMP-001", name: "Aarav Shah", department: "Design", role: "Product Designer", status: "ACTIVE" },
  { id: "EMP-002", name: "Anika Rao", department: "People", role: "HR Manager", status: "ACTIVE" },
  { id: "EMP-003", name: "Kabir Mehta", department: "Engineering", role: "Backend Engineer", status: "ACTIVE" }
];

export function listEmployees(_req, res) {
  res.json({ data: employees, pagination: { page: 1, pageSize: employees.length, total: employees.length } });
}

export function createEmployee(req, res) {
  const employee = { id: `EMP-${String(employees.length + 1).padStart(3, "0")}`, status: "ACTIVE", ...req.body };
  employees.unshift(employee);
  res.status(201).json(employee);
}

export function getEmployee(req, res) {
  const employee = employees.find((item) => item.id === req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  return res.json(employee);
}
