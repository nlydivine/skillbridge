import { useEffect, useState } from "react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const TEXT = {
  en: {
    tagline: "Find jobs that match your skills.",
    login: "Log in",
    signup: "Sign up",
    name: "Full name",
    email: "Email",
    password: "Password",
    seeker: "I am a job seeker",
    employer: "I am an employer",
    company: "Company name",
    newHere: "New here? Sign up",
    haveAccount: "Have an account? Log in",
    logout: "Log out",
    tabJobs: "Jobs",
    tabSkills: "My skills",
    tabApplied: "Applications",
    tabMyJobs: "My jobs",
    tabPost: "Post a job",
    jobsForYou: "Jobs for you",
    match: "match",
    back: "← Back",
    have: "Skills you have",
    need: "Skills you need",
    allSkills: "You have all the skills!",
    none: "None yet",
    apply: "Apply for this job",
    applied: "Applied ✓",
    mySkills: "My skills",
    saveSkills: "Save skills",
    saved: "Saved!",
    myApps: "My applications",
    noApps: "No applications yet.",
    loading: "Loading...",
    myJobs: "My jobs",
    noJobs: "No jobs posted yet.",
    edit: "Edit",
    candidatesFor: "Candidates for",
    noCands: "No matching candidates yet.",
    appliedBadge: "Applied",
    has: "Has",
    missing: "Missing",
    editJob: "Edit job",
    postJob: "Post a job",
    jobTitle: "Job title",
    location: "Location",
    reqSkills: "Required skills",
    saveChanges: "Save changes",
    postBtn: "Post job",
  },
  rw: {
    tagline: "Shaka akazi gahuye n'ubumenyi bwawe.",
    login: "Injira",
    signup: "Iyandikishe",
    name: "Amazina yose",
    email: "Imeyili",
    password: "Ijambobanga",
    seeker: "Ndi umushaka akazi",
    employer: "Ndi umukoresha",
    company: "Izina ry'ikigo",
    newHere: "Uri mushya? Iyandikishe",
    haveAccount: "Usanzwe ufite konti? Injira",
    logout: "Sohoka",
    tabJobs: "Akazi",
    tabSkills: "Ubumenyi bwanjye",
    tabApplied: "Ubusabe bwanjye",
    tabMyJobs: "Akazi nashyizeho",
    tabPost: "Shyiraho akazi",
    jobsForYou: "Akazi kakubereye",
    match: "guhura",
    back: "← Subira inyuma",
    have: "Ubumenyi usanganywe",
    need: "Ubumenyi ukeneye",
    allSkills: "Ufite ubumenyi bwose bukenewe!",
    none: "Nta na kimwe kugeza ubu",
    apply: "Saba aka kazi",
    applied: "Warasabye ✓",
    mySkills: "Ubumenyi bwanjye",
    saveSkills: "Bika ubumenyi",
    saved: "Byabitswe!",
    myApps: "Ubusabe bwanjye",
    noApps: "Nta busabe urakora.",
    loading: "Tegereza...",
    myJobs: "Akazi nashyizeho",
    noJobs: "Nta kazi urashyiraho.",
    edit: "Hindura",
    candidatesFor: "Abakandida b'akazi",
    noCands: "Nta bakandida bahuye urabona.",
    appliedBadge: "Yasabye",
    has: "Afite",
    missing: "Abura",
    editJob: "Hindura akazi",
    postJob: "Shyiraho akazi",
    jobTitle: "Umutwe w'akazi",
    location: "Aho akazi kari",
    reqSkills: "Ubumenyi bukenewe",
    saveChanges: "Bika impinduka",
    postBtn: "Shyiraho akazi",
  },
};

const SKILLS_RW = {
  "Data entry": "Kwinjiza amakuru",
  "Customer service": "Serivisi ku bakiliya",
  "Communication": "Itumanaho",
  "Teamwork": "Gukorera hamwe",
  "Sales": "Kugurisha",
  "English speaking": "Kuvuga Icyongereza",
  "Time management": "Gucunga igihe",
};

let current = "en";
const t = (k) => TEXT[current][k] || TEXT.en[k] || k;
const skill = (name) => (current === "rw" && SKILLS_RW[name]) || name;

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

function LangSwitch({ value, onChange }) {
  return (
    <span className="lang">
      <button className={value === "en" ? "on" : ""} onClick={() => onChange("en")}>EN</button>
      <button className={value === "rw" ? "on" : ""} onClick={() => onChange("rw")}>RW</button>
    </span>
  );
}

function Auth({ onDone, lang, setLang }) {
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
      <LangSwitch value={lang} onChange={setLang} />
      <h1>SkillBridge</h1>
      <p>{t("tagline")}</p>
      <form onSubmit={submit}>
        {mode === "register" && (
          <>
            <input placeholder={t("name")} value={form.name} onChange={set("name")} />
            <select value={form.role} onChange={set("role")}>
              <option value="jobseeker">{t("seeker")}</option>
              <option value="employer">{t("employer")}</option>
            </select>
            {form.role === "employer" && (
              <input placeholder={t("company")} value={form.companyName} onChange={set("companyName")} />
            )}
          </>
        )}
        <input placeholder={t("email")} value={form.email} onChange={set("email")} />
        <input type="password" placeholder={t("password")} value={form.password} onChange={set("password")} />
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === "login" ? t("login") : t("signup")}</button>
      </form>
      <a className="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? t("newHere") : t("haveAccount")}
      </a>
    </div>
  );
}

function Jobs({ token, onOpen }) {
  const { data, error } = useGet("/jobs", token);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>{t("loading")}</p>;
  return (
    <>
      <h2>{t("jobsForYou")}</h2>
      {data.jobs.map((j) => (
        <div className="card click" key={j.id} onClick={() => onOpen(j.id)}>
          <b>{j.title}</b>
          <span> {j.company} · {j.location}</span>
          <Bar percent={j.percent} />
          <small>{j.percent}% {t("match")}</small>
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
  if (!data) return <p>{t("loading")}</p>;
  return (
    <>
      <button className="small" onClick={onBack}>{t("back")}</button>
      <h2>{data.job.title}</h2>
      <p>{data.job.company} · {data.job.location}</p>
      <Bar percent={data.percent} />
      <p>{data.percent}% {t("match")}</p>
      <h3>{t("have")}</h3>
      <p>{data.have.length ? data.have.map((s) => skill(s.name)).join(", ") : t("none")}</p>
      <h3>{t("need")}</h3>
      {data.missing.length === 0 && <p>{t("allSkills")}</p>}
      {data.training.map((r) => (
        <div className="card" key={r.skill}>
          <b>{skill(r.skill)}</b>
          {r.resources.map((x) => (
            <div key={x.id}>
              <a href={x.link} target="_blank" rel="noreferrer">{x.title} ({x.provider})</a>
            </div>
          ))}
        </div>
      ))}
      <button onClick={apply} disabled={data.applied}>
        {data.applied ? t("applied") : t("apply")}
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
          {skill(s.name)}
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
      setMsg(t("saved"));
    } catch (e) {
      setMsg(e.message);
    }
  }

  if (!data) return <p>{t("loading")}</p>;
  return (
    <>
      <h2>{t("mySkills")}</h2>
      <SkillPicker all={data.skills} picked={picked} setPicked={setPicked} />
      <button onClick={save}>{t("saveSkills")}</button>
      <p>{msg}</p>
    </>
  );
}

function Applications({ token }) {
  const { data, error } = useGet("/applications", token);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>{t("loading")}</p>;
  return (
    <>
      <h2>{t("myApps")}</h2>
      {data.applications.length === 0 && <p>{t("noApps")}</p>}
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
  if (!data) return <p>{t("loading")}</p>;
  return (
    <>
      <h2>{t("myJobs")}</h2>
      {data.jobs.length === 0 && <p>{t("noJobs")}</p>}
      {data.jobs.map((j) => (
        <div className="card click" key={j.id} onClick={() => onOpen(j.id)}>
          <b>{j.title}</b> <span>{j.location}</span>
          <br />
          <small>{j.requiredSkills.map((s) => skill(s.name)).join(", ")}</small>
          <br />
          <button className="small" onClick={(e) => { e.stopPropagation(); onEdit(j); }}>{t("edit")}</button>
        </div>
      ))}
    </>
  );
}

function Candidates({ id, token, onBack }) {
  const { data, error } = useGet(`/jobs/${id}/candidates`, token);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>{t("loading")}</p>;
  return (
    <>
      <button className="small" onClick={onBack}>{t("back")}</button>
      <h2>{t("candidatesFor")}: {data.job.title}</h2>
      {data.candidates.length === 0 && <p>{t("noCands")}</p>}
      {data.candidates.map((c) => (
        <div className="card" key={c.id}>
          <b>{c.name}</b> {c.applied && <span className="badge">{t("appliedBadge")}</span>}
          <Bar percent={c.percent} />
          <small>{c.percent}% {t("match")}</small>
          <p>{t("has")}: {c.have.map(skill).join(", ") || "-"}</p>
          <p>{t("missing")}: {c.missing.map(skill).join(", ") || "-"}</p>
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

  if (!data) return <p>{t("loading")}</p>;
  return (
    <form onSubmit={submit}>
      <h2>{job ? t("editJob") : t("postJob")}</h2>
      <input placeholder={t("jobTitle")} value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder={t("location")} value={location} onChange={(e) => setLocation(e.target.value)} />
      <h3>{t("reqSkills")}</h3>
      <SkillPicker all={data.skills} picked={picked} setPicked={setPicked} />
      {error && <p className="error">{error}</p>}
      <button type="submit">{job ? t("saveChanges") : t("postBtn")}</button>
    </form>
  );
}

export default function App() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("session") || "null"));
  const [lang, setLangState] = useState(() => localStorage.getItem("lang") || "en");
  const [tab, setTab] = useState("jobs");
  const [jobId, setJobId] = useState(null);
  const [editJob, setEditJob] = useState(null);

  current = lang;

  function setLang(l) {
    localStorage.setItem("lang", l);
    setLangState(l);
  }

  function save(s) {
    setSession(s);
    if (s) localStorage.setItem("session", JSON.stringify(s));
    else localStorage.removeItem("session");
  }

  if (!session)
    return (
      <Auth
        lang={lang}
        setLang={setLang}
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
    ? [["jobs", t("tabJobs")], ["skills", t("tabSkills")], ["applied", t("tabApplied")]]
    : [["myjobs", t("tabMyJobs")], ["post", t("tabPost")]];
  const go = (x) => { setTab(x); setJobId(null); setEditJob(null); };
  const token = session.token;

  return (
    <div className="app">
      <header>
        <b>SkillBridge</b>
        <LangSwitch value={lang} onChange={setLang} />
        <span>{session.user.name}</span>
        <button className="small" onClick={() => save(null)}>{t("logout")}</button>
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

