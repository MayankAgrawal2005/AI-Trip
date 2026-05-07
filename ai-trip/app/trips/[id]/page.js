"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Map = dynamic(() => import("../../components/Map"), { ssr: false });

export default function TripDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  const [trip, setTrip] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("itinerary");
  const [user, setUser] = useState(null);
  
  const [place, setPlace] = useState("");
  const [places, setPlaces] = useState([]);
  const [editingLocId, setEditingLocId] = useState(null);
  const [editPlace, setEditPlace] = useState("");
  const [selectedCoords, setSelectedCoords] = useState(null);
  
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState([]);
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const chatRef = useRef(null);
  
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
    fetchTrip();
    fetchLocations();
    fetchMembers();
    fetchMessages();

    const channel = supabase
      .channel(`trip-${id}-messages`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          if (payload.new.trip_id === id) {
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const fetchTrip = async () => {
    const res = await fetch(`/api/trips/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.data) {
      setTrip(data.data);
      setTitle(data.data.title || "");
      setDescription(data.data.description || "");
    }
  };

  const updateTrip = async () => {
    await fetch(`/api/trips/${id}`, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, description }),
    });
    fetchTrip();
  };

  const deleteTrip = async () => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    await fetch(`/api/trips/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/trips");
  };

  const fetchLocations = async () => {
    const res = await fetch(`/api/locations?trip_id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPlaces(data.data || []);
  };

  const addLocation = async () => {
    if (!place.trim()) return alert("Enter place name");
    await fetch("/api/locations", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        trip_id: id,
        name: place,
        latitude: selectedCoords?.lat,
        longitude: selectedCoords?.lng, 
      }),
    });
    setPlace("");
    setSelectedCoords(null);
    fetchLocations();
  };

  const deleteLocation = async (locId) => {
    await fetch(`/api/locations/${locId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLocations();
  };

  const updateLocation = async (locId) => {
    await fetch(`/api/locations/${locId}`, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: editPlace }),
    });
    setEditingLocId(null);
    setEditPlace("");
    fetchLocations();
  };

  const fetchMembers = async () => {
    const res = await fetch(`/api/trip-members/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMembers(data.data || []);
  };

  const inviteMember = async () => {
    if (!memberEmail.trim()) return;
    await fetch("/api/trip-members", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ trip_id: id, email: memberEmail }),
    });
    setMemberEmail("");
    fetchMembers();
  };

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data.data || []);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ trip_id: id, content: message }),
    });
    setMessage("");
  };

  const searchPlace = async () => {
    if (!place.trim()) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
    const data = await res.json();
    if (data.length === 0) {
      alert("Place not found");
      return;
    }
    const coords = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
    setSelectedCoords(coords);
  };

  const deleteMessage = async (msgId) => {
    await fetch(`/api/messages/${msgId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMessages();
  };

  const updateMessage = async (msgId) => {
    await fetch(`/api/messages/${msgId}`, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content: editMessage }),
    });
    setEditingMessageId(null);
    setEditMessage("");
    fetchMessages();
  };

  if (!trip) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const tabs = [
    { id: "itinerary", label: "Itinerary", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "map", label: "Map", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
    { id: "members", label: "Members", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" },
    { id: "chat", label: "Chat", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans relative flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-surface border-r border-border/50 flex-col shrink-0">
        <div className="p-8">
          <Link href="/trips" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span className="text-xl font-black tracking-tight">TripSync</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path></svg>
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-border/50">
          <div className="bg-background rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-border flex items-center justify-center font-black text-xs shrink-0">{user?.name?.[0] || "U"}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{user?.name || "User"}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] truncate">Account Verified</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden bg-slate-950/20 p-4 md:p-12 relative flex flex-col min-h-0">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-6xl mx-auto w-full relative z-10 flex-1 flex flex-col min-h-0">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 md:mb-12">
            <div className="w-full">
              <Link href="/trips" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:underline flex items-center gap-2">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                 Dashboard
              </Link>
              <input
                className="text-2xl md:text-4xl font-black bg-transparent border-none focus:ring-0 p-0 text-on-surface outline-none w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={updateTrip}
              />
              <input
                className="text-xs md:text-sm font-bold text-on-surface-variant bg-transparent border-none focus:ring-0 p-0 outline-none w-full mt-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={updateTrip}
                placeholder="Add a description..."
              />
            </div>
            <div className="flex gap-2 shrink-0 self-end sm:self-auto">
              <button className="text-[10px] font-black text-primary/60 hover:text-primary tracking-widest uppercase border border-primary/20 px-3 md:px-4 py-2 rounded-lg" onClick={updateTrip}>Save</button>
              <button className="text-[10px] font-black text-error/40 hover:text-error tracking-widest uppercase border border-error/20 px-3 md:px-4 py-2 rounded-lg" onClick={deleteTrip}>Delete</button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 min-h-0 relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="absolute inset-0 flex flex-col"
              >
                
                {activeTab === "itinerary" && (
                  <div className="glass-card p-6 md:p-10 flex-1 overflow-y-auto">
                    <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8">Itinerary</h2>
                    <div className="space-y-3 md:space-y-4">
                      {places.map((p, idx) => (
                        <div key={p.id} className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-surface/50 border border-border/50 rounded-2xl group hover:border-primary/50 transition-all">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-900 flex items-center justify-center font-black text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all shrink-0">{idx + 1}</div>
                          <div className="flex-1 min-w-0">
                            {editingLocId === p.id ? (
                              <input className="w-full bg-slate-800 border border-border rounded-lg px-4 py-2 text-white outline-none" value={editPlace} onChange={(e) => setEditPlace(e.target.value)} onBlur={() => updateLocation(p.id)} autoFocus />
                            ) : (
                              <span className="font-bold text-base md:text-lg truncate block">{p.name}</span>
                            )}
                          </div>
                          <div className="flex gap-2 md:gap-4 shrink-0">
                            <button className="text-[9px] md:text-[10px] font-black text-on-surface-variant hover:text-primary tracking-widest uppercase" onClick={() => { setEditingLocId(p.id); setEditPlace(p.name); }}>EDIT</button>
                            <button className="text-[9px] md:text-[10px] font-black text-error/40 hover:text-error tracking-widest uppercase" onClick={() => deleteLocation(p.id)}>DEL</button>
                          </div>
                        </div>
                      ))}
                      {places.length === 0 && <div className="py-20 text-center opacity-30 font-bold text-lg">No places added yet.</div>}
                    </div>
                  </div>
                )}

                {activeTab === "map" && (
                  <div className="flex flex-col flex-1 gap-4 md:gap-6 min-h-0">
                    <div className="bg-surface p-1.5 md:p-2 rounded-2xl md:rounded-[32px] border border-border/50 flex flex-col sm:flex-row items-center shadow-xl gap-1">
                      <div className="flex-1 px-4 md:px-6 w-full">
                        <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-bold placeholder:text-on-surface-variant/30 py-2 md:py-3 text-sm" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Search location..." onKeyDown={(e) => e.key === 'Enter' && searchPlace()} />
                      </div>
                      <div className="flex gap-1.5 md:gap-2 mr-2 w-full sm:w-auto p-1.5 sm:p-0">
                        <button className="flex-1 sm:flex-none bg-slate-800 text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[24px] hover:bg-slate-700 transition-all" onClick={searchPlace}>Search</button>
                        <button className="flex-1 sm:flex-none bg-primary text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[24px] hover:bg-primary-hover shadow-lg" onClick={addLocation}>Add</button>
                      </div>
                    </div>
                    <div className="flex-1 rounded-2xl md:rounded-[32px] overflow-hidden border border-border/50 shadow-2xl relative z-0">
                      <Map places={places} selectedCoords={selectedCoords} onSelect={(coords) => { setSelectedCoords(coords); }} />
                    </div>
                  </div>
                )}

                {activeTab === "members" && (
                  <div className="glass-card p-6 md:p-10 flex-1 overflow-y-auto">
                    <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8">Members</h2>
                    <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10">
                      <input className="flex-1 glass-input bg-slate-900/30 text-sm py-3 px-4 rounded-xl" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="Invite by email..." />
                      <button className="bg-primary text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest" onClick={inviteMember}>Invite</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {members.map((m) => (
                        <div key={m.id} className="flex items-center gap-4 p-4 md:p-5 bg-surface/50 rounded-2xl border border-border/50">
                          <div className="w-10 h-10 rounded-full bg-slate-900 border border-border flex items-center justify-center font-black text-xs text-primary shrink-0">{(m.users?.name || m.users?.email)?.[0].toUpperCase()}</div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{m.users?.name || "Invited User"}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest truncate">{m.users?.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="flex flex-col h-full bg-surface/20 rounded-2xl md:rounded-[32px] overflow-hidden border border-border/30 shadow-2xl mb-2 md:mb-4">
                    <div className="bg-surface/50 px-6 md:px-8 py-3 md:py-4 border-b border-border/30 flex justify-between items-center shrink-0">
                       <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-primary">Sync Channel</h2>
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                         <span className="text-[9px] md:text-[10px] font-black text-on-surface-variant">SYNCING</span>
                       </div>
                    </div>
                    <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 p-4 md:p-8 scroll-smooth">
                      {messages.map((m) => {
                        const isMe = user?.user_id === m.user_id;
                        return (
                          <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[8px] md:text-[9px] font-black text-on-surface-variant/60 uppercase mb-1 mx-2 tracking-[0.2em]">{m.users?.name || "Explorer"}</span>
                            <div className={`group relative max-w-[90%] md:max-w-[85%] px-4 md:px-5 py-2 md:py-3 rounded-[15px] md:rounded-[20px] shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-surface border border-border/50 rounded-tl-none'}`}>
                              {editingMessageId === m.id ? (
                                <div className="flex gap-2 min-w-[150px] md:min-w-[200px]">
                                  <input className="bg-white/10 border-none text-white focus:ring-0 p-0 text-sm font-bold w-full" value={editMessage} onChange={(e) => setEditMessage(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && updateMessage(m.id)} />
                                  <button onClick={() => updateMessage(m.id)} className="text-[9px] font-black underline shrink-0">SAVE</button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xs md:text-sm font-bold leading-relaxed">{m.content}</p>
                                  {isMe && (
                                    <div className="absolute top-0 right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 h-full items-center">
                                      <button className="text-[8px] font-black text-on-surface-variant hover:text-white" onClick={() => { setEditingMessageId(m.id); setEditMessage(m.content); }}>EDIT</button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-4 md:p-6 bg-slate-900/50 border-t border-border/30 shrink-0">
                      <div className="flex gap-2 md:gap-3 bg-slate-100 p-1.5 md:p-2 rounded-2xl md:rounded-[24px] border border-border/50 shadow-lg">
                        <input className="flex-1 bg-transparent rounded-full border-none text-on-surface focus:ring-0 px-4 md:px-6 font-bold text-xs md:text-sm" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message..." onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
                        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0" onClick={sendMessage}>
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-surface border-t border-border/50 flex justify-around items-center py-3 px-2 shrink-0 z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label === "Interactive Map" ? "Map" : tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
