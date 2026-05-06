"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [name, setName] = useState("");
  const router = useRouter();

  const saveProfile = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("profiles").upsert({
      id: user.id,
      name: name,
      email: user.email, // IMPORTANT
    });

    router.push("/trips");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Complete Profile</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />

      <button onClick={saveProfile}>Save</button>
    </div>
  );
}