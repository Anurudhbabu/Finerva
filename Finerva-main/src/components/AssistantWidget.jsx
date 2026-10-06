import { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { api } from '../services/api';

export function AssistantWidget({ token }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async (event) => {
    event.preventDefault();
    const text = prompt.trim();
    if (!text || busy) return;
    setPrompt('');
    setError('');
    setMessages((current) => [...current, { sender: 'you', text }]);
    setBusy(true);
    try {
      const result = await api.chat(text, token);
      setMessages((current) => [...current, { sender: 'finerva', text: result.advice }]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && <section className="mb-3 flex h-[min(440px,75vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/50" aria-label="Finerva assistant">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
          <div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400 text-slate-950"><Bot size={18} /></span><span><strong className="block text-sm text-white">Finerva assistant</strong><small className="text-[10px] text-emerald-300">Connected to your profile</small></span></div>
          <button onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={17} /></button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto p-3" aria-live="polite">
          {messages.length === 0 && <p className="rounded-xl bg-slate-900 p-3 text-xs leading-5 text-slate-300">Ask about your budget, savings goal, or monthly expenses. Replies use the profile details you entered.</p>}
          {messages.map((message, index) => <p key={`${index}-${message.sender}`} className={`max-w-[92%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-xs leading-5 ${message.sender === 'you' ? 'ml-auto bg-emerald-400 text-slate-950' : 'bg-slate-900 text-slate-200'}`}>{message.text}</p>)}
          {busy && <p className="text-xs text-slate-500">Finerva is thinking…</p>}
          {error && <p role="alert" className="rounded-lg bg-rose-400/10 p-2 text-xs text-rose-200">{error}</p>}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-slate-800 p-3">
          <input value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={2000} aria-label="Ask Finerva" placeholder="Ask a money question…" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400" />
          <button disabled={busy || !prompt.trim()} aria-label="Send message" className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 text-slate-950 disabled:opacity-50"><Send size={16} /></button>
        </form>
      </section>}
      <button onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close Finerva assistant' : 'Open Finerva assistant'} className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:scale-105 hover:bg-emerald-300">
        {open ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}
