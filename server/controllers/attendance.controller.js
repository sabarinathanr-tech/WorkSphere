import { prisma } from "../config/db.js";

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function mapAttendance(record) {
  return {
    id: record.id,
    employee: record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : undefined,
    workDate: record.workDate,
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    status: record.status,
    notes: record.notes
  };
}

export async function getAttendance(req, res) {
  const employee = req.user.role === "EMPLOYEE"
    ? await prisma.employee.findUnique({ where: { userId: req.user.id } })
    : null;

  const records = await prisma.attendance.findMany({
    where: employee ? { employeeId: employee.id } : {},
    include: { employee: true },
    orderBy: { workDate: "desc" },
    take: req.user.role === "EMPLOYEE" ? 31 : 100
  });

  res.json({ data: records.map(mapAttendance) });
}

export async function checkIn(req, res) {
  const employee = await prisma.employee.findUnique({ where: { userId: req.user.id } });
  if (!employee) return res.status(404).json({ message: "Employee profile not found" });

  const record = await prisma.attendance.upsert({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: startOfToday() } },
    update: { checkIn: new Date(), status: "PRESENT" },
    create: { employeeId: employee.id, workDate: startOfToday(), checkIn: new Date(), status: "PRESENT" },
    include: { employee: true }
  });

  res.status(201).json(mapAttendance(record));
}

export async function checkOut(req, res) {
  const employee = await prisma.employee.findUnique({ where: { userId: req.user.id } });
  if (!employee) return res.status(404).json({ message: "Employee profile not found" });

  const existing = await prisma.attendance.findUnique({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: startOfToday() } }
  });
  if (!existing) {
    return res.status(400).json({ message: "Check in before checking out" });
  }

  const record = await prisma.attendance.update({
    where: { employeeId_workDate: { employeeId: employee.id, workDate: startOfToday() } },
    data: { checkOut: new Date() },
    include: { employee: true }
  });

  res.json(mapAttendance(record));
}
