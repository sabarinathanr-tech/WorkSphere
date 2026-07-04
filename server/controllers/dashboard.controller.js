export function getDashboard(_req, res) {
  res.json({
    metrics: {
      employees: 51,
      attendanceRate: 94,
      pendingLeave: 2,
      monthlyPayroll: 4860000
    },
    trend: [
      { month: "Jan", score: 78 },
      { month: "Feb", score: 84 },
      { month: "Mar", score: 81 },
      { month: "Apr", score: 89 },
      { month: "May", score: 86 },
      { month: "Jun", score: 93 }
    ],
    activities: [
      "Anika approved Aarav's casual leave",
      "Kabir checked in at 09:42 AM",
      "Payroll for June 2026 was processed"
    ]
  });
}
