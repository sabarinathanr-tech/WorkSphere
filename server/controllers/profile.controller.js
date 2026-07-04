export function getProfile(_req, res) {
  res.json({
    employeeId: "EMP-003",
    name: "Kabir Mehta",
    role: "Backend Engineer",
    department: "Engineering",
    phone: "+91 98765 11003",
    emergencyContact: "+91 98765 22003"
  });
}

export function updateProfile(req, res) {
  res.json({ message: "Profile updated", profile: req.body });
}
