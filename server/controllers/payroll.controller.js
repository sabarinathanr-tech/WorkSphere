import { prisma } from "../config/db.js";

function mapPayroll(record) {
  return {
    id: record.id,
    employee: record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : undefined,
    periodMonth: record.periodMonth,
    periodYear: record.periodYear,
    basic: record.basic,
    allowances: record.allowances,
    deductions: record.deductions,
    netSalary: record.netSalary,
    paidAt: record.paidAt
  };
}

export async function getPayroll(req, res) {
  const employee = req.user.role === "EMPLOYEE"
    ? await prisma.employee.findUnique({ where: { userId: req.user.id } })
    : null;

  const records = await prisma.payroll.findMany({
    where: employee ? { employeeId: employee.id } : {},
    include: { employee: true },
    orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }]
  });

  const totals = records.reduce((sum, record) => ({
    gross: sum.gross + Number(record.basic) + Number(record.allowances),
    deductions: sum.deductions + Number(record.deductions),
    net: sum.net + Number(record.netSalary)
  }), { gross: 0, deductions: 0, net: 0 });

  res.json({ totals, data: records.map(mapPayroll) });
}
