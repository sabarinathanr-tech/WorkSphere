import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

const departments = [
  { name: "Executive", description: "Company leadership and administration", budget: 2400000 },
  { name: "People", description: "HR operations and employee experience", budget: 680000 },
  { name: "Engineering", description: "Product engineering and platform delivery", budget: 2140000 },
  { name: "Design", description: "Product design and research", budget: 520000 },
  { name: "Finance", description: "Finance, payroll and compliance", budget: 810000 },
  { name: "Sales", description: "Revenue and customer growth", budget: 1370000 }
];

const users = [
  { email: "admin@worksphere.io", role: "ADMIN", employeeId: "EMP-001", firstName: "Anika", lastName: "Rao", jobTitle: "Platform Administrator", department: "Executive", salary: 142000 },
  { email: "hr@worksphere.io", role: "HR", employeeId: "EMP-002", firstName: "Priya", lastName: "Menon", jobTitle: "HR Business Partner", department: "People", salary: 98000 },
  { email: "employee@worksphere.io", role: "EMPLOYEE", employeeId: "EMP-003", firstName: "Kabir", lastName: "Mehta", jobTitle: "Backend Engineer", department: "Engineering", salary: 118000 },
  { email: "aarav@worksphere.io", role: "EMPLOYEE", employeeId: "EMP-004", firstName: "Aarav", lastName: "Shah", jobTitle: "Product Designer", department: "Design", salary: 78000 },
  { email: "meera@worksphere.io", role: "EMPLOYEE", employeeId: "EMP-005", firstName: "Meera", lastName: "Iyer", jobTitle: "Finance Analyst", department: "Finance", salary: 88000 },
  { email: "dev@worksphere.io", role: "EMPLOYEE", employeeId: "EMP-006", firstName: "Dev", lastName: "Nair", jobTitle: "Sales Lead", department: "Sales", salary: 104000 }
];

async function main() {
  const passwordHash = await bcrypt.hash("WorkSphere@123!", 12);
  const departmentRecords = {};
  const resetDemoData = process.env.RESET_DEMO_DATA === "true";

  if (resetDemoData) {
    await prisma.authSession.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.activityLog.deleteMany({ where: { action: "DATABASE_SEEDED" } });
  }

  for (const department of departments) {
    departmentRecords[department.name] = await prisma.department.upsert({
      where: { name: department.name },
      update: department,
      create: department
    });
  }

  for (const item of users) {
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: { role: item.role, isVerified: true, passwordHash, disabledAt: null },
      create: {
        email: item.email,
        passwordHash,
        role: item.role,
        isVerified: true
      }
    });

    const employee = await prisma.employee.upsert({
      where: { employeeId: item.employeeId },
      update: {
        firstName: item.firstName,
        lastName: item.lastName,
        jobTitle: item.jobTitle,
        salary: item.salary,
        departmentId: departmentRecords[item.department].id,
        status: item.employeeId === "EMP-005" ? "ON_LEAVE" : "ACTIVE"
      },
      create: {
        employeeId: item.employeeId,
        userId: user.id,
        firstName: item.firstName,
        lastName: item.lastName,
        jobTitle: item.jobTitle,
        salary: item.salary,
        departmentId: departmentRecords[item.department].id,
        phone: "+91 98765 11003",
        address: "Bengaluru, Karnataka",
        emergencyContact: "+91 98765 22003",
        dateOfJoining: new Date("2024-01-09"),
        status: item.employeeId === "EMP-005" ? "ON_LEAVE" : "ACTIVE"
      }
    });

    const existingWelcome = await prisma.notification.findFirst({
      where: {
        userId: user.id,
        title: "Welcome to WorkSphere"
      }
    });

    if (!existingWelcome) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to WorkSphere",
          message: `${item.firstName}, your ${item.role.toLowerCase()} workspace is ready.`
        }
      });
    }

    if (item.employeeId === "EMP-003") {
      await prisma.leaveRequest.upsert({
        where: { id: "seed-kabir-leave" },
        update: {},
        create: {
          id: "seed-kabir-leave",
          employeeId: employee.id,
          type: "Earned",
          startDate: new Date("2026-07-12"),
          endDate: new Date("2026-07-15"),
          days: 4,
          reason: "Family travel",
          status: "PENDING"
        }
      });

      await prisma.payroll.upsert({
        where: { employeeId_periodMonth_periodYear: { employeeId: employee.id, periodMonth: 6, periodYear: 2026 } },
        update: {},
        create: {
          employeeId: employee.id,
          periodMonth: 6,
          periodYear: 2026,
          basic: 90000,
          allowances: 28000,
          deductions: 10100,
          netSalary: 107900,
          paidAt: new Date("2026-06-30")
        }
      });
    }
  }

  if (resetDemoData || !(await prisma.activityLog.findFirst({ where: { action: "DATABASE_SEEDED" } }))) {
    await prisma.activityLog.create({
      data: {
        action: "DATABASE_SEEDED",
        entity: "System",
        metadata: { source: "prisma/seed.js" }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("WorkSphere database seeded");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
