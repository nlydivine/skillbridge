const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const seed = require("./seed");

const SECRET = process.env.JWT_SECRET || "skillbridge-secret";
const FILE = "db.json";

function load() {
  if (fs.existsSync(FILE)) return JSON.parse(fs.readFileSync(FILE, "utf8"));
  const hash = bcrypt.hashSync("demo1234", 8);
  return {
    skills: seed.skills,
    resources: seed.resources,
    users: seed.people.map(([id, name, email, role, extra]) => ({
      id, name, email, role, passwordHash: hash,
      ...(role === "jobseeker" ? { skills: extra } : { companyName: extra }),
    })),
    jobs: seed.jobs.map(([id, title, location, employerId, requiredSkills]) => ({
      id, title, location, employerId, requiredSkills,
    })),
    applications: [],
  };
}

const db = load();
const save = () => fs.writeFileSync(FILE, JSON.stringify(db, null, 2));

function matchJob(seekerSkills, job) {
  const have = job.requiredSkills.filter((s) => seekerSkills.includes(s));
  const missing = job.requiredSkills.filter((s) => !seekerSkills.includes(s));
  const percent = Math.round((have.length / job.requiredSkills.length) * 100);
  return { percent, have, missing };
}

const app = express();
app.use(cors());
app.use(express.json());

const makeToken = (user) => jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });
const publicUser = ({ passwordHash, ...rest }) => rest;

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role, companyName } = req.body;
  if (!name || !email || !password || !["jobseeker", "employer"].includes(role))
    return res.status(400).json({ error: "Fill in all fields and choose a role." });
  if (db.users.some((u) => u.email === email))
    return res.status(409).json({ error: "This email is already registered." });
  const user = {
    id: "u" + Date.now(), name, email, role,
    passwordHash: bcrypt.hashSync(password, 8),
    ...(role === "jobseeker" ? { skills: [] } : { companyName: companyName || name }),
  };
  db.users.push(user);
  save();
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password || "", user.passwordHash))
    return res.status(401).json({ error: "Wrong email or password." });
  res.json({ token: makeToken(user), user: publicUser(user) });
});

function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    req.user = db.users.find((u) => u.id === jwt.verify(token, SECRET).id);
    if (!req.user) throw new Error();
    next();
  } catch {
    res.status(401).json({ error: "Please log in again." });
  }
}

const only = (role) => (req, res, next) =>
  req.user.role === role ? next() : res.status(403).json({ error: `Only ${role}s can do this.` });

const skillName = (id) => db.skills.find((s) => s.id === id)?.name || id;

function jobView(job, seekerSkills) {
  const employer = db.users.find((u) => u.id === job.employerId);
  const view = {
    id: job.id, title: job.title, location: job.location,
    company: employer?.companyName,
    requiredSkills: job.requiredSkills.map((id) => ({ id, name: skillName(id) })),
  };
  return seekerSkills ? { ...view, ...matchJob(seekerSkills, job) } : view;
}

app.get("/api/skills", auth, (req, res) => res.json({ skills: db.skills }));

app.put("/api/profile/skills", auth, only("jobseeker"), (req, res) => {
  req.user.skills = (req.body.skills || []).filter((id) => db.skills.some((s) => s.id === id));
  save();
  res.json({ user: publicUser(req.user) });
});

app.get("/api/jobs", auth, only("jobseeker"), (req, res) => {
  const jobs = db.jobs.map((j) => jobView(j, req.user.skills));
  res.json({ jobs: jobs.sort((a, b) => b.percent - a.percent) });
});

app.get("/api/jobs/:id/match", auth, only("jobseeker"), (req, res) => {
  const job = db.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found." });
  const m = matchJob(req.user.skills, job);
  res.json({
    job: jobView(job),
    percent: m.percent,
    have: m.have.map((id) => ({ id, name: skillName(id) })),
    missing: m.missing.map((id) => ({ id, name: skillName(id) })),
    training: m.missing.map((id) => ({
      skill: skillName(id),
      resources: db.resources.filter((r) => r.skillId === id),
    })),
    applied: db.applications.some((a) => a.jobId === job.id && a.seekerId === req.user.id),
  });
});

app.post("/api/jobs", auth, only("employer"), (req, res) => {
  const { title, location, requiredSkills } = req.body;
  const skills = (requiredSkills || []).filter((id) => db.skills.some((s) => s.id === id));
  if (!title) return res.status(400).json({ error: "Add a job title." });
  if (skills.length === 0) return res.status(400).json({ error: "Pick at least one required skill." });
  const job = { id: "j" + Date.now(), title, location: location || "Kigali", employerId: req.user.id, requiredSkills: skills };
  db.jobs.push(job);
  save();
  res.status(201).json({ job: jobView(job) });
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));

app.get("/api/my/jobs", auth, only("employer"), (req, res) => {
  res.json({ jobs: db.jobs.filter((j) => j.employerId === req.user.id).map((j) => jobView(j)) });
});

app.get("/api/jobs/:id/candidates", auth, only("employer"), (req, res) => {
  const job = db.jobs.find((j) => j.id === req.params.id && j.employerId === req.user.id);
  if (!job) return res.status(404).json({ error: "Job not found." });
  const candidates = db.users
    .filter((u) => u.role === "jobseeker")
    .map((u) => {
      const m = matchJob(u.skills, job);
      return {
        id: u.id, name: u.name, percent: m.percent,
        have: m.have.map(skillName), missing: m.missing.map(skillName),
        applied: db.applications.some((a) => a.jobId === job.id && a.seekerId === u.id),
      };
    })
    .filter((c) => c.percent > 0)
    .sort((a, b) => b.percent - a.percent);
  res.json({ job: jobView(job), candidates });
});

app.post("/api/jobs/:id/apply", auth, only("jobseeker"), (req, res) => {
  const job = db.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found." });
  if (!db.applications.some((a) => a.jobId === job.id && a.seekerId === req.user.id)) {
    db.applications.push({ id: "a" + Date.now(), jobId: job.id, seekerId: req.user.id, status: "Applied" });
    save();
  }
  res.status(201).json({ ok: true });
});

app.get("/api/applications", auth, only("jobseeker"), (req, res) => {
  const applications = db.applications
    .filter((a) => a.seekerId === req.user.id)
    .map((a) => ({ id: a.id, status: a.status, jobTitle: db.jobs.find((j) => j.id === a.jobId)?.title }));
  res.json({ applications });
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));
