import { useEffect, useRef, useState } from 'react';
import { Bot, Check, ChevronRight, Copy, Send, User } from 'lucide-react';
import { api } from '../services/api';

export const AIChatView = ({ user, token }) => {
  const [messages, setMessages] = useState([{
    id: 'welcome', sender: 'ai', modelUsed: 'Finerva local financial assistant', source: 'FINERVA API',
    category: 'Finerva Advisory',
    text: `Hello ${user.name.split(' ')[0]}! Ask me about budgeting, savings, or debt. Replies use the financial details you entered in your profile.`,
    actionItems: ['Check that your income and expense details are current', 'Choose a monthly savings goal that fits your priorities'],
    timestamp: 'Just now'
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const endRef = useRef(null);

  const prompts = ['How can I save an extra $500 this month?', 'Evaluate my 50/30/20 budget breakdown', 'Should I pay off debt or invest surplus first?', 'Best low-risk savings strategy for students'];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = async (text) => {
    const q = text || input;
    if (!q.trim() || typing) return;
    setMessages(p => [...p, { id: 'u-' + Date.now(), sender: 'user', text: q, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput(''); setTyping(true);
    try {
      const r = await api.chat(q, token);
      setMessages(p => [...p, { id: r.id, sender: 'ai', modelUsed: r.modelUsed, source: r.source, category: r.category, text: r.advice, actionItems: r.actionItems, timestamp: r.timestamp }]);
    } catch (e) {
      setMessages(p => [...p, { id: 'err-' + Date.now(), sender: 'ai', modelUsed: 'Finerva API', source: 'ERROR', category: 'Error', text: `Request failed: ${e.message}. Check that the backend is running.`, actionItems: [], timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally { setTyping(false); }
  };

  const copy = (id, text) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 7, display: 'grid', placeItems: 'center' }}>
            <Bot size={16} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Finerva Financial Assistant</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 7px', background: 'var(--accent-light)', color: 'var(--accent-mid)', borderRadius: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-mid)', display: 'inline-block' }} />Live
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-3)' }}>Connected to your profile · Local API</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg)' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: 10, justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.sender === 'ai' && (
              <div style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 6, display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 2 }}>
                <Bot size={14} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth: 560, padding: '12px 16px',
              background: msg.sender === 'user' ? 'var(--accent)' : 'var(--surface)',
              color: msg.sender === 'user' ? '#fff' : 'var(--ink)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
              borderRadius: msg.sender === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              marginLeft: msg.sender === 'user' ? 40 : 0,
              marginRight: msg.sender === 'ai' ? 40 : 0,
            }}>
              {msg.sender === 'ai' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent-mid)' }}>{msg.category}</span>
                  <button onClick={() => copy(msg.id, msg.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'grid', placeItems: 'center', padding: 2 }}>
                    {copiedId === msg.id ? <Check size={12} color="var(--accent-mid)" /> : <Copy size={12} />}
                  </button>
                </div>
              )}
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-line' }}>{msg.text}</p>
              {msg.actionItems?.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Next steps</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {msg.actionItems.map((item, i) => (
                      <li key={i} style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent-mid)', fontWeight: 700, flexShrink: 0 }}>·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p style={{ margin: '6px 0 0', fontSize: 10, color: msg.sender === 'user' ? 'rgba(255,255,255,0.55)' : 'var(--ink-3)', textAlign: 'right' }}>{msg.timestamp}</p>
            </div>
            {msg.sender === 'user' && (
              <div style={{ width: 30, height: 30, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 2 }}>
                <User size={14} color="var(--ink-3)" />
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 6, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Bot size={14} color="#fff" /></div>
            <div style={{ padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px 10px 10px 2px', display: 'flex', alignItems: 'center', gap: 5 }}>
              {[0, 150, 300].map(d => <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-mid)', display: 'inline-block', animation: `bounce 1s ${d}ms infinite` }} />)}
              <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 4 }}>Preparing reply…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested prompts */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)', whiteSpace: 'nowrap', alignSelf: 'center' }}>Try:</span>
        {prompts.map((p, i) => (
          <button key={i} onClick={() => send(p)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 11, fontWeight: 500, color: 'var(--ink-2)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
            {p}<ChevronRight size={11} color="var(--ink-3)" />
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); send(); }} style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: 10, flexShrink: 0 }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about saving, budgeting, or investing…"
          style={{ flex: 1, padding: '9px 14px', fontSize: 13, color: 'var(--ink)', background: 'var(--bg)', border: '1px solid var(--border-strong)', borderRadius: 6, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-mid)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
        />
        <button type="submit" disabled={!input.trim() || typing} style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, background: 'var(--accent)', border: 'none', borderRadius: 6, cursor: !input.trim() || typing ? 'not-allowed' : 'pointer', opacity: !input.trim() || typing ? 0.5 : 1 }}>
          <Send size={15} color="#fff" />
        </button>
      </form>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
};
