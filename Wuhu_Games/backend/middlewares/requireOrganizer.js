export function requireOrganizer(req, res, next) {
  if (req.user?.role !== "organisateur") {
    return res.status(403).json({ error: "Forbidden" })
  }
  next()
}
