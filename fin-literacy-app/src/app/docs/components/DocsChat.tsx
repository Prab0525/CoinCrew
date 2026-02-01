"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type Props = {
  docName?: string;
  safeSummary?: string;
  ageRange?: "8-11" | "12-15" | "16-18" | string;
};

export default function DocsChatWidget({ docName, safeSummary, ageRange }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "hello",
      role: "assistant",
      text:
        "Hi bestie 👋 I’m Doc Buddy. Ask me anything about your document and I’ll explain it in simple words.",
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  const title = useMemo(() => {
    if (!docName) return "Doc Buddy";
    return `Doc Buddy · ${docName}`;
  }, [docName]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [open, messages.length]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");

    // If summary isn't ready, tell the user nicely
    if (!safeSummary || safeSummary.trim().length < 5) {
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          "I don’t have the document summary yet 😭 Go back and click **Explain** first, then come back and ask me anything!",
      };
      setMessages((m) => [...m, botMsg]);
      return;
    }

    const typingMsgId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      { id: typingMsgId, role: "assistant", text: "Typing…" },
    ]);
    setSending(true);

    try {
      const res = await fetch("/api/docs/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageRange: ageRange === "8-11" || ageRange === "12-15" || ageRange === "16-18" ? ageRange : "12-15",
          safeSummary,
          message: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error ? JSON.stringify(data.error) : "Chat request failed"
        );
      }

      const replyText =
        typeof data.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : "Hmm I didn’t get a good answer back. Try asking in a simpler way.";

      // replace "Typing…" message with real reply
      setMessages((m) =>
        m.map((msg) =>
          msg.id === typingMsgId
            ? { ...msg, text: replyText }
            : msg
        )
      );
    } catch (err: any) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === typingMsgId
            ? {
                ...msg,
                text:
                  "Ugh 😭 something broke on the backend. Check the terminal for the error and try again.",
              }
            : msg
        )
      );
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur hover:bg-white"
        aria-label="Open chat"
      >
        <span className="text-xl">💬</span>
      </button>

      {/* popup */}
      {open ? (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/20"
            aria-label="Close chat backdrop"
          />

          {/* panel */}
          <div className="absolute bottom-5 right-5 w-[340px] max-w-[calc(100vw-40px)] overflow-hidden rounded-3xl border border-black/10 bg-white/85 shadow-2xl backdrop-blur">
            {/* header */}
            <div className="flex items-center justify-between border-b border-black/10 bg-gradient-to-r from-[#F8F7BA]/70 via-white to-[#A3CCDA]/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#BDE3C3]/70">
                  🧠
                </div>
                <div>
                  <div className="text-sm font-extrabold text-black/75">{title}</div>
                  <div className="text-[11px] text-black/50">
                    Ask follow ups while you view the PDF
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-black/10 bg-white/70 px-2 py-1 text-xs font-bold text-black/60 hover:bg-white"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* messages */}
            <div ref={listRef} className="h-[320px] overflow-auto px-3 py-3">
              <div className="space-y-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={[
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug",
                      m.role === "user"
                        ? "ml-auto bg-[#A3CCDA]/55 text-black/75"
                        : "mr-auto bg-[#F5D2D2]/55 text-black/75",
                    ].join(" ")}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </div>

            {/* input */}
            <div className="border-t border-black/10 bg-white/60 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder="Type a question…"
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-black/75 outline-none placeholder:text-black/35 focus:ring-2 focus:ring-[#A3CCDA]/60"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={sending}
                  className="rounded-2xl bg-[#BDE3C3]/80 px-3 py-2 text-sm font-extrabold text-black/70 hover:bg-[#BDE3C3] disabled:opacity-60"
                >
                  {sending ? "..." : "Send"}
                </button>
              </div>

              <div className="mt-2 text-[11px] text-black/45">
                Tip: paste a sentence from the PDF and ask “what does this mean”
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
