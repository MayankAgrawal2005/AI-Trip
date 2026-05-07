"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [invites, setInvites] = useState([]);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error("Failed to parse user data", e);
    }
    fetchTrips();
    fetchInvites();
  }, []);

  const fetchTrips = async () => {
    if (!token) return;
    const res = await fetch("/api/trips", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTrips(data.data || []);
  };

  const fetchInvites = async () => {
    if (!token) return;
    const res = await fetch("/api/invites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setInvites(data.data || []);
  };

  const createTrip = async () => {
    if (!title.trim()) return;
    await fetch("/api/trips", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTrips();
  };

  const updateTrip = async (id) => {
    await fetch(`/api/trips/${id}`, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    setEditingId(null);
    fetchTrips();
  };

  const deleteTrip = async (id) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    await fetch(`/api/trips/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTrips();
  };

  const acceptInvite = async (inviteId) => {
    await fetch(`/api/invites/${inviteId}/accept`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchInvites();
    fetchTrips();
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans relative">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-72 bg-surface border-r border-border/50 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span className="text-xl font-black tracking-tight">TripSync</span>
          </Link>
          <button className="md:hidden text-on-surface-variant p-1" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", active: true },
            { label: "Archived", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
            { label: "Organization", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
            { label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${item.active ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              <span className="font-bold text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-border/50">
          <div className="bg-background rounded-2xl p-4 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-border flex items-center justify-center font-black text-xs shrink-0">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{user?.name || "Admin User"}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
            className="w-full flex items-center gap-3 px-4 py-3 text-error/60 hover:text-error hover:bg-error/5 rounded-xl transition-all font-bold text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950/30 p-6 md:p-12 relative flex flex-col">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8 relative z-10">
           <button className="p-2 -ml-2 text-on-surface-variant" onClick={() => setIsSidebarOpen(true)}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
           </button>
           <span className="text-lg font-black tracking-tight">TripSync</span>
           <div className="w-10"></div> {/* Spacer for symmetry */}
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Workspace / Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Active Sync Projects</h1>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none bg-surface border border-border px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/5 transition-all text-center">Import</button>
              <button className="flex-1 sm:flex-none bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20">+ New Trip</button>
            </div>
          </header>

          {/* Invites Overlay */}
          <AnimatePresence>
            {invites.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 glass-card p-6 bg-primary/5 border-primary/20">
                <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Pending Access Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {invites.map((invite) => (
                    <div key={invite.id} className="bg-surface/50 p-4 rounded-2xl flex justify-between items-center border border-border/50 gap-4">
                      <span className="font-bold truncate">{invite.trips?.title}</span>
                      <button onClick={() => acceptInvite(invite.id)} className="bg-primary text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-primary-hover shrink-0">Accept</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Trip - Pill Design (Dark Mode) */}
          <section className="mb-16">
            <div className="bg-surface rounded-3xl md:rounded-[40px] p-2 border border-border/50 flex flex-col sm:flex-row items-center shadow-2xl gap-2">
              <div className="flex-1 px-5 w-full">
                <input
                  className="w-full rounded-full bg-transparent border-none focus:ring-0 text-on-surface font-bold placeholder:text-on-surface-variant/30 py-4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Initialize a new trip workspace..."
                />
              </div>
              <button 
                className="w-full sm:w-auto bg-primary text-white font-black text-xs uppercase tracking-widest px-10 py-5 rounded-2xl md:rounded-[32px] hover:bg-primary-hover transition-all shadow-lg active:scale-95"
                onClick={editingId ? () => updateTrip(editingId) : createTrip}
              >
                {editingId ? "Update Sync" : "Launch Trip"}
              </button>
            </div>
          </section>

          {/* Trips Grid */}
          <section className="grid grid-cols-1 gap-4">
            {trips.length === 0 ? (
              <div className="py-20 md:py-40 text-center glass-card">
                <p className="text-on-surface-variant font-bold">No active trip nodes found in your workspace.</p>
              </div>
            ) : (
              trips.map((trip) => (
                <motion.div 
                  layout
                  key={trip.id} 
                  className="group bg-surface hover:bg-surface/80 border border-border/50 p-4 md:p-6 rounded-2xl flex items-center justify-between transition-all hover:border-primary/50 shadow-sm"
                >
                  <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-900 border border-border flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path></svg>
                    </div>
                    <Link href={`/trips/${trip.id}`} className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-black group-hover:text-primary transition-colors truncate">{trip.title}</h3>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Status: Operational</p>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 md:gap-8 shrink-0">
                     <div className="hidden lg:flex gap-4">
                        <button className="text-[10px] font-black text-on-surface-variant hover:text-primary tracking-[0.2em]" onClick={() => { setEditingId(trip.id); setTitle(trip.title); }}>RENAME</button>
                        <button className="text-[10px] font-black text-error/40 hover:text-error tracking-[0.2em]" onClick={() => deleteTrip(trip.id)}>TERMINATE</button>
                     </div>
                     <Link href={`/trips/${trip.id}`} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                     </Link>
                  </div>
                </motion.div>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}