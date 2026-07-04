const leaveRequests = [
  { id: "LV-1104", employee: "Meera Iyer", type: "Medical", days: 3, status: "PENDING" },
  { id: "LV-1103", employee: "Aarav Shah", type: "Casual", days: 1, status: "APPROVED" }
];

export function listLeaves(_req, res) {
  res.json({ data: leaveRequests });
}

export function applyLeave(req, res) {
  const leave = { id: `LV-${1110 + leaveRequests.length}`, status: "PENDING", ...req.body };
  leaveRequests.unshift(leave);
  res.status(201).json(leave);
}

export function reviewLeave(req, res) {
  const leave = leaveRequests.find((item) => item.id === req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave request not found" });
  leave.status = req.body.status;
  return res.json(leave);
}
