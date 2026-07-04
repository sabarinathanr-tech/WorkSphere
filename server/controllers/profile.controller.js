import { prisma } from "../config/db.js";

export async function getProfile(req, res) {
  const employee = await prisma.employee.findUnique({
    where: { userId: req.user.id },
    include: { user: true, department: true, documents: true }
  });

  if (!employee) return res.status(404).json({ message: "Profile not found" });

  res.json({
    employeeId: employee.employeeId,
    name: `${employee.firstName} ${employee.lastName}`,
    role: employee.jobTitle,
    email: employee.user.email,
    department: employee.department.name,
    phone: employee.phone,
    address: employee.address,
    emergencyContact: employee.emergencyContact,
    documents: employee.documents
  });
}

export async function updateProfile(req, res) {
  const allowed = (({ phone, address, emergencyContact }) => ({ phone, address, emergencyContact }))(req.body);
  const employee = await prisma.employee.update({
    where: { userId: req.user.id },
    data: allowed,
    include: { user: true, department: true }
  });

  res.json({
    message: "Profile updated",
    profile: {
      employeeId: employee.employeeId,
      name: `${employee.firstName} ${employee.lastName}`,
      phone: employee.phone,
      address: employee.address,
      emergencyContact: employee.emergencyContact
    }
  });
}
