import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Download,
  FileText,
  Filter,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  UserRoundCog,
  Users,
  X
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const ROLE_LABELS = {
  admin: "Administrator",
  hr: "HR",
  employee: "Employee"
};

const ROLE_SESSIONS = {
  admin: { name: "Anika Rao", email: "admin@worksphere.io", role: "admin", scope: "Company-wide control" },
  hr: { name: "Priya Menon", email: "hr@worksphere.io", role: "hr", scope: "People operations" },
  employee: { name: "Kabir Mehta", email: "employee@worksphere.io", role: "employee", scope: "Self-service" }
};

const ROLE_TO_API = {
  admin: "ADMIN",
  hr: "HR",
  employee: "EMPLOYEE"
};

const API_TO_ROLE = {
  ADMIN: "admin",
  HR: "hr",
  EMPLOYEE: "employee"
};

const ROLE_NAV = {
  admin: [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["employees", "Employees", Users],
    ["departments", "Departments", Building2],
    ["attendance", "Attendance", CalendarCheck],
    ["leave", "Leave", FileText],
    ["payroll", "Payroll", DollarSign],
    ["reports", "Reports", BarChart3],
    ["notifications", "Notifications", Bell],
    ["settings", "Settings", Settings]
  ],
  hr: [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["employees", "Employees", Users],
    ["attendance", "Attendance", CalendarCheck],
    ["leave", "Leave", FileText],
    ["payroll", "Payroll", DollarSign],
    ["reports", "Reports", BarChart3],
    ["notifications", "Notifications", Bell],
    ["profile", "Profile", User]
  ],
  employee: [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["attendance", "Attendance", CalendarCheck],
    ["leave", "Leave", FileText],
    ["payroll", "Payroll", DollarSign],
    ["profile", "My Profile", User],
    ["notifications", "Notifications", Bell],
    ["settings", "Settings", Settings]
  ]
};

const adminEmployeesSeed = [
  { id: "EMP-001", name: "Aarav Shah", role: "Product Designer", department: "Design", email: "aarav@worksphere.io", status: "Active", joined: "2023-04-18", salary: 78000, attendance: 96 },
  { id: "EMP-002", name: "Anika Rao", role: "Platform Administrator", department: "Executive", email: "anika@worksphere.io", status: "Active", joined: "2022-11-05", salary: 142000, attendance: 98 },
  { id: "EMP-003", name: "Kabir Mehta", role: "Backend Engineer", department: "Engineering", email: "kabir@worksphere.io", status: "Active", joined: "2024-01-09", salary: 118000, attendance: 92 },
  { id: "EMP-004", name: "Meera Iyer", role: "Finance Analyst", department: "Finance", email: "meera@worksphere.io", status: "On Leave", joined: "2021-08-24", salary: 88000, attendance: 89 },
  { id: "EMP-005", name: "Dev Nair", role: "Sales Lead", department: "Sales", email: "dev@worksphere.io", status: "Active", joined: "2023-09-12", salary: 104000, attendance: 94 },
  { id: "EMP-006", name: "Priya Menon", role: "HR Business Partner", department: "People", email: "priya@worksphere.io", status: "Active", joined: "2023-12-01", salary: 98000, attendance: 97 }
];

const hrEmployeesSeed = [
  { id: "EMP-003", name: "Kabir Mehta", role: "Backend Engineer", department: "Engineering", status: "Active", joined: "Today", missingAttendance: false },
  { id: "EMP-007", name: "Nisha Kapoor", role: "QA Engineer", department: "Engineering", status: "Active", joined: "Today", missingAttendance: true },
  { id: "EMP-008", name: "Rohan Das", role: "Frontend Engineer", department: "Engineering", status: "Active", joined: "2026-06-28", missingAttendance: false },
  { id: "EMP-009", name: "Sara Khan", role: "People Ops Associate", department: "People", status: "Probation", joined: "2026-06-22", missingAttendance: true }
];

const adminLeavesSeed = [
  { id: "LV-3104", employee: "Meera Iyer", team: "Finance", type: "Medical", from: "2026-07-03", to: "2026-07-05", days: 3, status: "Pending" },
  { id: "LV-3103", employee: "Aarav Shah", team: "Design", type: "Casual", from: "2026-07-08", to: "2026-07-08", days: 1, status: "Approved" },
  { id: "LV-3102", employee: "Kabir Mehta", team: "Engineering", type: "Earned", from: "2026-07-12", to: "2026-07-15", days: 4, status: "Pending" },
  { id: "LV-3101", employee: "Dev Nair", team: "Sales", type: "Casual", from: "2026-06-27", to: "2026-06-27", days: 1, status: "Rejected" }
];

const hrLeavesSeed = [
  { id: "HR-LV-104", employee: "Nisha Kapoor", team: "Engineering", type: "Sick", from: "2026-07-04", to: "2026-07-04", days: 1, status: "Pending" },
  { id: "HR-LV-103", employee: "Rohan Das", team: "Engineering", type: "Casual", from: "2026-07-09", to: "2026-07-10", days: 2, status: "Pending" },
  { id: "HR-LV-102", employee: "Sara Khan", team: "People", type: "Earned", from: "2026-07-15", to: "2026-07-16", days: 2, status: "Approved" }
];

const employeeLeavesSeed = [
  { id: "MY-LV-22", type: "Earned", from: "2026-07-12", to: "2026-07-15", days: 4, status: "Pending" },
  { id: "MY-LV-21", type: "Casual", from: "2026-06-18", to: "2026-06-18", days: 1, status: "Approved" },
  { id: "MY-LV-20", type: "Sick", from: "2026-05-03", to: "2026-05-03", days: 1, status: "Approved" }
];

const departmentsSeed = [
  { name: "Engineering", head: "Riya Sen", employees: 18, budget: "INR 21.4L", openRoles: 4 },
  { name: "People", head: "Priya Menon", employees: 7, budget: "INR 6.8L", openRoles: 1 },
  { name: "Design", head: "Aarav Shah", employees: 6, budget: "INR 5.2L", openRoles: 2 },
  { name: "Finance", head: "Meera Iyer", employees: 8, budget: "INR 8.1L", openRoles: 0 },
  { name: "Sales", head: "Dev Nair", employees: 12, budget: "INR 13.7L", openRoles: 3 }
];

const workforceTrend = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 84 },
  { month: "Mar", score: 81 },
  { month: "Apr", score: 89 },
  { month: "May", score: 86 },
  { month: "Jun", score: 93 },
  { month: "Jul", score: 91 }
];

const hrAttendance = [
  { day: "Mon", present: 21, late: 2, missing: 1 },
  { day: "Tue", present: 22, late: 1, missing: 0 },
  { day: "Wed", present: 20, late: 3, missing: 2 },
  { day: "Thu", present: 23, late: 1, missing: 1 },
  { day: "Fri", present: 21, late: 2, missing: 2 }
];

const adminAttendance = [
  { day: "Mon", present: 84, late: 7, leave: 5 },
  { day: "Tue", present: 88, late: 4, leave: 4 },
  { day: "Wed", present: 86, late: 8, leave: 5 },
  { day: "Thu", present: 91, late: 3, leave: 3 },
  { day: "Fri", present: 87, late: 6, leave: 4 }
];

const employeeAttendance = [
  { date: "Jul 1", status: "Present", checkIn: "09:28 AM", checkOut: "06:14 PM" },
  { date: "Jul 2", status: "Present", checkIn: "09:35 AM", checkOut: "06:08 PM" },
  { date: "Jul 3", status: "Late", checkIn: "10:12 AM", checkOut: "06:45 PM" },
  { date: "Jul 4", status: "Pending", checkIn: "-", checkOut: "-" }
];

const adminNotifications = [
  { title: "System policy change pending", detail: "2 admins must approve payroll rule v4", tone: "warning" },
  { title: "Payroll audit complete", detail: "Company payroll passed validation", tone: "success" },
  { title: "New HR account created", detail: "Priya Menon joined the HR group", tone: "info" }
];

const hrNotifications = [
  { title: "Leave queue needs review", detail: "2 department requests pending", tone: "warning" },
  { title: "Missing attendance found", detail: "Nisha and Sara need correction", tone: "danger" },
  { title: "Onboarding checklist ready", detail: "2 new joiners start today", tone: "info" }
];

const employeeNotifications = [
  { title: "Payslip available", detail: "June 2026 payslip is ready", tone: "success" },
  { title: "Leave awaiting approval", detail: "Earned leave request MY-LV-22", tone: "warning" },
  { title: "Holiday reminder", detail: "Independence Day is upcoming", tone: "info" }
];

const employeePayroll = [
  { month: "March 2026", gross: 118000, deductions: 11200, net: 106800, status: "Paid" },
  { month: "April 2026", gross: 118000, deductions: 9800, net: 108200, status: "Paid" },
  { month: "May 2026", gross: 118000, deductions: 10350, net: 107650, status: "Paid" },
  { month: "June 2026", gross: 118000, deductions: 10100, net: 107900, status: "Paid" }
];

const roleColors = {
  admin: "role-admin",
  hr: "role-hr",
  employee: "role-employee"
};

function currency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}

function sessionFromApiUser(user, tokens = {}) {
  const role = API_TO_ROLE[user.role];
  const firstName = user.employee?.firstName || user.email.split("@")[0];
  const lastName = user.employee?.lastName || "";
  return {
    ...ROLE_SESSIONS[role],
    ...tokens,
    id: user.id,
    name: `${firstName} ${lastName}`.trim(),
    email: user.email,
    role,
    apiRole: user.role,
    employee: user.employee
  };
}

function App() {
  const [session, setSession] = useState(() => {
    try {
      const saved = window.localStorage.getItem("worksphere_session");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed?.accessToken && parsed?.refreshToken) return parsed;
      window.localStorage.removeItem("worksphere_session");
      return null;
    } catch {
      window.localStorage.removeItem("worksphere_session");
      return null;
    }
  });
  const [authMode, setAuthMode] = useState("landing");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [active, setActive] = useState("dashboard");
  const [adminEmployees, setAdminEmployees] = useState(adminEmployeesSeed);
  const [hrEmployees, setHrEmployees] = useState(hrEmployeesSeed);
  const [adminLeaves, setAdminLeaves] = useState(adminLeavesSeed);
  const [hrLeaves, setHrLeaves] = useState(hrLeavesSeed);
  const [employeeLeaves, setEmployeeLeaves] = useState(employeeLeavesSeed);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(Boolean(session?.accessToken));

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const saveSession = (nextSession) => {
    setSession(nextSession);
    window.localStorage.setItem("worksphere_session", JSON.stringify(nextSession));
  };

  const clearSession = async () => {
    const refreshToken = session?.refreshToken;
    setSession(null);
    window.localStorage.removeItem("worksphere_session");
    setActive("dashboard");
    if (refreshToken) {
      try {
        await apiRequest("/api/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken })
        });
      } catch {
        // Local logout should still succeed if the server session is already expired.
      }
    }
  };

  useEffect(() => {
    if (!session?.accessToken) {
      setAuthChecking(false);
      return;
    }

    let cancelled = false;
    const clearExpiredSession = () => {
      setSession(null);
      window.localStorage.removeItem("worksphere_session");
      showToast("Session expired. Please sign in again.");
    };

    apiRequest("/api/auth/me", {
      headers: { Authorization: `Bearer ${session.accessToken}` }
    })
      .then((data) => {
        if (cancelled) return;
        const verifiedSession = sessionFromApiUser(data.user, {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken
        });
        setSession(verifiedSession);
        window.localStorage.setItem("worksphere_session", JSON.stringify(verifiedSession));
      })
      .catch(async () => {
        if (cancelled) return;
        if (!session.refreshToken) {
          clearExpiredSession();
          return;
        }

        try {
          const refreshed = await apiRequest("/api/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken: session.refreshToken })
          });
          if (cancelled) return;
          const refreshedSession = sessionFromApiUser(refreshed.user, {
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken
          });
          setSession(refreshedSession);
          window.localStorage.setItem("worksphere_session", JSON.stringify(refreshedSession));
        } catch {
          if (!cancelled) clearExpiredSession();
        }
      })
      .finally(() => {
        if (!cancelled) setAuthChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (authChecking) {
    return <div className="loading-screen"><ShieldCheck size={30} />Checking secure session...</div>;
  }

  if (!session) {
    return (
      <AuthExperience
        mode={authMode}
        setMode={setAuthMode}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onAuthenticated={(user, tokens) => {
          const nextSession = sessionFromApiUser(user, tokens);
          saveSession(nextSession);
          setSelectedRole(nextSession.role);
          setActive("dashboard");
          showToast(`Welcome to ${ROLE_LABELS[nextSession.role]} workspace`);
        }}
      />
    );
  }

  const role = session.role;
  const navItems = ROLE_NAV[role].map(([key, label, icon]) => ({ key, label, icon }));
  const allowed = new Set(navItems.map((item) => item.key));
  if (role === "admin") allowed.add("profile");
  const safeActive = allowed.has(active) ? active : "dashboard";

  return (
    <div className={`app-shell ${roleColors[role]}`}>
      <Sidebar
        role={role}
        active={safeActive}
        setActive={setActive}
        items={navItems}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={clearSession}
      />
      <main className="workspace">
        <Topbar session={session} setSidebarOpen={setSidebarOpen} setActive={setActive} />
        <section className="content">
          <RoleModule
            active={safeActive}
            role={role}
            adminEmployees={adminEmployees}
            setAdminEmployees={setAdminEmployees}
            hrEmployees={hrEmployees}
            setHrEmployees={setHrEmployees}
            adminLeaves={adminLeaves}
            setAdminLeaves={setAdminLeaves}
            hrLeaves={hrLeaves}
            setHrLeaves={setHrLeaves}
            employeeLeaves={employeeLeaves}
            setEmployeeLeaves={setEmployeeLeaves}
            showToast={showToast}
          />
        </section>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function AuthExperience({ mode, setMode, selectedRole, setSelectedRole, onAuthenticated }) {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand-mark"><ShieldCheck size={20} /> WorkSphere</div>
        <h1>Three HR products, one secure WorkSphere core.</h1>
        <p>Administrators control the company, HR runs people workflows, and employees get a private self-service experience.</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => setMode("login")}>Sign in <ChevronRight size={16} /></button>
          <button className="secondary-btn" onClick={() => setMode("register")}>Create account</button>
        </div>
        <div className="feature-grid">
          {["True RBAC", "Role-specific data", "Protected modules", "Distinct dashboards"].map((item) => <span key={item}><CheckCircle2 size={16} />{item}</span>)}
        </div>
      </section>
      <section className="auth-panel">
        {mode === "landing" && <RolePicker selectedRole={selectedRole} setSelectedRole={setSelectedRole} setMode={setMode} />}
        {mode === "login" && <AuthCard title="Welcome back" action="Sign in" selectedRole={selectedRole} setSelectedRole={setSelectedRole} onAuthenticated={onAuthenticated} setMode={setMode} />}
        {mode === "register" && <AuthCard title="Create your account" action="Create account" selectedRole={selectedRole} setSelectedRole={setSelectedRole} onAuthenticated={onAuthenticated} setMode={setMode} />}
        {mode === "verify" && <VerifyEmail setMode={setMode} />}
      </section>
    </main>
  );
}

function RolePicker({ selectedRole, setSelectedRole, setMode }) {
  const details = {
    admin: "Full control over company settings, employees, payroll, departments and analytics.",
    hr: "Operational access for employees, attendance, leave approvals and HR reports.",
    employee: "Private self-service for attendance, leave, payslips, profile and notifications."
  };

  return (
    <div className="auth-card">
      <Sparkles className="panel-icon" />
      <h2>Choose your role</h2>
      <p>The first screen after login changes completely for each role.</p>
      <div className="role-grid">
        {Object.keys(ROLE_LABELS).map((role) => (
          <button key={role} className={selectedRole === role ? "role-card selected" : "role-card"} onClick={() => setSelectedRole(role)}>
            {role === "employee" ? <User /> : <UserRoundCog />}
            <strong>{ROLE_LABELS[role]}</strong>
            <small>{details[role]}</small>
          </button>
        ))}
      </div>
      <button className="primary-btn full" onClick={() => setMode("login")}>Continue to secure sign in</button>
    </div>
  );
}

function AuthCard({ title, action, selectedRole, setSelectedRole, onAuthenticated, setMode }) {
  const [password, setPassword] = useState("WorkSphere@123!");
  const [name, setName] = useState(ROLE_SESSIONS[selectedRole].name);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = action !== "Sign in";

  useEffect(() => {
    setName(ROLE_SESSIONS[selectedRole].name);
    setError("");
  }, [selectedRole]);

  const submitAuth = async (event) => {
    event.preventDefault();
    setError("");

    if (!password) {
      setError("Enter your password.");
      return;
    }

    if (password.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }

    try {
      setLoading(true);
      const payload = isRegister
        ? { name, email: ROLE_SESSIONS[selectedRole].email, password, role: ROLE_TO_API[selectedRole] }
        : { email: ROLE_SESSIONS[selectedRole].email, password, role: ROLE_TO_API[selectedRole] };
      const data = await apiRequest(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      onAuthenticated(data.user, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
    } catch (authError) {
      setError(authError.message || "Unable to authenticate. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={submitAuth}>
      <h2>{title}</h2>
      {isRegister && <label>Name<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} /></label>}
      <label>Email<input type="email" required value={ROLE_SESSIONS[selectedRole].email} readOnly /></label>
      <label>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} minLength={10} /></label>
      <label>Role<select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}><option value="admin">Administrator</option><option value="hr">HR</option><option value="employee">Employee</option></select></label>
      {error && <div className="form-error">{error}</div>}
      <button className="primary-btn full" disabled={loading}>{loading ? "Checking..." : action}</button>
      <button type="button" className="link-btn" onClick={() => setMode(action === "Sign in" ? "register" : "login")}>
        {action === "Sign in" ? "Need an account?" : "Already registered?"}
      </button>
    </form>
  );
}

function VerifyEmail({ setMode }) {
  return (
    <div className="auth-card center">
      <Mail className="panel-icon" />
      <h2>Verify your email</h2>
      <p>A secure verification link has been prepared for this demo account. Sign in after verification.</p>
      <button className="primary-btn full" onClick={() => setMode("login")}>Back to sign in</button>
    </div>
  );
}

function Sidebar({ role, active, setActive, items, open, setOpen, onLogout }) {
  return (
    <>
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="sidebar-brand"><ShieldCheck size={22} /><div><strong>WorkSphere</strong><span>{ROLE_LABELS[role]} workspace</span></div></div>
        <nav>
          {items.map(({ key, label, icon: Icon }) => (
            <button key={key} className={active === key ? "nav-item active" : "nav-item"} onClick={() => { setActive(key); setOpen(false); }}>
              <Icon size={18} />{label}
            </button>
          ))}
        </nav>
        <button className="nav-item logout" onClick={onLogout}><LogOut size={18} />Sign out</button>
      </aside>
      {open && <button className="scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
    </>
  );
}

function Topbar({ session, setSidebarOpen, setActive }) {
  const titles = {
    admin: "Company command center",
    hr: "HR operations desk",
    employee: "My WorkSphere"
  };

  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={() => setSidebarOpen(true)}><Menu /></button>
      <div>
        <span className="eyebrow">{session.scope}</span>
        <h1>{titles[session.role]}</h1>
      </div>
      <div className="topbar-actions">
        <div className="search"><Search size={16} /><input placeholder={session.role === "employee" ? "Search my records" : "Search people, leave, payroll"} /></div>
        <button className="icon-btn"><Bell /></button>
        <button className="avatar avatar-button" title="View profile" onClick={() => setActive("profile")}>{session.name.split(" ").map((x) => x[0]).join("")}</button>
      </div>
    </header>
  );
}

function RoleModule(props) {
  if (props.role === "admin") return <AdminModule {...props} />;
  if (props.role === "hr") return <HRModule {...props} />;
  return <EmployeeModule {...props} />;
}

function AdminModule(props) {
  const modules = {
    dashboard: <AdminDashboard {...props} />,
    employees: <AdminEmployees {...props} />,
    departments: <Departments showToast={props.showToast} />,
    attendance: <AdminAttendance showToast={props.showToast} />,
    leave: <AdminLeave {...props} />,
    payroll: <AdminPayroll showToast={props.showToast} employees={props.adminEmployees} />,
    reports: <AdminReports employees={props.adminEmployees} />,
    notifications: <Notifications data={adminNotifications} title="System-wide alerts" />,
    settings: <AdminSettings showToast={props.showToast} />,
    profile: <RoleProfile role="admin" />
  };
  return modules[props.active] || modules.dashboard;
}

function HRModule(props) {
  const modules = {
    dashboard: <HRDashboard {...props} />,
    employees: <HREmployees {...props} />,
    attendance: <HRAttendance showToast={props.showToast} />,
    leave: <HRLeave {...props} />,
    payroll: <HRPayroll showToast={props.showToast} />,
    reports: <HRReports employees={props.hrEmployees} />,
    notifications: <Notifications data={hrNotifications} title="HR workflow notifications" />,
    profile: <RoleProfile role="hr" />
  };
  return modules[props.active] || modules.dashboard;
}

function EmployeeModule(props) {
  const modules = {
    dashboard: <EmployeeDashboard {...props} />,
    attendance: <EmployeeAttendance showToast={props.showToast} />,
    leave: <EmployeeLeave {...props} />,
    payroll: <EmployeePayroll showToast={props.showToast} />,
    profile: <RoleProfile role="employee" />,
    notifications: <Notifications data={employeeNotifications} title="My notifications" />,
    settings: <EmployeeSettings showToast={props.showToast} />
  };
  return modules[props.active] || modules.dashboard;
}

function AdminDashboard({ adminEmployees, adminLeaves, showToast }) {
  const payrollTotal = adminEmployees.reduce((sum, employee) => sum + employee.salary, 0);
  return (
    <div className="page-stack">
      <div className="role-hero admin-hero">
        <div><span>Administrator</span><h2>Complete company control</h2><p>System settings, payroll generation, departments, employee accounts and analytics are all available here.</p></div>
        <button className="primary-btn" onClick={() => showToast("Company report exported")}>Export company report</button>
      </div>
      <div className="summary-grid">
        <Metric title="Total Employees" value={adminEmployees.length} detail="Across all departments" icon={Users} />
        <Metric title="Active Employees" value={adminEmployees.filter((x) => x.status === "Active").length} detail="Company-wide" icon={CheckCircle2} />
        <Metric title="Attendance Rate" value="94%" detail="Today" icon={Clock3} />
        <Metric title="Payroll Summary" value={currency(payrollTotal)} detail="Monthly gross" icon={DollarSign} />
      </div>
      <div className="dashboard-grid">
        <Panel title="Workforce trend"><TrendChart /></Panel>
        <Panel title="Department distribution"><DepartmentPie /></Panel>
      </div>
      <div className="two-col">
        <Panel title="Pending leave requests"><LeaveMiniList data={adminLeaves.filter((x) => x.status === "Pending")} /></Panel>
        <Panel title="Recent company activity">{["HR user created for Priya Menon", "June payroll generated", "Engineering budget revised", "New department policy published"].map((item) => <Activity key={item} text={item} />)}</Panel>
      </div>
    </div>
  );
}

function HRDashboard({ hrEmployees, hrLeaves }) {
  return (
    <div className="page-stack">
      <div className="role-hero hr-hero">
        <div><span>HR</span><h2>People workflows, not system control</h2><p>Monitor attendance, onboard employees, review leave and prepare HR reports without administrator privileges.</p></div>
      </div>
      <div className="summary-grid">
        <Metric title="Joined Today" value={hrEmployees.filter((x) => x.joined === "Today").length} detail="New employees" icon={Users} />
        <Metric title="Pending Leave" value={hrLeaves.filter((x) => x.status === "Pending").length} detail="Needs HR review" icon={FileText} />
        <Metric title="Attendance Overview" value="91%" detail="Department average" icon={CalendarCheck} />
        <Metric title="Missing Attendance" value={hrEmployees.filter((x) => x.missingAttendance).length} detail="Corrections needed" icon={Clock3} />
      </div>
      <div className="dashboard-grid">
        <Panel title="Attendance overview"><HRAttendanceChart /></Panel>
        <Panel title="Upcoming birthdays">{["Sara Khan - Jul 9", "Rohan Das - Jul 14", "Nisha Kapoor - Jul 22"].map((item) => <Activity key={item} text={item} />)}</Panel>
      </div>
      <div className="two-col">
        <Panel title="Recently added employees">{hrEmployees.slice(0, 3).map((employee) => <Activity key={employee.id} text={`${employee.name} joined ${employee.department}`} />)}</Panel>
        <Panel title="HR action queue">{["Review 2 leave requests", "Correct 2 attendance records", "Finish onboarding checklist"].map((item) => <Activity key={item} text={item} />)}</Panel>
      </div>
    </div>
  );
}

function EmployeeDashboard({ employeeLeaves, showToast }) {
  const [checkedIn, setCheckedIn] = useState(false);
  return (
    <div className="page-stack employee-home">
      <div className="employee-welcome">
        <div><span>Welcome back</span><h2>Kabir Mehta</h2><p>Your day, leave balance, payslip and personal notifications are private to you.</p></div>
        <button className="primary-btn" onClick={() => { setCheckedIn(!checkedIn); showToast(checkedIn ? "Checked out" : "Checked in"); }}>{checkedIn ? "Check out" : "Check in"}</button>
      </div>
      <div className="employee-grid">
        <Metric title="Today's Attendance" value={checkedIn ? "In office" : "Pending"} detail="Jul 4, 2026" icon={Home} />
        <Metric title="Attendance Status" value="92%" detail="Current month" icon={CalendarCheck} />
        <Metric title="Leave Balance" value="18 days" detail="Remaining" icon={FileText} />
        <Metric title="Current Salary" value={currency(107900)} detail="June net pay" icon={DollarSign} />
      </div>
      <div className="two-col">
        <Panel title="Quick actions">
          <div className="quick-actions">
            <button className="secondary-btn" onClick={() => showToast("Leave form opened")}><Plus size={16} />Apply leave</button>
            <button className="secondary-btn" onClick={() => showToast("Payslip downloaded")}><Download size={16} />Download payslip</button>
            <button className="secondary-btn" onClick={() => showToast("Profile editor opened")}><User size={16} />Edit profile</button>
          </div>
        </Panel>
        <Panel title="Upcoming holidays">{["Independence Day - Aug 15", "Ganesh Chaturthi - Sep 14", "Diwali - Nov 8"].map((item) => <Activity key={item} text={item} />)}</Panel>
      </div>
      <div className="two-col">
        <Panel title="My leave requests"><LeaveMiniList data={employeeLeaves} /></Panel>
        <Notifications data={employeeNotifications} title="Recent notifications" />
      </div>
    </div>
  );
}

function AdminEmployees({ adminEmployees, setAdminEmployees, showToast }) {
  return <EmployeeTable title="Employees" subtitle="Administrator can add, edit and delete employee accounts." employees={adminEmployees} canDelete onAdd={() => {
    setAdminEmployees([{ id: `EMP-${String(adminEmployees.length + 1).padStart(3, "0")}`, name: "New Employee", role: "Business Analyst", department: "Finance", email: "new.employee@worksphere.io", status: "Active", joined: "2026-07-04", salary: 84000, attendance: 100 }, ...adminEmployees]);
    showToast("Employee account created");
  }} showToast={showToast} />;
}

function HREmployees({ hrEmployees, setHrEmployees, showToast }) {
  return <EmployeeTable title="Employees" subtitle="HR can add and edit employee details, but cannot delete users or manage roles." employees={hrEmployees} onAdd={() => {
    setHrEmployees([{ id: `EMP-${String(20 + hrEmployees.length)}`, name: "HR New Joiner", role: "Support Specialist", department: "People", status: "Probation", joined: "Today", missingAttendance: false }, ...hrEmployees]);
    showToast("Employee added to HR roster");
  }} showToast={showToast} />;
}

function EmployeeTable({ title, subtitle, employees, onAdd, canDelete = false, showToast }) {
  const [query, setQuery] = useState("");
  const filtered = employees.filter((employee) => `${employee.name} ${employee.department} ${employee.role}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page-stack">
      <PageHeader title={title} subtitle={subtitle} action={<button className="primary-btn" onClick={onAdd}><Plus size={16}/>Add employee</button>} />
      <div className="toolbar"><div className="search wide"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search permitted employee records" /></div><button className="secondary-btn"><Filter size={16}/>Filters</button></div>
      <DataTable columns={["Employee", "Department", "Status", "Attendance", "Actions"]}>
        {filtered.map((employee) => (
          <tr key={employee.id}>
            <td><strong>{employee.name}</strong><span>{employee.id} | {employee.role}</span></td>
            <td>{employee.department}</td>
            <td><Badge tone={employee.status === "Active" ? "success" : "warning"}>{employee.status}</Badge></td>
            <td>{employee.attendance ? `${employee.attendance}%` : employee.missingAttendance ? "Missing" : "Tracked"}</td>
            <td><button className="ghost-btn" onClick={() => showToast(`${employee.name} opened for editing`)}>Edit</button>{canDelete && <button className="ghost-btn danger-text" onClick={() => showToast(`${employee.name} deleted`)}>Delete</button>}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

function Departments({ showToast }) {
  return (
    <div className="page-stack">
      <PageHeader title="Departments" subtitle="Administrator-only department management." action={<button className="primary-btn" onClick={() => showToast("Department created")}><Plus size={16}/>Add department</button>} />
      <DataTable columns={["Department", "Head", "Employees", "Budget", "Open roles", "Actions"]}>
        {departmentsSeed.map((dept) => <tr key={dept.name}><td><strong>{dept.name}</strong></td><td>{dept.head}</td><td>{dept.employees}</td><td>{dept.budget}</td><td>{dept.openRoles}</td><td><button className="ghost-btn" onClick={() => showToast(`${dept.name} department updated`)}>Manage</button></td></tr>)}
      </DataTable>
    </div>
  );
}

function AdminAttendance({ showToast }) {
  return (
    <div className="page-stack">
      <PageHeader title="Company attendance" subtitle="Administrator sees every attendance record." action={<button className="primary-btn" onClick={() => showToast("Attendance report exported")}><Download size={16}/>Export</button>} />
      <div className="summary-grid"><Metric title="Present" value="87" detail="Today" icon={CheckCircle2}/><Metric title="Late" value="6" detail="Across company" icon={Clock3}/><Metric title="On Leave" value="4" detail="Approved" icon={CalendarCheck}/><Metric title="Absent" value="3" detail="Needs review" icon={X}/></div>
      <Panel title="Company weekly attendance"><AdminAttendanceChart /></Panel>
    </div>
  );
}

function HRAttendance({ showToast }) {
  return (
    <div className="page-stack">
      <PageHeader title="Attendance corrections" subtitle="HR monitors attendance and marks corrections for assigned teams." action={<button className="primary-btn" onClick={() => showToast("Correction marked")}><CheckCircle2 size={16}/>Mark correction</button>} />
      <div className="summary-grid"><Metric title="Tracked" value="23" detail="Assigned staff" icon={Users}/><Metric title="Missing" value="2" detail="Needs correction" icon={Clock3}/><Metric title="Late" value="3" detail="This week" icon={CalendarCheck}/><Metric title="Corrections" value="5" detail="Resolved" icon={CheckCircle2}/></div>
      <Panel title="Department attendance"><HRAttendanceChart /></Panel>
    </div>
  );
}

function EmployeeAttendance({ showToast }) {
  const [checkedIn, setCheckedIn] = useState(false);
  return (
    <div className="page-stack">
      <PageHeader title="My attendance" subtitle="Check in, check out and review your own history." action={<button className="primary-btn" onClick={() => { setCheckedIn(!checkedIn); showToast(checkedIn ? "Checked out at 06:11 PM" : "Checked in at 09:32 AM"); }}>{checkedIn ? "Check out" : "Check in"}</button>} />
      <div className="summary-grid"><Metric title="Today" value={checkedIn ? "In office" : "Pending"} detail="Live status" icon={Home}/><Metric title="Monthly Rate" value="92%" detail="July" icon={CalendarCheck}/><Metric title="Late Marks" value="1" detail="This month" icon={Clock3}/><Metric title="Worked Hours" value="148h" detail="This month" icon={BriefcaseBusiness}/></div>
      <DataTable columns={["Date", "Status", "Check in", "Check out"]}>{employeeAttendance.map((row) => <tr key={row.date}><td><strong>{row.date}</strong></td><td><Badge tone={row.status === "Present" ? "success" : row.status === "Late" ? "warning" : "info"}>{row.status}</Badge></td><td>{row.checkIn}</td><td>{row.checkOut}</td></tr>)}</DataTable>
      <Panel title="Monthly calendar"><div className="calendar-grid">{Array.from({ length: 30 }, (_, index) => <span key={index} className={index % 7 === 2 ? "late-day" : index > 24 ? "future-day" : "present-day"}>{index + 1}</span>)}</div></Panel>
    </div>
  );
}

function AdminLeave({ adminLeaves, setAdminLeaves, showToast }) {
  return <LeaveDesk title="All leave requests" subtitle="Administrator can approve, reject and audit every request." leaves={adminLeaves} setLeaves={setAdminLeaves} showToast={showToast} canReview />;
}

function HRLeave({ hrLeaves, setHrLeaves, showToast }) {
  return <LeaveDesk title="Team leave queue" subtitle="HR can approve or reject assigned employee requests." leaves={hrLeaves} setLeaves={setHrLeaves} showToast={showToast} canReview />;
}

function EmployeeLeave({ employeeLeaves, setEmployeeLeaves, showToast }) {
  const applyLeave = () => {
    setEmployeeLeaves([{ id: `MY-LV-${30 + employeeLeaves.length}`, type: "Casual", from: "2026-07-22", to: "2026-07-22", days: 1, status: "Pending" }, ...employeeLeaves]);
    showToast("Leave request submitted");
  };
  const cancelLeave = (id) => {
    setEmployeeLeaves(employeeLeaves.map((leave) => leave.id === id && leave.status === "Pending" ? { ...leave, status: "Cancelled" } : leave));
    showToast("Pending leave cancelled");
  };
  return (
    <div className="page-stack">
      <PageHeader title="Apply leave" subtitle="Employees can apply, track and cancel their own pending requests." action={<button className="primary-btn" onClick={applyLeave}><Plus size={16}/>Apply leave</button>} />
      <div className="summary-grid"><Metric title="Remaining" value="18" detail="Days available" icon={CalendarCheck}/><Metric title="Pending" value={employeeLeaves.filter((x) => x.status === "Pending").length} detail="Awaiting HR" icon={Clock3}/><Metric title="Approved" value={employeeLeaves.filter((x) => x.status === "Approved").length} detail="This year" icon={CheckCircle2}/><Metric title="Used" value="6" detail="Days" icon={FileText}/></div>
      <DataTable columns={["Request", "Dates", "Days", "Status", "Actions"]}>{employeeLeaves.map((leave) => <tr key={leave.id}><td><strong>{leave.type}</strong><span>{leave.id}</span></td><td>{leave.from} to {leave.to}</td><td>{leave.days}</td><td><Badge tone={leave.status === "Approved" ? "success" : leave.status === "Cancelled" ? "danger" : "warning"}>{leave.status}</Badge></td><td>{leave.status === "Pending" ? <button className="ghost-btn danger-text" onClick={() => cancelLeave(leave.id)}>Cancel</button> : "No action"}</td></tr>)}</DataTable>
    </div>
  );
}

function LeaveDesk({ title, subtitle, leaves, setLeaves, showToast, canReview }) {
  const updateLeave = (id, status) => {
    setLeaves(leaves.map((leave) => leave.id === id ? { ...leave, status } : leave));
    showToast(`Leave ${status.toLowerCase()}`);
  };
  return (
    <div className="page-stack">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="summary-grid"><Metric title="Pending" value={leaves.filter((x) => x.status === "Pending").length} detail="Awaiting decision" icon={Clock3}/><Metric title="Approved" value={leaves.filter((x) => x.status === "Approved").length} detail="This cycle" icon={CheckCircle2}/><Metric title="Rejected" value={leaves.filter((x) => x.status === "Rejected").length} detail="This cycle" icon={X}/><Metric title="Total Days" value={leaves.reduce((sum, leave) => sum + leave.days, 0)} detail="Requested" icon={CalendarCheck}/></div>
      <DataTable columns={["Request", "Dates", "Days", "Status", "Actions"]}>{leaves.map((leave) => <tr key={leave.id}><td><strong>{leave.employee}</strong><span>{leave.id} | {leave.type} | {leave.team}</span></td><td>{leave.from} to {leave.to}</td><td>{leave.days}</td><td><Badge tone={leave.status === "Approved" ? "success" : leave.status === "Rejected" ? "danger" : "warning"}>{leave.status}</Badge></td><td>{canReview ? <><button className="ghost-btn" onClick={() => updateLeave(leave.id, "Approved")}>Approve</button><button className="ghost-btn danger-text" onClick={() => updateLeave(leave.id, "Rejected")}>Reject</button></> : "View only"}</td></tr>)}</DataTable>
    </div>
  );
}

function AdminPayroll({ employees, showToast }) {
  const payrollTotal = employees.reduce((sum, employee) => sum + employee.salary, 0);
  return (
    <div className="page-stack">
      <PageHeader title="Payroll administration" subtitle="Generate payroll, export payroll and review salary statistics." action={<button className="primary-btn" onClick={() => showToast("Payroll generated")}><DollarSign size={16}/>Generate payroll</button>} />
      <div className="summary-grid"><Metric title="Gross Payroll" value={currency(payrollTotal)} detail="Monthly" icon={DollarSign}/><Metric title="Deductions" value={currency(486000)} detail="Estimated" icon={FileText}/><Metric title="Net Payroll" value={currency(payrollTotal - 486000)} detail="Payable" icon={CheckCircle2}/><Metric title="Employees Paid" value={employees.length} detail="Current run" icon={Users}/></div>
      <button className="secondary-btn fit" onClick={() => showToast("Payroll export ready")}><Download size={16}/>Export payroll</button>
    </div>
  );
}

function HRPayroll({ showToast }) {
  return (
    <div className="page-stack">
      <PageHeader title="Payroll review" subtitle="HR has limited payroll access for viewing and updating salary components." action={<button className="primary-btn" onClick={() => showToast("Salary components updated")}><DollarSign size={16}/>Update components</button>} />
      <DataTable columns={["Employee", "Basic", "Allowance", "Deduction", "Status"]}>{["Kabir Mehta", "Nisha Kapoor", "Rohan Das"].map((name, index) => <tr key={name}><td><strong>{name}</strong></td><td>{currency(72000 + index * 4000)}</td><td>{currency(18000)}</td><td>{currency(8200)}</td><td><Badge tone="info">Review only</Badge></td></tr>)}</DataTable>
    </div>
  );
}

function EmployeePayroll({ showToast }) {
  const totalNet = employeePayroll.reduce((sum, row) => sum + row.net, 0);
  return (
    <div className="page-stack">
      <PageHeader title="My payroll" subtitle="Employees can view salary and download payslips only." action={<button className="primary-btn" onClick={() => showToast("Payslip downloaded")}><Download size={16}/>Download payslip</button>} />
      <div className="summary-grid"><Metric title="Gross Salary" value={currency(118000)} detail="Current month" icon={DollarSign}/><Metric title="Deductions" value={currency(10100)} detail="Tax and benefits" icon={FileText}/><Metric title="Net Pay" value={currency(107900)} detail="June 2026" icon={CheckCircle2}/><Metric title="YTD Net" value={currency(totalNet)} detail="Paid" icon={BriefcaseBusiness}/></div>
      <DataTable columns={["Month", "Gross", "Deductions", "Net salary", "Status"]}>{employeePayroll.map((row) => <tr key={row.month}><td><strong>{row.month}</strong></td><td>{currency(row.gross)}</td><td>{currency(row.deductions)}</td><td>{currency(row.net)}</td><td><Badge tone="success">{row.status}</Badge></td></tr>)}</DataTable>
    </div>
  );
}

function AdminReports({ employees }) {
  return (
    <div className="page-stack">
      <PageHeader title="Company reports and analytics" subtitle="Administrator-only analytics across departments, payroll and attendance." action={<button className="primary-btn"><Download size={16}/>Export reports</button>} />
      <div className="dashboard-grid"><Panel title="Company performance"><TrendChart /></Panel><Panel title="Department analytics"><AnalyticsRows employees={employees} /></Panel></div>
    </div>
  );
}

function HRReports({ employees }) {
  return (
    <div className="page-stack">
      <PageHeader title="HR reports" subtitle="HR analytics for onboarding, leave, attendance and assigned employee health." action={<button className="primary-btn"><Download size={16}/>Generate HR report</button>} />
      <div className="dashboard-grid"><Panel title="Department attendance"><HRAttendanceChart /></Panel><Panel title="Assigned employee health"><AnalyticsRows employees={employees} /></Panel></div>
    </div>
  );
}

function RoleProfile({ role }) {
  const profiles = {
    admin: { initials: "AR", name: "Anika Rao", title: "Platform Administrator", email: "admin@worksphere.io", department: "Executive", access: "Full company administration, RBAC, payroll and system settings" },
    hr: { initials: "PM", name: "Priya Menon", title: "HR Business Partner", email: "hr@worksphere.io", department: "People", access: "Employee, attendance, leave and HR reports" },
    employee: { initials: "KM", name: "Kabir Mehta", title: "Backend Engineer", email: "employee@worksphere.io", department: "Engineering", access: "Own attendance, leave, payroll and documents" }
  };
  const profile = profiles[role];
  return (
    <div className="profile-layout">
      <Panel title={role === "admin" ? "Admin profile" : role === "hr" ? "HR profile" : "Personal profile"}><div className="profile-card"><div className="profile-avatar">{profile.initials}</div><h2>{profile.name}</h2><p>{profile.title}</p><Badge tone="success">Active</Badge></div></Panel>
      <Panel title="Profile information"><div className="details-grid">{Object.entries({ Email: profile.email, Department: profile.department, Access: profile.access, Phone: "+91 98765 11003", Address: "Bengaluru, Karnataka", "Emergency contact": "+91 98765 22003" }).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div></Panel>
      <Panel title="Documents">{["Identity proof", "Bank document", "Offer letter", "Experience letter"].map((doc) => <Activity key={doc} text={doc} />)}</Panel>
    </div>
  );
}

function AdminSettings({ showToast }) {
  return (
    <div className="settings-grid">
      <Panel title="System settings"><label>Company name<input defaultValue="WorkSphere Technologies" /></label><label>Payroll lock date<input defaultValue="25" /></label><button className="primary-btn" onClick={() => showToast("System settings saved")}>Save system settings</button></Panel>
      <Panel title="User and role management"><label>Default employee role<select defaultValue="Employee"><option>Employee</option><option>HR</option></select></label><label>Require email verification<select defaultValue="Yes"><option>Yes</option><option>No</option></select></label><button className="secondary-btn" onClick={() => showToast("Role policy updated")}>Update role policy</button></Panel>
    </div>
  );
}

function EmployeeSettings({ showToast }) {
  return (
    <div className="settings-grid">
      <Panel title="Profile settings"><label>Display name<input defaultValue="Kabir Mehta" /></label><label>Personal email<input defaultValue="kabir.personal@example.com" /></label><button className="primary-btn" onClick={() => showToast("Profile settings saved")}>Save profile</button></Panel>
      <Panel title="Password"><label>Current password<input type="password" defaultValue="password" /></label><label>New password<input type="password" placeholder="Minimum 8 characters" /></label><button className="secondary-btn" onClick={() => showToast("Password updated")}>Update password</button></Panel>
    </div>
  );
}

function Notifications({ data, title }) {
  return <Panel title={title}>{data.map((note) => <div className={`notice ${note.tone}`} key={note.title}><Bell size={18}/><div><strong>{note.title}</strong><span>{note.detail}</span></div></div>)}</Panel>;
}

function TrendChart() {
  return <ResponsiveContainer width="100%" height={260}><AreaChart data={workforceTrend}><defs><linearGradient id="score" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis hide domain={[60, 100]}/><Tooltip/><Area dataKey="score" stroke="#4f46e5" fill="url(#score)" strokeWidth={3}/></AreaChart></ResponsiveContainer>;
}

function DepartmentPie() {
  return <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={departmentsSeed} dataKey="employees" nameKey="name" innerRadius={58} outerRadius={88}>{departmentsSeed.map((_, index) => <Cell key={index} fill={["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"][index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>;
}

function AdminAttendanceChart() {
  return <ResponsiveContainer width="100%" height={310}><BarChart data={adminAttendance}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Bar dataKey="present" fill="#22c55e" radius={[6,6,0,0]}/><Bar dataKey="late" fill="#f59e0b" radius={[6,6,0,0]}/><Bar dataKey="leave" fill="#ef4444" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>;
}

function HRAttendanceChart() {
  return <ResponsiveContainer width="100%" height={280}><BarChart data={hrAttendance}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Bar dataKey="present" fill="#4f46e5" radius={[6,6,0,0]}/><Bar dataKey="late" fill="#f59e0b" radius={[6,6,0,0]}/><Bar dataKey="missing" fill="#ef4444" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>;
}

function AnalyticsRows({ employees }) {
  const rows = useMemo(() => departmentsSeed.map((dept) => {
    const scoped = employees.filter((employee) => employee.department === dept.name);
    const averageAttendance = scoped.length ? Math.round(scoped.reduce((sum, employee) => sum + (employee.attendance || 91), 0) / scoped.length) : 91;
    return { ...dept, averageAttendance };
  }), [employees]);
  return <div className="stacked-list">{rows.map((dept) => <div className="analytics-row" key={dept.name}><strong>{dept.name}</strong><span>{dept.employees} employees</span><progress value={dept.averageAttendance} max="100" /></div>)}</div>;
}

function LeaveMiniList({ data }) {
  return data.length ? data.map((leave) => <Activity key={leave.id} text={`${leave.employee || leave.type} | ${leave.days} day(s) | ${leave.status}`} />) : <p className="empty-state">No matching leave requests.</p>;
}

function DataTable({ columns, children }) {
  return <div className="table-card"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Metric({ title, value, detail, icon: Icon }) {
  return <article className="metric"><div><span>{title}</span><strong>{value}</strong><small>{detail}</small></div><Icon /></article>;
}

function Panel({ title, action, children }) {
  return <section className="panel"><div className="panel-header"><h2>{title}</h2>{action}</div>{children}</section>;
}

function PageHeader({ title, subtitle, action }) {
  return <div className="page-header"><div><h2>{title}</h2><p>{subtitle}</p></div>{action}</div>;
}

function Badge({ tone = "info", children }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Activity({ text }) {
  return <div className="activity"><span /><p>{text}</p></div>;
}

export default App;
