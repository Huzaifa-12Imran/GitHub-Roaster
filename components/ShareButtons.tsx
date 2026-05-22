"use client";

import { Copy, MessageCircle } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ username, grade }: { username: string; grade: string }) {
  const [copied, setCopied] = useState(false);
  const shareText = `I got a ${grade} on GitHub Roaster. Come roast my code.`;
  const url = typeof window !== "undefined" ? window.location.href : `https://github-roaster.vercel.app/roast/${username}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap gap-4">
      <a 
        href={tweetUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-3 border border-foreground/20 hover:border-accent hover:text-accent transition-colors duration-dur-fast uppercase tracking-widest text-xs font-display bg-paper-2"
      >
        <MessageCircle className="w-4 h-4" />
        Share on X
      </a>
      <button 
        onClick={copyLink}
        className="flex items-center gap-2 px-6 py-3 border border-foreground/20 hover:border-accent hover:text-accent transition-colors duration-dur-fast uppercase tracking-widest text-xs font-display bg-paper-2"
      >
        <Copy className="w-4 h-4" />
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <a 
        href={`/?roast=${username}`} 
        className="flex items-center gap-2 px-6 py-3 bg-accent text-background hover:bg-accent-hover transition-colors duration-dur-fast uppercase tracking-widest text-xs font-display ml-auto"
      >
        Roast a friend
      </a>
    </div>
  );
}
