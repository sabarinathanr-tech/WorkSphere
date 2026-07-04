export function getAttendance(_req, res) {
  res.json({
    today: { present: 44, late: 3, leave: 2, absent: 1 },
    week: [
      { day: "Mon", present: 42, late: 4, leave: 2 },
      { day: "Tue", present: 45, late: 2, leave: 1 },
      { day: "Wed", present: 43, late: 5, leave: 2 }
    ]
  });
}

export function checkIn(_req, res) {
  res.status(201).json({ status: "PRESENT", checkIn: new Date().toISOString() });
}

export function checkOut(_req, res) {
  res.json({ status: "PRESENT", checkOut: new Date().toISOString() });
}
