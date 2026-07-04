import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

function mapEmployee(employee, includeSalary = false) {
  return {
    id: employee.id,
    employeeId: employee.employeeId,
    name: `${employee.firstName} ${employee.lastName}`,
    email: employee.user.email,
    role: employee.jobTitle,
    department: employee.department.name,
    status: employee.status,
    joined: employee.dateOfJoining,
    attendanceRecords: employee.attendanceRecords?.length || 0,
    salary: includeSalary ? employee.salary : undefined
  };
}

export async function listEmployees(req, res) {
  const where = req.user.role === "EMPLOYEE" ? { userId: req.user.id } : {};
  const employees = await prisma.employee.findMany({
    where,
    include: { user: true, department: true, attendanceRecords: true },
    orderBy: { createdAt: "desc" }
  });

  const includeSalary = req.user.role === "ADMIN";
  res.json({
    data: employees.map((employee) => mapEmployee(employee, includeSalary)),
    pagination: { page: 1, pageSize: employees.length, total: employees.length }
  });
}

export async function createEmployee(req, res) {
  const { email, firstName, lastName, jobTitle, departmentName, salary = 0, role = "EMPLOYEE" } = req.body;
  if (!email || !firstName || !lastName || !jobTitle || !departmentName) {
    return res.status(400).json({ message: "Email, first name, last name, job title and department are required" });
  }

  const department = await prisma.department.upsert({
    where: { name: departmentName },
    update: {},
    create: { name: departmentName }
  });
  const passwordHash = await bcrypt.hash("WorkSphere@123", 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      isVerified: true,
      employee: {
        create: {
          employeeId: `EMP-${Date.now().toString().slice(-6)}`,
          firstName,
          lastName,
          jobTitle,
          salary,
          departmentId: department.id,
          dateOfJoining: new Date()
        }
      }
    },
    include: { employee: { include: { user: true, department: true } } }
  });

  res.status(201).json(mapEmployee(user.employee, req.user.role === "ADMIN"));
}

export async function getEmployee(req, res) {
  const employee = await prisma.employee.findUnique({
    where: { id: req.params.id },
    include: { user: true, department: true, attendanceRecords: true, leaveRequests: true, payrollRecords: true }
  });

  if (!employee) return res.status(404).json({ message: "Employee not found" });
  if (req.user.role === "EMPLOYEE" && employee.userId !== req.user.id) {
    return res.status(403).json({ message: "Employees can only view their own profile" });
  }

  return res.json(mapEmployee(employee, req.user.role !== "EMPLOYEE"));
}
