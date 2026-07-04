export function getPayroll(_req, res) {
  res.json({
    salary: { gross: 118000, deductions: 10100, net: 107900 },
    history: [
      { month: "March 2026", gross: 118000, deductions: 11200, net: 106800, status: "PAID" },
      { month: "April 2026", gross: 118000, deductions: 9800, net: 108200, status: "PAID" },
      { month: "May 2026", gross: 118000, deductions: 10350, net: 107650, status: "PAID" }
    ]
  });
}
