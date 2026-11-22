import { useEffect, useState } from "react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

function useGet(path, token, reload = 0) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setData(null);
    setError("");
    api(path, { token }).then(setData).catch((e) => setError(e.message));
  }, [path, token, reload]);
  return { data, error };
}

const Bar = ({ percent }) => (
  <div className="bar"><div style={{ width: percent + "%" }} /></div>
);

function Auth({ onDone }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "jobseeker", companyName: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      onDone(await api(mode === "login" ? "/auth/login" : "/auth/register", { method: "POST", body: form }));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth">
      <h1>SkillBridge</h1>
      <p>Find jobs that match your skills.</p>
      <form onSubmit={submit}>
        {mode === "register" && (
          <>
            <input placeholder="Full name" value={form.name} onChange={set("name")} />
            <select value={form.role} onChange={set("role")}>
              <option value="jobseeker">I am a job seeker</option>
              <option value="employer">I am an employer</option>
            </select>
            {form.role === "employer" && (
              <input placeholder="Company name" value={form.companyName} onChange={set("companyName")} />
            )}
          </>
        )}
        <input placeholder="Email" value={form.email} onChange={set("email")} />
        <input type="password" placeholder="Password" value={form.password} onChange={set("password")} />
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
      </form>
      <a className="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "New here? Sign up" : "Have an account? Log in"}
      </a>
    </div>
  );
}

function Jobs({ token, onOpen }) {
  const { data, error } = useGet("/jobs", token);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;
  return (
    <>
      <h2>Jobs for you</h2>
      {data.jobs.map((j) => (
        <div className="card click" key={j.id} onClick={() => onOpen(j.id)}>
          <b>{j.title}</b>
          <span> {j.company} · {j.location}</span>
          <Bar percent={j.percent} />
          <small>{j.percent}% match</small>
        </div>
      ))}
    </>
  );
}

function JobDetail({ id, token, onBack }) {
  const [n, setN] = useState(0);
  const { data, error } = useGet(`/jobs/${id}/match`, token, n);

  async function apply() {
    await api(`/jobs/${id}/apply`, { method: "POST", token });
    setN(n + 1);
  }

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;
  return (
    <>
      <button className="small" onClick={onBack}>← Back</button>
      <h2>{data.job.title}</h2>
      <p>{data.job.company} · {data.job.location}</p>
      <Bar percent={data.percent} />
      <p>{data.percent}% match</p>
      <h3>Skills you have</h3>
      <p>{data.have.length ? data.have.map((s) => s.name).join(", ") : "None yet"}</p>
      <h3>Skills you need</h3>
      {data.missing.length === 0 && <p>You have all the skills!</p>}
      {data.training.map((t) => (
        <div className="card" key={t.skill}>
          <b>{t.skill}</b>
          {t.resources.map((r) => (
            <div key={r.id}>
              <a href={r.link} target="_blank" rel="noreferrer">{r.title} ({r.provider})</a>
            </div>
          ))}
        </div>
      ))}
      <button onClick={apply} disabled={data.applied}>
        {data.applied ? "Applied ✓" : "Apply for this job"}
      </button>
    </>
  );
}

function SkillPicker({ all, picked, setPicked }) {
  const toggle = (id) =>
    setPicked(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);
  return (
    <div className="checks">
      {all.map((s) => (
        <label key={s.id}>
          <input type="checkbox" checked={picked.includes(s.id)} onChange={() => toggle(s.id)} />
          {s.name}
        </label>
      ))}
    </div>
  );
}

function MySkills({ session, onUser }) {
  const { data } = useGet("/skills", session.token);
  const [picked, setPicked] = useState(session.user.skills || []);
  const [msg, setMsg] = useState("");

  async function save() {
    try {
      const r = await api("/profile/skills", { method: "PUT", token: session.token, body: { skills: picked } });
      onUser(r.user);
      setMsg("Saved!");
    } catch (e) {
      setMsg(e.message);
    }
  }

  if (!data) return <p>Loading...</p>;
  return (
    <>
      <h2>My skills</h2>
      <SkillPicker all={data.skills} picked={picked} setPicked={setPicked} />
      <button onClick={save}>Save skills</button>
      <p>{msg}</p>
    </>
  );
}

function Applications({ token }) {
  const { data, error } = useGet("/applications", token);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;
  return (
    <>
      <h2>My applications</h2>
      {data.applications.length === 0 && <p>No applications yet.</p>}
      {data.applications.map((a) => (
        <div className="card" key={a.id}>
          <b>{a.jobTitle}</b> <span>{a.status}</span>
        </div>
      ))}
    </>
  );
}

function MyJobs({ token, onOpen, onEdit }) {
  const { data, error } = useGet("/my/jobs", token);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;
  return (
    <>
      <h2>My jobs</h2>
      {data.jobs.length === 0 && <p>No jobs posted yet.</p>}
      {data.jobs.map((j) => (
        <div className="card click" key={j.id} onClick={() => onOpen(j.id)}>
          <b>{j.title}</b> <span>{j.location}</span>
          <br />
          <small>{j.requiredSkills.map((s) => s.name).join(", ")}</small>
          <br />
          <button className="small" onClick={(e) => { e.stopPropagation(); onEdit(j); }}>Edit</button>
        </div>
      ))}
    </>
  );
}

function Candidates({ id, token, onBack }) {
  const { data, error } = useGet(`/jobs/${id}/candidates`, token);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;
  return (
    <>
      <button className="small" onClick={onBack}>← Back</button>
      <h2>Candidates for {data.job.title}</h2>
      {data.candidates.length === 0 && <p>No matching candidates yet.</p>}
      {data.candidates.map((c) => (
        <div className="card" key={c.id}>
          <b>{c.name}</b> {c.applied && <span className="badge">Applied</span>}
          <Bar percent={c.percent} />
          <small>{c.percent}% match</small>
          <p>Has: {c.have.join(", ") || "-"}</p>
          <p>Missing: {c.missing.join(", ") || "-"}</p>
        </div>
      ))}
    </>
  );
}

function JobForm({ token, job, onDone }) {
  const { data } = useGet("/skills", token);
  const [title, setTitle] = useState(job ? job.title : "");
  const [location, setLocation] = useState(job ? job.location : "Kigali");
  const [picked, setPicked] = useState(job ? job.requiredSkills.map((s) => s.id) : []);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api(job ? `/jobs/${job.id}` : "/jobs", {
        method: job ? "PUT" : "POST",
        token,
        body: { title, location, requiredSkills: picked },
      });
      onDone();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!data) return <p>Loading...</p>;
  return (
    <form onSubmit={submit}>
      <h2>{job ? "Edit job" : "Post a job"}</h2>
      <input placeholder="Job title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <h3>Required skills</h3>
      <SkillPicker all={data.skills} picked={picked} setPicked={setPicked} />
      {error && <p className="error">{error}</p>}
      <button type="submit">{job ? "Save changes" : "Post job"}</button>
    </form>
  );
}

export default function App() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("session") || "null"));
  const [tab, setTab] = useState("jobs");
  const [jobId, setJobId] = useState(null);
  const [editJob, setEditJob] = useState(null);

  function save(s) {
    setSession(s);
    if (s) localStorage.setItem("session", JSON.stringify(s));
    else localStorage.removeItem("session");
  }

  if (!session)
    return (
      <Auth
        onDone={(d) => {
          save(d);
          setJobId(null);
          setEditJob(null);
          setTab(d.user.role === "employer" ? "myjobs" : "jobs");
        }}
      />
    );

  const seeker = session.user.role === "jobseeker";
  const tabs = seeker
    ? [["jobs", "Jobs"], ["skills", "My skills"], ["applied", "Applications"]]
    : [["myjobs", "My jobs"], ["post", "Post a job"]];
  const go = (t) => { setTab(t); setJobId(null); setEditJob(null); };
  const token = session.token;

  return (
    <div className="app">
      <header>
        <b>SkillBridge</b>
        <span>{session.user.name}</span>
        <button className="small" onClick={() => save(null)}>Log out</button>
      </header>
      <nav>
        {tabs.map(([k, label]) => (
          <button key={k} className={tab === k ? "active" : ""} onClick={() => go(k)}>{label}</button>
        ))}
      </nav>
      <main>
        {tab === "jobs" && (jobId
          ? <JobDetail id={jobId} token={token} onBack={() => setJobId(null)} />
          : <Jobs token={token} onOpen={setJobId} />)}
        {tab === "skills" && <MySkills session={session} onUser={(u) => save({ ...session, user: u })} />}
        {tab === "applied" && <Applications token={token} />}
        {tab === "myjobs" && (editJob
          ? <JobForm token={token} job={editJob} onDone={() => go("myjobs")} />
          : jobId
            ? <Candidates id={jobId} token={token} onBack={() => setJobId(null)} />
            : <MyJobs token={token} onOpen={setJobId} onEdit={setEditJob} />)}
        {tab === "post" && <JobForm token={token} job={null} onDone={() => go("myjobs")} />}
      </main>
    </div>
  );
}
