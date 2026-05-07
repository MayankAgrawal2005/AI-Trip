"use client";

import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-20 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20 mb-8 md:mb-10">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
            System Operational
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-black text-on-surface mb-8 md:mb-10 tracking-tighter leading-[1.1] md:leading-[0.85]">
            Plan your <br className="hidden sm:block" /> <span className="text-gradient">next mission.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 md:mb-16 font-bold leading-relaxed">
            A high-performance workspace for coordinated travel. Synchronize itineraries, maps, and personnel in real-time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-16 md:mb-24 px-4 sm:px-0">
            <Link href="/signup" className="btn-premium px-8 md:px-16 py-4 md:py-5 text-base md:text-lg uppercase tracking-widest shadow-2xl w-full sm:w-auto">
              Start Project
            </Link>
            <Link href="/login" className="btn-ghost px-8 md:px-16 py-4 md:py-5 text-base md:text-lg border border-border/50 uppercase tracking-widest w-full sm:w-auto">
              Resume Sync
            </Link>
          </div>
        </motion.div>

        {/* Product Preview (Dark) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-6xl rounded-[24px] md:rounded-[40px] overflow-hidden shadow-[0_60px_150px_-20px_rgba(59,130,246,0.15)] border border-border/50 bg-surface"
        >
          <img 
            src="/homephoto.png" 
            alt="TripSync Interface" 
            className="w-full h-auto opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-32 px-6 border-y border-border/40 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10 md:gap-20 items-center opacity-30 grayscale invert">
           {/* Mock Logos */}
           <div className="text-2xl md:text-4xl font-black">VOYAGER</div>
           <div className="text-2xl md:text-4xl font-black">EXPEDITION</div>
           <div className="text-2xl md:text-4xl font-black">NOMADIC</div>
           <div className="text-2xl md:text-4xl font-black">HORIZON</div>
        </div>
      </section>

      {/* Comparison Section (Dark) */}
      <section className="py-20 md:py-40 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div {...fadeInUp}>
             <p className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 text-center lg:text-left">Efficiency Gap</p>
            <h2 className="text-4xl md:text-7xl font-black text-on-surface mb-8 md:mb-10 tracking-tight leading-none text-center lg:text-left">Chaos vs. <br className="hidden md:block" />Cohesion.</h2>
            <div className="space-y-4 md:space-y-6">
              {[
                { old: "WhatsApp Groups", new: "Organized Sync Chat" },
                { old: "Static Documents", new: "Dynamic Visual Itinerary" },
                { old: "Fragmented Map Pins", new: "Unified Interactive Map" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-6 md:p-8 glass-card bg-surface/50 text-center sm:text-left">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-error/30 line-through mb-1 tracking-widest uppercase">{item.old}</p>
                    <p className="text-lg md:text-xl font-black text-on-surface tracking-tight">{item.new}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="relative">
             <div className="glass-card p-8 md:p-16 bg-gradient-to-br from-primary to-primary-hover text-white text-center lg:text-left">
                <div className="text-2xl md:text-4xl font-black mb-8 md:mb-10 leading-tight">"TripSync eliminated the communication bottleneck during our 12-person European tour."</div>
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/20"></div>
                  <div>
                    <p className="font-black text-base md:text-lg">Marcus Thorne</p>
                    <p className="text-[10px] md:text-sm font-bold text-white/60 uppercase tracking-widest">Lead Coordinator</p>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works (Dark) */}
      <section id="how-it-works" className="py-20 md:py-40 px-6 max-w-7xl mx-auto text-center">
        <motion.p {...fadeInUp} className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6">Protocol</motion.p>
        <motion.h2 {...fadeInUp} className="text-4xl md:text-8xl font-black mb-16 md:mb-24 tracking-tighter">Operational in 3 steps.</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-border/40 hidden lg:block"></div>
          {[
            { step: "01", title: "Initialize", desc: "Define your destination and project parameters.", icon: "M12 4v16m8-8H4" },
            { step: "02", title: "Invite Personnel", desc: "Grant secure access to your coordination team.", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
            { step: "03", title: "Sync & Execute", desc: "Engage with real-time mapping and group logic.", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" }
          ].map((item, i) => (
            <motion.div key={i} {...fadeInUp} className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-surface border border-border/50 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-10 shadow-2xl group hover:border-primary/50 transition-all shrink-0">
                 <svg className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              </div>
              <p className="text-primary font-black text-[10px] mb-4 md:mb-6 tracking-[0.3em] uppercase">{item.step} — System</p>
              <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 tracking-tight">{item.title}</h3>
              <p className="text-sm md:text-base text-on-surface-variant font-bold leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing (Dark) */}
      <section id="pricing" className="py-20 md:py-40 px-6 max-w-5xl mx-auto text-center border-t border-border/40">
        <motion.h2 {...fadeInUp} className="text-4xl md:text-7xl font-black mb-16 md:mb-24 tracking-tighter">Sync Licenses.</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-left px-4 sm:px-0">
          <motion.div {...fadeInUp} className="glass-card p-10 md:p-16 bg-surface/30 border-border/40">
             <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Explorer</h3>
             <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12">Standard Access</p>
             <ul className="space-y-4 md:space-y-6 mb-12 md:mb-16">
               {["3 Active Project Syncs", "Unlimited Personnel", "Global Map Access", "Sync Channel Auth"].map(item => (
                 <li key={item} className="flex items-center gap-4 font-bold text-sm md:text-base text-on-surface-variant">
                   <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                   {item}
                 </li>
               ))}
             </ul>
             <Link href="/signup" className="w-full bg-border/20 text-on-surface font-black uppercase tracking-widest py-4 md:py-5 rounded-2xl text-center block hover:bg-border/30 transition-all text-xs md:text-sm">Initialize</Link>
          </motion.div>
          <motion.div {...fadeInUp} className="glass-card p-10 md:p-16 border-primary bg-primary/5 shadow-primary/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 md:px-8 py-2 md:py-3 rounded-bl-2xl md:rounded-bl-3xl animate-pulse">High Priority</div>
             <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Voyager</h3>
             <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12">$12 USD / MO</p>
             <ul className="space-y-4 md:space-y-6 mb-12 md:mb-16">
               {["Unlimited Project Syncs", "Encrypted Data Export", "Offline Buffer Access", "Priority Command Support"].map(item => (
                 <li key={item} className="flex items-center gap-4 font-black text-sm md:text-base">
                   <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                   {item}
                 </li>
               ))}
             </ul>
             <Link href="/signup" className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 md:py-5 rounded-2xl text-center block shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all text-xs md:text-sm">Upgrade Auth</Link>
          </motion.div>
        </div>
      </section>

      {/* Footer (Dark) */}
      <footer className="py-20 md:py-40 px-6 border-t border-border/40 bg-surface/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24 text-center md:text-left">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <Link href="/" className="text-3xl md:text-4xl font-black text-on-surface flex items-center gap-4 mb-8 md:mb-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              TripSync
            </Link>
            <p className="text-on-surface-variant max-w-sm font-bold leading-relaxed mb-10 md:mb-12 text-base md:text-lg">
              The definitive real-time workspace for coordinated group travel and mission planning.
            </p>
            <div className="flex gap-8 md:gap-10">
              {["X", "INSTAGRAM", "GITHUB"].map(s => <span key={s} className="text-[10px] font-black cursor-pointer text-on-surface-variant hover:text-primary transition-all tracking-[0.2em]">{s}</span>)}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 text-primary">Workspace</h4>
            <ul className="space-y-4 md:space-y-6 text-on-surface-variant font-black text-xs tracking-widest">
              <li><Link href="#">Parameters</Link></li>
              <li><Link href="#">Mobile Sync</Link></li>
              <li><Link href="#">Network</Link></li>
              <li><Link href="#">Licensing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 text-primary">Security</h4>
            <ul className="space-y-4 md:space-y-6 text-on-surface-variant font-black text-xs tracking-widest">
              <li><Link href="#">Privacy Protocol</Link></li>
              <li><Link href="#">Terms of Use</Link></li>
              <li><Link href="#">Encryption</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 md:mt-40 pt-10 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant/30 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-center">
            &copy; {new Date().getFullYear()} TRIPS_YNC TERMINAL. ALL RIGHTS RESERVED.
          </p>
          <div className="w-4 h-4 rounded-full bg-accent/20 animate-pulse border border-accent/40"></div>
        </div>
      </footer>
    </div>
  );
}