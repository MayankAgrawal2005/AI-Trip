"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center">
      <Link href="/" className="text-xl md:text-2xl font-black text-on-surface flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        TripSync
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10">
        <Link href="#how-it-works" className="text-sm font-black text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase">Method</Link>
        <Link href="#features" className="text-sm font-black text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase">Features</Link>
        <Link href="#pricing" className="text-sm font-black text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase">Tiers</Link>
        <Link href="/login" className="text-sm font-black text-on-surface tracking-widest uppercase">Login</Link>
        <Link href="/signup" className="btn-premium px-8 py-3 bg-primary text-xs uppercase tracking-widest">Initialize Sync</Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden text-on-surface p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-surface border-b border-border/40 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            <Link onClick={() => setIsOpen(false)} href="#how-it-works" className="text-sm font-black text-on-surface-variant tracking-widest uppercase">Method</Link>
            <Link onClick={() => setIsOpen(false)} href="#features" className="text-sm font-black text-on-surface-variant tracking-widest uppercase">Features</Link>
            <Link onClick={() => setIsOpen(false)} href="#pricing" className="text-sm font-black text-on-surface-variant tracking-widest uppercase">Tiers</Link>
            <div className="h-[1px] bg-border/20 w-full"></div>
            <Link onClick={() => setIsOpen(false)} href="/login" className="text-sm font-black text-on-surface tracking-widest uppercase">Login</Link>
            <Link onClick={() => setIsOpen(false)} href="/signup" className="btn-premium w-full py-4 bg-primary text-center text-xs uppercase tracking-widest">Initialize Sync</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
