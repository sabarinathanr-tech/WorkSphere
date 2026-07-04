import { prisma } from "../config/db.js";

export async function getDashboard(req, res) {
  const [employees, activeEmployees, pendingLeave, payroll, departments, recentActivities] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.payroll.aggregate({ _sum: { netSalary: true } }),
    prisma.department.findMany({ include: { _count: { select: { employees: true } } }, orderBy: { name: "asc" } }),
    prisma.activityLog.findMany({ take: 8, orderBy: { createdAt: "desc" } })
  ]);

  const role = req.user.role;
  res.json({
    role,
    metrics: {
      totalEmployees: employees,
      activeEmployees,
      pendingLeave,
      payrollSummary: payroll._sum.netSalary || 0,
      attendanceRate: role === "EMPLOYEE" ? 92 : role === "HR" ? 91 : 94
    },
    departments: departments.map((department) => ({
      name: department.name,
      employees: department._count.employees
    })),
    recentActivities,
    trend: [
      { month: "Jan", score: 78 },
      { month: "Feb", score: 84 },
      { month: "Mar", score: 81 },
      { month: "Apr", score: 89 },
      { month: "May", score: 86 },
      { month: "Jun", score: 93 }
    ]
  });
}
