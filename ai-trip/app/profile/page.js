"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Profile() {
  const [name, setName] = useState("");
  const router = useRouter();

  const saveProfile = async () => {
    if (!name.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("profiles").upsert({
      id: user.id,
      name: name,
      email: user.email,
    });

    router.push("/trips");
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-20">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="text-center mb-16"
        >
          <div className="text-4xl font-black text-on-surface tracking-tighter mb-6 flex items-center justify-center gap-4">
            <div className="w-14 h-14 bg-on-surface rounded-[24px] flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            TripSync
          </div>
          <p className="text-on-surface-variant text-xl font-bold tracking-tight">Finalizing your tactical deployment.</p>
        </motion.header>

        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="w-full max-w-lg glass-card p-16 flex flex-col gap-10 shadow-2xl border-none"
        >
          <h2 className="text-4xl font-black text-on-surface tracking-tight">Profile Initialization</h2>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-2">Operator Full Name</label>
              <input 
                className="w-full glass-input" 
                placeholder="Ex: Alexander Vanguard" 
                value={name}
                onChange={e => setName(e.target.value)} 
              />
            </div>

            <button 
              className="mt-6 w-full btn-premium bg-primary shadow-2xl shadow-primary/30 h-[70px] text-lg" 
              onClick={(e) => { e.preventDefault(); saveProfile(); }}
            >
              Complete Initialization
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}