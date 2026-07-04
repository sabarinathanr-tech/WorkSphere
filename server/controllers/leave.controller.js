import { prisma } from "../config/db.js";

function mapLeave(leave) {
  return {
    id: leave.id,
    employee: `${leave.employee.firstName} ${leave.employee.lastName}`,
    type: leave.type,
    from: leave.startDate,
    to: leave.endDate,
    days: leave.days,
    reason: leave.reason,
    status: leave.status
  };
}

export async function listLeaves(req, res) {
  const employee = req.user.role === "EMPLOYEE"
    ? await prisma.employee.findUnique({ where: { userId: req.user.id } })
    : null;

  const leaveRequests = await prisma.leaveRequest.findMany({
    where: employee ? { employeeId: employee.id } : {},
    include: { employee: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ data: leaveRequests.map(mapLeave) });
}

export async function applyLeave(req, res) {
  const employee = await prisma.employee.findUnique({ where: { userId: req.user.id } });
  if (!employee) return res.status(404).json({ message: "Employee profile not found" });

  const { type, startDate, endDate, reason } = req.body;
  if (!type || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: "Type, start date, end date and reason are required" });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end - start) / 86400000) + 1);

  const leave = await prisma.leaveRequest.create({
    data: {
      employeeId: employee.id,
      type,
      startDate: start,
      endDate: end,
      days,
      reason,
      status: "PENDING"
    },
    include: { employee: true }
  });

  res.status(201).json(mapLeave(leave));
}

export async function reviewLeave(req, res) {
  const { status } = req.body;
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Status must be APPROVED or REJECTED" });
  }

  const leave = await prisma.leaveRequest.update({
    where: { id: req.params.id },
    data: { status, reviewedBy: req.user.id, reviewedAt: new Date() },
    include: { employee: true }
  });
  return res.json(mapLeave(leave));
}
