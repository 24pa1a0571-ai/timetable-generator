import React, { useMemo, useState } from 'react';
import { CalendarDays, Plus, WandSparkles, Trash2, BookOpen, Clock3, GraduationCap } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00 - 10:00', '10:00 - 11:00', '11:15 - 12:15', '12:15 - 01:15', '02:00 - 03:00', '03:00 - 04:00'];
const starter = [
  { id: 1, subject: 'Mathematics', teacher: 'Mr. Kumar', room: 'A-101', day: 'Monday', time: TIMES[0], color: 'violet' },
  { id: 2, subject: 'Computer Networks', teacher: 'Ms. Priya', room: 'Lab 2', day: 'Monday', time: TIMES[1], color: 'blue' },
  { id: 3, subject: 'Database Systems', teacher: 'Mr. Arun', room: 'A-203', day: 'Tuesday', time: TIMES[0], color: 'green' },
  { id: 4, subject: 'Operating Systems', teacher: 'Ms. Divya', room: 'A-105', day: 'Wednesday', time: TIMES[2], color: 'orange' },
  { id: 5, subject: 'Web Technologies', teacher: 'Mr. Ravi', room: 'Lab 1', day: 'Thursday', time: TIMES[1], color: 'pink' },
  { id: 6, subject: 'Software Engineering', teacher: 'Ms. Anu', room: 'A-202', day: 'Friday', time: TIMES[3], color: 'cyan' },
];
const colors = ['violet', 'blue', 'green', 'orange', 'pink', 'cyan'];

export default function App() {
  const [classes, setClasses] = useState(starter);
  const [form, setForm] = useState({ subject: '', teacher: '', room: '', day: 'Monday', time: TIMES[0] });
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('All days');
  const [showForm, setShowForm] = useState(false);
  const visibleDays = filter === 'All days' ? DAYS : [filter];
  const subjectCount = useMemo(() => new Set(classes.map(c => c.subject.toLowerCase())).size, [classes]);

  function addClass(e) {
    e.preventDefault();
    if (!form.subject.trim() || !form.teacher.trim()) return setNotice('Enter a subject and teacher name.');
    if (classes.some(c => c.day === form.day && c.time === form.time)) return setNotice('That time slot is already occupied. Choose another slot.');
    setClasses([...classes, { ...form, id: Date.now(), color: colors[classes.length % colors.length] }]);
    setForm({ subject: '', teacher: '', room: '', day: 'Monday', time: TIMES[0] });
    setNotice('Class added successfully.'); setShowForm(false);
  }
  function generate() {
    const subjects = [...new Set(classes.map(c => c.subject))];
    if (!subjects.length) return setNotice('Add subjects before generating a timetable.');
    const next = []; let index = 0;
    for (const day of DAYS) {
      for (const time of TIMES) {
        if (index >= subjects.length * 2) break;
        const subject = subjects[index % subjects.length];
        const original = classes.find(c => c.subject === subject);
        next.push({ id: `${day}-${time}-${index}`, subject, teacher: original?.teacher || 'Faculty', room: original?.room || 'TBA', day, time, color: original?.color || colors[index % colors.length] });
        index++;
      }
    }
    setClasses(next); setNotice('A new weekly timetable has been generated.'); setFilter('All days');
  }
  function removeClass(id) { setClasses(classes.filter(c => c.id !== id)); setNotice('Class removed.'); }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><CalendarDays size={22}/></div><div><b>TimeTable</b><span>PLANNER</span></div></div>
      <div className="side-label">WORKSPACE</div>
      <div className="nav-item active"><CalendarDays size={18}/> Timetable</div>
      <div className="side-note"><div className="note-icon"><GraduationCap size={20}/></div><b>Plan your week</b><p>Organize classes and keep your academic schedule clear.</p></div>
      <div className="sidebar-bottom">STUDENT WORKSPACE <span>v1.0</span></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><div className="eyebrow">ACADEMIC PLANNER / OVERVIEW</div><h1>My Timetable</h1><p className="subhead">Generate, organize and view your weekly class schedule.</p></div><div className="avatar">S</div></header>
      <section className="stats">
        <div className="stat-card"><div className="stat-icon purple"><BookOpen size={19}/></div><div><span>Total Classes</span><strong>{classes.length}</strong></div></div>
        <div className="stat-card"><div className="stat-icon blue"><GraduationCap size={19}/></div><div><span>Unique Subjects</span><strong>{subjectCount}</strong></div></div>
        <div className="stat-card"><div className="stat-icon green"><Clock3 size={19}/></div><div><span>Working Days</span><strong>5</strong></div></div>
      </section>
      <section className="toolbar"><div><h2>Weekly Schedule</h2><p>Your classes at a glance</p></div><div className="actions"><button className="btn secondary" onClick={generate}><WandSparkles size={16}/> Generate</button><button className="btn primary" onClick={() => {setShowForm(!showForm);setNotice('')}}><Plus size={17}/> Add class</button></div></section>
      {notice && <div className="notice">{notice}</div>}
      {showForm && <form className="class-form" onSubmit={addClass}><div className="form-heading"><b>Add a class</b><button type="button" className="close" onClick={() => setShowForm(false)}>×</button></div><div className="form-grid">
        <label>Subject<input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Mathematics" required/></label>
        <label>Teacher<input value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})} placeholder="Teacher name" required/></label>
        <label>Room<input value={form.room} onChange={e=>setForm({...form,room:e.target.value})} placeholder="e.g. A-101"/></label>
        <label>Day<select value={form.day} onChange={e=>setForm({...form,day:e.target.value})}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></label>
        <label className="wide">Time slot<select value={form.time} onChange={e=>setForm({...form,time:e.target.value})}>{TIMES.map(t=><option key={t}>{t}</option>)}</select></label>
      </div><button className="btn primary" type="submit">Save class</button></form>}
      <div className="filter-row"><span>SHOW</span><div className="day-filters">{['All days',...DAYS].map(d=><button key={d} className={filter===d?'selected':''} onClick={()=>setFilter(d)}>{d}</button>)}</div></div>
      <section className="schedule-wrap"><div className="schedule-head"><div>TIME</div>{visibleDays.map(d=><div key={d}>{d.toUpperCase()}</div>)}</div>
        {TIMES.map(time=><div className="schedule-row" key={time}><div className="time-cell">{time}</div>{visibleDays.map(day=>{const item=classes.find(c=>c.day===day&&c.time===time);return <div className="slot" key={day}>{item?<article className={`class-card ${item.color}`}><button className="delete" title="Remove class" onClick={()=>removeClass(item.id)}><Trash2 size={13}/></button><b>{item.subject}</b><span>{item.teacher}</span><small>{item.room || 'Room not set'}</small></article>:<div className="empty-slot">—</div>}</div>})}</div>)}
      </section>
      <footer>Made for a more organized week <span>•</span> Timetable Generator & Viewer</footer>
    </main>
  </div>;
}
