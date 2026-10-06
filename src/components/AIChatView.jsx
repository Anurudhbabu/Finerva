import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  CheckCircle2, 
  User, 
  Copy, 
  Check,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export const AIChatView = ({ user, token }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      modelUsed: 'Finerva local financial assistant',
      source: 'FINERVA API',
      category: 'Finerva Advisory',
      text: `Hello ${user.name.split(' ')[0]}! Ask me about budgeting, savings, or debt. Replies use the financial details you entered in your profile.`,
      actionItems: [
        'Check that your income and expense details are current',
        'Choose a monthly savings goal that fits your priorities'
      ],
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "How can I save an extra $500 this month?",
    "Evaluate my 50/30/20 budget breakdown",
    "Best low-risk SIP strategy for tech students",
    "Should I pay off debt or invest surplus first?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await api.chat(query, token);

      setMessages(prev => [
        ...prev,
        {
          id: aiResponse.id,
          sender: 'ai',
          modelUsed: aiResponse.modelUsed,
          source: aiResponse.source,
          category: aiResponse.category,
          text: aiResponse.advice,
          actionItems: aiResponse.actionItems,
          timestamp: aiResponse.timestamp
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          modelUsed: 'Finerva API',
          source: 'ERROR',
          category: 'Connection error',
          text: `The Finerva API request failed: ${err.message}. Check that the backend service is running, then retry.`,
          actionItems: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col glass-panel rounded-3xl border border-slate-800/80 overflow-hidden">
      
      {/* Header with Dual-AI Model Selector */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Finerva Financial Assistant</h2>
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400">Connected to your profile through the Finerva API</p>
          </div>
        </div>

        <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">Profile-aware · Local API</span>
      </div>

      {/* Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 ${
              msg.sender === 'user'
                ? 'bg-emerald-500 text-slate-950 font-medium ml-12 rounded-tr-sm shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/80 border border-slate-800/80 text-slate-200 mr-12 rounded-tl-sm'
            }`}>
              
              {/* AI Message Sub-header */}
              {msg.sender === 'ai' && (
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-400">{msg.category}</span>
                    <span>•</span>
                    <span className="text-slate-500">{msg.modelUsed}</span>
                  </div>

                  <button 
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="p-1 hover:text-white text-slate-400 rounded transition-colors"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Message Content */}
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>

              {/* Action Items List */}
              {msg.actionItems && msg.actionItems.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Recommended Next Steps:</span>
                  </p>
                  <ul className="space-y-1.5">
                    {msg.actionItems.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className={`text-[10px] mt-2 text-right ${msg.sender === 'user' ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                {msg.timestamp}
              </p>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-400 ml-1">Preparing a profile-aware reply…</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold whitespace-nowrap">Suggested:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>{prompt}</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80 flex items-center gap-3"
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Finerva anything about saving, budgeting, or investing..."
          className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
