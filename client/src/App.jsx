import { useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
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

const employeesSeed = [
  { id: "EMP-001", name: "Aarav Shah", role: "Product Designer", department: "Design", email: "aarav@worksphere.io", phone: "+91 98765 11001", status: "Active", joined: "2023-04-18", salary: 78000, attendance: 96 },
  { id: "EMP-002", name: "Anika Rao", role: "HR Manager", department: "People", email: "anika@worksphere.io", phone: "+91 98765 11002", status: "Active", joined: "2022-11-05", salary: 92000, attendance: 98 },
  { id: "EMP-003", name: "Kabir Mehta", role: "Backend Engineer", department: "Engineering", email: "kabir@worksphere.io", phone: "+91 98765 11003", status: "Active", joined: "2024-01-09", salary: 118000, attendance: 92 },
  { id: "EMP-004", name: "Meera Iyer", role: "Finance Analyst", department: "Finance", email: "meera@worksphere.io", phone: "+91 98765 11004", status: "On Leave", joined: "2021-08-24", salary: 88000, attendance: 89 },
  { id: "EMP-005", name: "Dev Nair", role: "Sales Lead", department: "Sales", email: "dev@worksphere.io", phone: "+91 98765 11005", status: "Active", joined: "2023-09-12", salary: 104000, attendance: 94 }
];

const leavesSeed = [
  { id: "LV-1104", employee: "Meera Iyer", type: "Medical", from: "2026-07-03", to: "2026-07-05", days: 3, status: "Pending" },
  { id: "LV-1103", employee: "Aarav Shah", type: "Casual", from: "2026-07-08", to: "2026-07-08", days: 1, status: "Approved" },
  { id: "LV-1102", employee: "Kabir Mehta", type: "Earned", from: "2026-07-12", to: "2026-07-15", days: 4, status: "Pending" },
  { id: "LV-1101", employee: "Dev Nair", type: "Casual", from: "2026-06-27", to: "2026-06-27", days: 1, status: "Rejected" }
];

const attendance = [
  { day: "Mon", present: 42, late: 4, leave: 2 },
  { day: "Tue", present: 45, late: 2, leave: 1 },
  { day: "Wed", present: 43, late: 5, leave: 2 },
  { day: "Thu", present: 46, late: 1, leave: 1 },
  { day: "Fri", present: 44, late: 3, leave: 2 },
  { day: "Sat", present: 28, late: 1, leave: 1 }
];

const trend = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 84 },
  { month: "Mar", score: 81 },
  { month: "Apr", score: 89 },
  { month: "May", score: 86 },
  { month: "Jun", score: 93 },
  { month: "Jul", score: 91 }
];

const departments = [
  { name: "Engineering", head: "Riya Sen", employees: 18, budget: "₹21.4L" },
  { name: "People", head: "Anika Rao", employees: 7, budget: "₹6.8L" },
  { name: "Design", head: "Aarav Shah", employees: 6, budget: "₹5.2L" },
  { name: "Finance", head: "Meera Iyer", employees: 8, budget: "₹8.1L" },
  { name: "Sales", head: "Dev Nair", employees: 12, budget: "₹13.7L" }
];

const payroll = [
  { month: "March 2026", gross: 118000, deductions: 11200, net: 106800, status: "Paid" },
  { month: "April 2026", gross: 118000, deductions: 9800, net: 108200, status: "Paid" },
  { month: "May 2026", gross: 118000, deductions: 10350, net: 107650, status: "Paid" },
  { month: "June 2026", gross: 118000, deductions: 10100, net: 107900, status: "Paid" }
];

const activities = [
  "Anika approved Aarav's casual leave",
  "Kabir checked in at 09:42 AM",
  "Payroll for June 2026 was processed",
  "Meera uploaded address proof",
  "Dev updated sales department roster"
];

const notifications = [
  { title: "Leave request needs review", detail: "2 pending approvals", tone: "warning" },
  { title: "Payroll run completed", detail: "June salaries are ready", tone: "success" },
  { title: "Policy document updated", detail: "Remote work policy v3", tone: "info" }
];

const nav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "employees", label: "Employees", icon: Users, adminOnly: true },
  { key: "attendance", label: "Attendance", icon: CalendarCheck },
  { key: "leave", label: "Leave", icon: FileText },
  { key: "payroll", label: "Payroll", icon: DollarSign },
  { key: "profile", label: "My Profile", icon: User },
  { key: "reports", label: "Reports", icon: BarChart3, adminOnly: true },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings }
];

function currency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function App() {
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("landing");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [active, setActive] = useState("dashboard");
  const [employees, setEmployees] = useState(employeesSeed);
  const [leaves, setLeaves] = useState(leavesSeed);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  if (!session) {
    return (
      <AuthExperience
        mode={authMode}
        setMode={setAuthMode}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onEnter={() => {
          setSession({ name: selectedRole === "Employee" ? "Kabir Mehta" : "Anika Rao", role: selectedRole });
          setActive("dashboard");
          showToast(`Welcome to WorkSphere, ${selectedRole}`);
        }}
      />
    );
  }

  const role = session.role;
  const visibleNav = nav.filter((item) => !item.adminOnly || role !== "Employee");

  return (
    <div className="app-shell">
      <Sidebar
        role={role}
        active={active}
        setActive={setActive}
        items={visibleNav}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={() => setSession(null)}
      />
      <main className="workspace">
        <Topbar session={session} setSidebarOpen={setSidebarOpen} />
        <section className="content">
          <Module
            active={active}
            role={role}
            employees={employees}
            setEmployees={setEmployees}
            leaves={leaves}
            setLeaves={setLeaves}
            showToast={showToast}
          />
        </section>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function AuthExperience({ mode, setMode, selectedRole, setSelectedRole, onEnter }) {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand-mark"><ShieldCheck size={20} /> WorkSphere</div>
        <h1>Complete HR operations, calm enough for Monday morning.</h1>
        <p>Run employee records, attendance, leave, payroll and reporting from one premium HRMS workspace.</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => setMode("login")}>Sign in <ChevronRight size={16} /></button>
          <button className="secondary-btn" onClick={() => setMode("register")}>Create company account</button>
        </div>
        <div className="feature-grid">
          {["Role-based access", "Payroll ready", "Leave workflows", "Responsive dashboards"].map((item) => <span key={item}><CheckCircle2 size={16} />{item}</span>)}
        </div>
      </section>
      <section className="auth-panel">
        {mode === "landing" && <RolePicker selectedRole={selectedRole} setSelectedRole={setSelectedRole} onEnter={onEnter} />}
        {mode === "login" && <AuthCard title="Welcome back" action="Sign in" selectedRole={selectedRole} setSelectedRole={setSelectedRole} onEnter={onEnter} setMode={setMode} />}
        {mode === "register" && <AuthCard title="Create your account" action="Create account" selectedRole={selectedRole} setSelectedRole={setSelectedRole} onEnter={() => setMode("verify")} setMode={setMode} />}
        {mode === "verify" && <VerifyEmail onEnter={onEnter} />}
      </section>
    </main>
  );
}

function RolePicker({ selectedRole, setSelectedRole, onEnter }) {
  return (
    <div className="auth-card">
      <Sparkles className="panel-icon" />
      <h2>Choose your role</h2>
      <p>Select the workspace experience to preview.</p>
      <div className="role-grid">
        {["Admin", "HR", "Employee"].map((role) => (
          <button key={role} className={selectedRole === role ? "role-card selected" : "role-card"} onClick={() => setSelectedRole(role)}>
            {role === "Employee" ? <User /> : <UserRoundCog />}
            <strong>{role}</strong>
            <small>{role === "Employee" ? "Self-service profile, attendance and payroll." : "Manage people, approvals, payroll and reports."}</small>
          </button>
        ))}
      </div>
      <button className="primary-btn full" onClick={onEnter}>Enter dashboard</button>
    </div>
  );
}

function AuthCard({ title, action, selectedRole, setSelectedRole, onEnter, setMode }) {
  return (
    <form className="auth-card" onSubmit={(event) => { event.preventDefault(); onEnter(); }}>
      <h2>{title}</h2>
      <label>Email<input type="email" required defaultValue={selectedRole === "Employee" ? "employee@worksphere.io" : "admin@worksphere.io"} /></label>
      <label>Password<input type="password" required defaultValue="WorkSphere@123" minLength={8} /></label>
      <label>Role<select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}><option>Admin</option><option>HR</option><option>Employee</option></select></label>
      <button className="primary-btn full">{action}</button>
      <button type="button" className="link-btn" onClick={() => setMode(action === "Sign in" ? "register" : "login")}>
        {action === "Sign in" ? "Need an account?" : "Already registered?"}
      </button>
    </form>
  );
}

function VerifyEmail({ onEnter }) {
  return (
    <div className="auth-card center">
      <Mail className="panel-icon" />
      <h2>Verify your email</h2>
      <p>A secure verification link has been prepared for this demo account.</p>
      <button className="primary-btn full" onClick={onEnter}>Verify and continue</button>
    </div>
  );
}

function Sidebar({ role, active, setActive, items, open, setOpen, onLogout }) {
  return (
    <>
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="sidebar-brand"><ShieldCheck size={22} /><div><strong>WorkSphere</strong><span>{role} workspace</span></div></div>
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

function Topbar({ session, setSidebarOpen }) {
  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={() => setSidebarOpen(true)}><Menu /></button>
      <div>
        <span className="eyebrow">Human Resource Management System</span>
        <h1>{session.role === "Employee" ? "Employee self-service" : "People operations command center"}</h1>
      </div>
      <div className="topbar-actions">
        <div className="search"><Search size={16} /><input placeholder="Search people, leave, payroll" /></div>
        <button className="icon-btn"><Bell /></button>
        <div className="avatar">{session.name.split(" ").map((x) => x[0]).join("")}</div>
      </div>
    </header>
  );
}

function Module(props) {
  const modules = {
    dashboard: <Dashboard {...props} />,
    employees: <Employees {...props} />,
    attendance: <Attendance {...props} />,
    leave: <Leave {...props} />,
    payroll: <Payroll {...props} />,
    profile: <Profile {...props} />,
    reports: <Reports {...props} />,
    notifications: <Notifications />,
    settings: <SettingsPage showToast={props.showToast} />
  };
  return modules[props.active] || modules.dashboard;
}

function Dashboard({ role, employees, leaves, showToast }) {
  const totalPayroll = employees.reduce((sum, employee) => sum + employee.salary, 0);
  return (
    <div className="page-stack">
      <div className="summary-grid">
        <Metric title="Employees" value={employees.length} detail="+3 this month" icon={Users} />
        <Metric title="Attendance" value="94%" detail="Company average" icon={Clock3} />
        <Metric title="Pending Leave" value={leaves.filter((x) => x.status === "Pending").length} detail="Needs action" icon={FileText} />
        <Metric title="Payroll" value={currency(totalPayroll)} detail="Monthly gross" icon={DollarSign} />
      </div>
      <div className="dashboard-grid">
        <Panel title="Workforce trend" action={<button className="ghost-btn" onClick={() => showToast("Report exported")}>Export</button>}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend}><defs><linearGradient id="score" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis hide domain={[60, 100]}/><Tooltip/><Area dataKey="score" stroke="#4f46e5" fill="url(#score)" strokeWidth={3}/></AreaChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Department mix">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={departments} dataKey="employees" nameKey="name" innerRadius={58} outerRadius={88}>{departments.map((_, index) => <Cell key={index} fill={["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"][index]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div className="two-col">
        <Panel title={role === "Employee" ? "My week" : "Attendance snapshot"}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendance}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis hide/><Tooltip/><Bar dataKey="present" fill="#4f46e5" radius={[6, 6, 0, 0]}/><Bar dataKey="late" fill="#f59e0b" radius={[6, 6, 0, 0]}/></BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Recent activity">{activities.map((item) => <Activity key={item} text={item} />)}</Panel>
      </div>
    </div>
  );
}

function Employees({ employees, setEmployees, showToast }) {
  const [query, setQuery] = useState("");
  const filtered = employees.filter((employee) => `${employee.name} ${employee.department} ${employee.role}`.toLowerCase().includes(query.toLowerCase()));
  const addEmployee = () => {
    const next = { id: `EMP-00${employees.length + 1}`, name: "New Teammate", role: "Frontend Engineer", department: "Engineering", email: "new@worksphere.io", phone: "+91 98765 11999", status: "Active", joined: "2026-07-04", salary: 96000, attendance: 100 };
    setEmployees([next, ...employees]);
    showToast("Employee record created");
  };
  return (
    <div className="page-stack">
      <PageHeader title="Employees" subtitle="Search, filter and maintain employee records." action={<button className="primary-btn" onClick={addEmployee}><Plus size={16}/>Add employee</button>} />
      <div className="toolbar"><div className="search wide"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employees" /></div><button className="secondary-btn"><Filter size={16}/>Filters</button></div>
      <div className="table-card">
        <table><thead><tr><th>Employee</th><th>Department</th><th>Status</th><th>Attendance</th><th>Salary</th><th></th></tr></thead>
          <tbody>{filtered.map((employee) => <tr key={employee.id}><td><strong>{employee.name}</strong><span>{employee.id} · {employee.role}</span></td><td>{employee.department}</td><td><Badge tone={employee.status === "Active" ? "success" : "warning"}>{employee.status}</Badge></td><td>{employee.attendance}%</td><td>{currency(employee.salary)}</td><td><button className="ghost-btn" onClick={() => showToast(`${employee.name}'s profile opened`)}>View</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function Attendance({ role, showToast }) {
  const [checkedIn, setCheckedIn] = useState(false);
  return (
    <div className="page-stack">
      <PageHeader title="Attendance" subtitle="Track check-ins, late marks, leave and monthly attendance patterns." action={<button className="primary-btn" onClick={() => { setCheckedIn(!checkedIn); showToast(checkedIn ? "Checked out at 06:11 PM" : "Checked in at 09:32 AM"); }}>{checkedIn ? "Check out" : "Check in"}</button>} />
      <div className="summary-grid"><Metric title="Present" value="44" detail="Today" icon={CheckCircle2}/><Metric title="Late" value="3" detail="Today" icon={Clock3}/><Metric title="On leave" value="2" detail="Approved" icon={CalendarCheck}/><Metric title={role === "Employee" ? "My status" : "Company status"} value={checkedIn ? "In office" : "Pending"} detail="Live attendance" icon={Home}/></div>
      <Panel title="Weekly attendance"><ResponsiveContainer width="100%" height={310}><BarChart data={attendance}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Bar dataKey="present" fill="#22c55e" radius={[6,6,0,0]}/><Bar dataKey="late" fill="#f59e0b" radius={[6,6,0,0]}/><Bar dataKey="leave" fill="#ef4444" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></Panel>
    </div>
  );
}

function Leave({ leaves, setLeaves, showToast }) {
  const updateLeave = (id, status) => {
    setLeaves(leaves.map((leave) => leave.id === id ? { ...leave, status } : leave));
    showToast(`Leave ${status.toLowerCase()}`);
  };
  const applyLeave = () => {
    setLeaves([{ id: `LV-${1110 + leaves.length}`, employee: "Kabir Mehta", type: "Casual", from: "2026-07-18", to: "2026-07-18", days: 1, status: "Pending" }, ...leaves]);
    showToast("Leave request submitted");
  };
  return (
    <div className="page-stack">
      <PageHeader title="Leave management" subtitle="Apply, approve, reject and audit leave requests." action={<button className="primary-btn" onClick={applyLeave}><Plus size={16}/>Apply leave</button>} />
      <div className="summary-grid"><Metric title="Annual balance" value="18" detail="Days available" icon={CalendarCheck}/><Metric title="Pending" value={leaves.filter((x) => x.status === "Pending").length} detail="Awaiting review" icon={Clock3}/><Metric title="Approved" value={leaves.filter((x) => x.status === "Approved").length} detail="This cycle" icon={CheckCircle2}/><Metric title="Rejected" value={leaves.filter((x) => x.status === "Rejected").length} detail="This cycle" icon={X}/></div>
      <div className="table-card"><table><thead><tr><th>Request</th><th>Dates</th><th>Days</th><th>Status</th><th>Actions</th></tr></thead><tbody>{leaves.map((leave) => <tr key={leave.id}><td><strong>{leave.employee}</strong><span>{leave.id} · {leave.type}</span></td><td>{leave.from} to {leave.to}</td><td>{leave.days}</td><td><Badge tone={leave.status === "Approved" ? "success" : leave.status === "Rejected" ? "danger" : "warning"}>{leave.status}</Badge></td><td><button className="ghost-btn" onClick={() => updateLeave(leave.id, "Approved")}>Approve</button><button className="ghost-btn danger-text" onClick={() => updateLeave(leave.id, "Rejected")}>Reject</button></td></tr>)}</tbody></table></div>
    </div>
  );
}

function Payroll({ showToast }) {
  const totalNet = payroll.reduce((sum, row) => sum + row.net, 0);
  return (
    <div className="page-stack">
      <PageHeader title="Payroll" subtitle="Salary components, deductions and payment history." action={<button className="primary-btn" onClick={() => showToast("Payslip downloaded")}><Download size={16}/>Download payslip</button>} />
      <div className="summary-grid"><Metric title="Gross salary" value={currency(118000)} detail="Current month" icon={DollarSign}/><Metric title="Deductions" value={currency(10100)} detail="Tax and benefits" icon={FileText}/><Metric title="Net pay" value={currency(107900)} detail="June 2026" icon={CheckCircle2}/><Metric title="YTD net" value={currency(totalNet)} detail="Paid" icon={BriefcaseBusiness}/></div>
      <div className="table-card"><table><thead><tr><th>Month</th><th>Gross</th><th>Deductions</th><th>Net salary</th><th>Status</th></tr></thead><tbody>{payroll.map((row) => <tr key={row.month}><td><strong>{row.month}</strong></td><td>{currency(row.gross)}</td><td>{currency(row.deductions)}</td><td>{currency(row.net)}</td><td><Badge tone="success">{row.status}</Badge></td></tr>)}</tbody></table></div>
    </div>
  );
}

function Profile({ employees }) {
  const employee = employees[2];
  return (
    <div className="profile-layout">
      <Panel title="My profile">
        <div className="profile-card"><div className="profile-avatar">KM</div><h2>{employee.name}</h2><p>{employee.role}</p><Badge tone="success">{employee.status}</Badge></div>
      </Panel>
      <Panel title="Personal and job information">
        <div className="details-grid">{Object.entries({ Email: employee.email, Phone: employee.phone, Department: employee.department, "Employee ID": employee.id, "Join date": employee.joined, "Emergency contact": "+91 98765 22003", Address: "Bengaluru, Karnataka", Manager: "Riya Sen" }).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div>
      </Panel>
      <Panel title="Documents"><div className="doc-list">{["Aadhaar proof", "PAN card", "Offer letter", "Experience letter"].map((doc) => <Activity key={doc} text={doc} />)}</div></Panel>
    </div>
  );
}

function Reports({ employees }) {
  const reportRows = useMemo(() => departments.map((dept) => ({ ...dept, averageAttendance: Math.round(employees.filter((employee) => employee.department === dept.name).reduce((sum, employee) => sum + employee.attendance, 0) / Math.max(1, employees.filter((employee) => employee.department === dept.name).length)) || 92 })), [employees]);
  return (
    <div className="page-stack">
      <PageHeader title="Reports and analytics" subtitle="Department health, attendance trends and payroll indicators." action={<button className="primary-btn"><Download size={16}/>Export report</button>} />
      <div className="dashboard-grid"><Panel title="HR performance score"><ResponsiveContainer width="100%" height={280}><AreaChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis domain={[60, 100]}/><Tooltip/><Area dataKey="score" stroke="#4f46e5" fill="#c7d2fe" strokeWidth={3}/></AreaChart></ResponsiveContainer></Panel><Panel title="Department analytics"><div className="stacked-list">{reportRows.map((dept) => <div className="analytics-row" key={dept.name}><strong>{dept.name}</strong><span>{dept.employees} employees</span><progress value={dept.averageAttendance} max="100" /></div>)}</div></Panel></div>
    </div>
  );
}

function Notifications() {
  return <Panel title="Notifications">{notifications.map((note) => <div className={`notice ${note.tone}`} key={note.title}><Bell size={18}/><div><strong>{note.title}</strong><span>{note.detail}</span></div></div>)}</Panel>;
}

function SettingsPage({ showToast }) {
  return (
    <div className="settings-grid">
      <Panel title="Account settings"><label>Display name<input defaultValue="Anika Rao" /></label><label>Work email<input defaultValue="anika@worksphere.io" /></label><button className="primary-btn" onClick={() => showToast("Settings saved")}>Save changes</button></Panel>
      <Panel title="Security"><label>Current password<input type="password" defaultValue="password" /></label><label>New password<input type="password" placeholder="Minimum 8 characters" /></label><button className="secondary-btn" onClick={() => showToast("Password updated")}>Update password</button></Panel>
    </div>
  );
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
