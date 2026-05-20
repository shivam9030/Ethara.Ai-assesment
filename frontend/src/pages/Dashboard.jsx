import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// ─── Shared Layout ────────────────────────────────────────────
const SIDEBAR_LINKS = [
  { icon: 'dashboard', label: 'Dashboard', active: false },
  { icon: 'assignment_turned_in', label: 'Task Board', active: true },
  { icon: 'calendar_today', label: 'Calendar', active: false },
  { icon: 'group', label: 'Team', active: false },
];

const Sidebar = ({ onLogout }) => (
  <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col py-6 z-50 border-r"
    style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
    {/* Logo */}
    <div className="px-6 mb-8 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0058be' }}>
        <span className="material-symbols-outlined text-white icon-filled">account_tree</span>
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: '#0f172a' }}>TaskFlow</h1>
        <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#64748b' }}>Enterprise SaaS</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 space-y-1">
      {SIDEBAR_LINKS.map(link => (
        <a key={link.label} href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150"
          style={link.active
            ? { color: '#2563eb', fontWeight: 600, backgroundColor: 'rgba(37,99,235,0.05)', borderRight: '2px solid #2563eb' }
            : { color: '#64748b' }}
          onMouseEnter={e => { if (!link.active) { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; } }}
          onMouseLeave={e => { if (!link.active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
        >
          <span className="material-symbols-outlined">{link.icon}</span>
          <span className="text-sm">{link.label}</span>
        </a>
      ))}
    </nav>

    {/* Create Task Button */}
    <div className="px-4 pb-2">
      <button className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: '#0058be', color: '#ffffff', boxShadow: '0 4px 12px rgba(0,88,190,0.25)' }}>
        <span className="material-symbols-outlined text-[20px]">add</span>
        Create Task
      </button>
    </div>

    {/* Bottom links */}
    <div className="mt-auto px-3 space-y-1 pt-2">
      {[{ icon: 'settings', label: 'Settings' }, { icon: 'contact_support', label: 'Support' }].map(link => (
        <a key={link.label} href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-150"
          style={{ color: '#64748b' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
          <span className="material-symbols-outlined">{link.icon}</span>
          <span>{link.label}</span>
        </a>
      ))}
      <button onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-150"
        style={{ color: '#64748b' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff1f2'; e.currentTarget.style.color = '#ba1a1a'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
        <span className="material-symbols-outlined">logout</span>
        <span>Sign Out</span>
      </button>
    </div>
  </aside>
);

const TopBar = ({ user }) => (
  <header className="fixed top-0 z-40 h-16 flex items-center justify-between px-8 border-b"
    style={{
      left: '16rem', right: 0,
      backgroundColor: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderColor: '#e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
    <div className="flex items-center flex-1 max-w-xl">
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px]" style={{ color: '#94a3b8' }}>search</span>
        <input
          type="text"
          placeholder="Search tasks, teams, or projects..."
          className="w-full border-none rounded-full py-2 pl-10 pr-4 text-sm outline-none transition-all"
          style={{ backgroundColor: '#f1f5f9' }}
          onFocus={e => e.target.style.boxShadow = '0 0 0 2px rgba(0,88,190,0.20)'}
          onBlur={e => e.target.style.boxShadow = 'none'}
        />
      </div>
    </div>
    <div className="flex items-center gap-2">
      {['notifications', 'chat_bubble', 'help_outline'].map(icon => (
        <button key={icon} className="p-2 rounded-full transition-colors"
          style={{ color: '#475569' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
          <span className="material-symbols-outlined">{icon}</span>
        </button>
      ))}
      <div className="h-6 w-px mx-2" style={{ backgroundColor: '#e2e8f0' }} />
      <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
        style={{ backgroundColor: '#d8e2ff', color: '#001a42' }}>
        Invite Team
      </button>
      <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2 text-sm font-bold uppercase border-2"
        style={{ backgroundColor: '#0058be', color: '#ffffff', borderColor: '#e2e8f0' }}>
        {user?.email?.charAt(0) || 'U'}
      </div>
    </div>
  </header>
);

// ─── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ icon, iconBg, iconColor, label, value, badge }) => (
  <div className="bg-white p-6 rounded-xl border flex flex-col justify-between h-48" style={{ borderColor: '#f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
    <div className="flex justify-between items-start">
      <span className="p-2 rounded-lg material-symbols-outlined" style={{ backgroundColor: iconBg, color: iconColor }}>{icon}</span>
      {badge && <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: iconBg, color: iconColor }}>{badge}</span>}
    </div>
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#424754' }}>{label}</h3>
      <p className="font-bold" style={{ fontSize: '36px', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#191b23' }}>{value}</p>
    </div>
  </div>
);

// ─── Task Card (Kanban style) ───────────────────────────────────
const TaskCard = ({ task, onToggle, onDelete }) => {
  const isCompleted = task.status === 'Completed';
  return (
    <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 transition-shadow hover:shadow-lg"
      style={{
        borderColor: isCompleted ? '#e2e8f0' : '#f1f5f9',
        backgroundColor: isCompleted ? 'rgba(248,250,252,0.5)' : '#ffffff',
        opacity: isCompleted ? 0.85 : 1,
        boxShadow: isCompleted ? 'none' : '0px 4px 6px -1px rgba(0,0,0,0.10)',
        borderLeft: !isCompleted && task.status === 'pending' ? 'none' : undefined,
      }}>
      <div className="flex justify-between items-start">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          style={isCompleted
            ? { backgroundColor: '#d1fae5', color: '#065f46' }
            : { backgroundColor: '#fff7ed', color: '#924700' }}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
        <div className="flex gap-1">
          <button onClick={() => onToggle(task.id, task.status)}
            className="p-1.5 rounded-lg transition-colors text-sm font-semibold flex items-center gap-1"
            style={{ color: '#0058be' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            title={isCompleted ? 'Reopen' : 'Mark Done'}>
            <span className="material-symbols-outlined text-[18px]">{isCompleted ? 'undo' : 'check_circle'}</span>
          </button>
          <button onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#94a3b8' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffdad6'; e.currentTarget.style.color = '#ba1a1a'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            title="Delete">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-1 text-[17px]" style={{ color: isCompleted ? '#94a3b8' : '#0f172a', textDecoration: isCompleted ? 'line-through' : 'none' }}>
          {task.title}
        </h4>
      </div>
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: isCompleted ? '#e2e8f0' : '#f8fafc' }}>
        {isCompleted ? (
          <div className="flex items-center gap-2" style={{ color: '#059669' }}>
            <span className="material-symbols-outlined text-[18px] icon-filled">check_circle</span>
            <span className="text-xs font-bold">Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span className="text-xs font-medium">Pending review</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Dashboard Page ─────────────────────────────────────────────
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await api.post('/tasks', { title });
      setTasks(prev => [...prev, res.data]);
      setTitle('');
    } catch (err) { console.error(err); }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      const res = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { logout(); navigate('/auth'); };

  const pending = tasks.filter(t => t.status !== 'Completed');
  const completed = tasks.filter(t => t.status === 'Completed');
  const progress = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9ff' }}>
      <Sidebar onLogout={handleLogout} />
      <TopBar user={user} />

      <main style={{ marginLeft: '16rem', paddingTop: '64px' }}>
        <div className="p-8 max-w-7xl mx-auto">

          {/* ── Page Header ── */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-bold mb-1" style={{ fontSize: '24px', letterSpacing: '-0.01em', color: '#0f172a' }}>
                Good morning, {user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm" style={{ color: '#64748b' }}>
                {pending.length > 0
                  ? `You have ${pending.length} pending task${pending.length !== 1 ? 's' : ''} to take care of.`
                  : 'All tasks completed — great work! 🎉'}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#e6e7f2' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b75b00', color: '#fffbff' }}>
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#424754' }}>Productivity</p>
                <p className="text-lg font-semibold" style={{ color: '#191b23' }}>{progress}% done</p>
              </div>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon="assignment" iconBg="#eff6ff" iconColor="#2563eb" label="Total Tasks" value={tasks.length} badge={`+${tasks.length}`} />
            <StatCard icon="pending_actions" iconBg="#fffbeb" iconColor="#d97706" label="Pending" value={pending.length} />
            <StatCard icon="task_alt" iconBg="#f0fdf4" iconColor="#16a34a" label="Completed" value={completed.length} />
          </div>

          {/* ── Bento Grid ── */}
          <div className="grid grid-cols-12 gap-6">

            {/* Left: Quick Create + Task Board */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

              {/* Quick Create */}
              <form onSubmit={handleCreate} className="relative p-6 rounded-xl overflow-hidden"
                style={{ backgroundColor: '#0058be', boxShadow: '0 8px 24px rgba(0,88,190,0.20)' }}>
                <div className="absolute right-0 top-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.10)' }} />
                <div className="relative z-10">
                  <h3 className="font-semibold text-lg mb-4 text-white">Quick Create</h3>
                  <div className="flex gap-2">
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="I want to..."
                      className="flex-1 rounded-lg py-3 px-4 text-sm border-none outline-none"
                      style={{ backgroundColor: 'rgba(255,255,255,0.20)', color: '#ffffff' }}
                    />
                    <button type="submit"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-colors"
                      style={{ backgroundColor: '#ffffff', color: '#0058be' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f2f3fd'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}>
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add Task
                    </button>
                  </div>
                </div>
              </form>

              {/* Task Board Header */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <div>
                    <h2 className="font-semibold text-2xl" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>Task Board</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>Manage and track your operational progress.</p>
                  </div>
                  <div className="flex p-1 rounded-lg" style={{ backgroundColor: '#f1f5f9' }}>
                    <button className="px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5"
                      style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.07)' }}>
                      <span className="material-symbols-outlined text-[18px]">view_kanban</span> Board
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium flex items-center gap-1.5" style={{ color: '#475569' }}>
                      <span className="material-symbols-outlined text-[18px]">list</span> List
                    </button>
                  </div>
                </div>

                {/* Kanban Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                  {/* Pending Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg" style={{ color: '#191b23' }}>Pending</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#fef3c7', color: '#723600' }}>
                          {pending.length}
                        </span>
                      </div>
                    </div>
                    {loading ? (
                      <div className="text-sm text-center py-8" style={{ color: '#94a3b8' }}>Loading...</div>
                    ) : pending.length === 0 ? (
                      <div className="py-8 border-2 border-dashed rounded-xl text-sm text-center" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>
                        No pending tasks
                      </div>
                    ) : (
                      pending.map(task => (
                        <TaskCard key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
                      ))
                    )}
                    <button onClick={() => document.querySelector('input[placeholder="I want to..."]')?.focus()}
                      className="w-full py-4 border-2 border-dashed rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                      style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0058be'; e.currentTarget.style.color = '#0058be'; e.currentTarget.style.backgroundColor = 'rgba(0,88,190,0.05)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                      <span className="material-symbols-outlined">add</span> Add New Task
                    </button>
                  </div>

                  {/* Completed Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg" style={{ color: '#191b23' }}>Completed</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#d1fae5', color: '#311400' }}>
                          {completed.length}
                        </span>
                      </div>
                    </div>
                    {completed.length === 0 ? (
                      <div className="py-8 border-2 border-dashed rounded-xl text-sm text-center" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>
                        No completed tasks yet
                      </div>
                    ) : (
                      completed.map(task => (
                        <TaskCard key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Side Cards */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

              {/* Weekly Goal */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e2e8f0' }}>
                <h3 className="font-semibold text-lg mb-4" style={{ color: '#191b23' }}>Weekly Goal</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: '#424754' }}>Tasks Completed</p>
                  <p className="text-xs font-bold" style={{ color: '#0058be' }}>{progress}%</p>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#e2e8f0' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: '#0058be' }} />
                </div>
                <p className="mt-3 text-xs italic" style={{ color: '#424754' }}>
                  {progress === 100 ? '🎉 Amazing! All tasks done!' : progress > 50 ? "You're ahead of pace. Keep it up!" : 'Keep the momentum going!'}
                </p>
              </div>

              {/* Team Activity */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e2e8f0' }}>
                <h3 className="font-semibold text-lg mb-4" style={{ color: '#191b23' }}>Team Activity</h3>
                <div className="space-y-4">
                  {[
                    { color: '#0058be', text: 'Shivam completed', link: 'Brand Guidelines', time: '2 minutes ago' },
                    { color: '#f59e0b', text: 'Anurag commented on', link: 'API Docs', time: '1 hour ago' },
                    { color: '#10b981', text: 'Satyam project', link: 'Mobile App', time: '5 hours ago' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#191b23' }}>
                          {item.text} <span style={{ color: '#0058be' }}>{item.link}</span>
                        </p>
                        <p className="text-xs" style={{ color: '#94a3b8' }}>{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 rounded-lg text-sm font-semibold border transition-colors"
                  style={{ borderColor: '#e2e8f0', color: '#475569' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Show Full Log
                </button>
              </div>

              {/* Banner */}
              <div className="relative h-48 rounded-xl overflow-hidden group" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
                <img alt="Workspace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcK5dyu26GEWh1TjWxbPI5OKQJwnjsiVgjEJb9tNXFXvONkgYww5MTFo5RBOcRJzUIJ6uVT2Vj-BRAub9Tg7cNeHVQb-mY2LLxbbPclgnOcRTiPAMwZmiaiLAiUFvCQnzBlxDGzQ_y02bdeevXVXp9m7ddU3EwR1jr09pnwc6JKWyGic3V73XCo3I3HV53kSi6r5UvR2ULk8xJioe4fKxH4Cifb9RACehRVqkgJcFSwbw7mRKQBcOWFPC6-RbSJYTTvZ9I9Ph_FnU" />
                <div className="absolute inset-0 flex flex-col justify-end p-6"
                  style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent)' }}>
                  <h4 className="text-white font-bold">Stay Focused</h4>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Clear your workspace, clear your mind</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button onClick={() => document.querySelector('input[placeholder="I want to..."]')?.focus()}
        className="fixed bottom-10 right-10 w-14 h-14 rounded-full flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#0058be', color: '#ffffff', boxShadow: '0 8px 24px rgba(0,88,190,0.4)' }}>
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>
    </div>
  );
};

export default Dashboard;
