"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal } from "lucide-react";

export function UsernameInput() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    router.push(`/roast/${encodeURIComponent(username.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl w-full mx-auto mt-12 px-6">
      <div className="relative group flex items-center border-b-2 border-foreground/20 focus-within:border-accent transition-colors duration-dur-base">
        <Terminal className="absolute left-0 w-6 h-6 text-foreground/50 group-focus-within:text-accent transition-colors duration-dur-base" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="github_username"
          spellCheck={false}
          autoComplete="off"
          autoFocus
          className="w-full bg-transparent border-none outline-none py-4 pl-10 pr-4 text-xl sm:text-2xl font-display placeholder:text-foreground/30 text-foreground"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !username.trim()}
        className="self-end px-6 py-3 bg-accent text-background font-display uppercase tracking-widest text-sm hover:bg-accent-hover focus-visible:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-dur-fast"
      >
        {loading ? "Generating..." : "Roast me"}
      </button>
    </form>
  );
}
