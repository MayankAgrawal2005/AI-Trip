"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const signup = async () => {
    await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 md:p-12 flex flex-col gap-8 md:gap-10 shadow-2xl relative z-10 bg-surface/40"
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 md:mb-10 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span className="text-xl md:text-2xl font-black text-on-surface">TripSync</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-on-surface mb-3 tracking-tight">Sign Up</h1>
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Create a new account</p>
        </div>

        <div className="flex flex-col gap-5 md:gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Name</p>
            <input 
              className="w-full glass-input bg-slate-950/50 text-sm md:text-base py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl border border-border/50 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/10" 
              placeholder="Enter your name..." 
              type="text" 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Email</p>
            <input 
              className="w-full glass-input bg-slate-950/50 text-sm md:text-base py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl border border-border/50 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/10" 
              placeholder="Enter your email..." 
              type="email" 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Password</p>
            <input 
              className="w-full glass-input bg-slate-950/50 text-sm md:text-base py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl border border-border/50 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/10" 
              placeholder="Create a password..." 
              type="password" 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>
          <button 
            className="w-full btn-premium h-14 md:h-16 text-xs uppercase tracking-[0.3em] font-black mt-2 md:mt-4 shadow-xl" 
            onClick={(e) => { e.preventDefault(); signup(); }}
          >
            Sign Up
          </button>
        </div>
        
        <p className="text-center text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          Already have an account? <Link className="text-primary hover:underline ml-2" href="/login">Login</Link>
        </p>
      </motion.div>
      
      {/* System Status Line */}
      <div className="mt-8 md:mt-12 text-[8px] md:text-[10px] font-black text-on-surface-variant/20 tracking-[0.3em] md:tracking-[0.5em] uppercase text-center px-6">
        TRIPS_YNC INITIALIZATION PROTOCOL
      </div>
    </div>
  );
}