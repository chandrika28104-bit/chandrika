import React, { useState, useRef, useEffect } from 'react';
import { AnalysisData, ChatMessage } from '../types/career';
import { Send, Bot, User, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

interface CareerChatProps {
  analysisContext: AnalysisData | null;
  candidateName?: string;
  presetQuestion?: string;
  onClearPresetQuestion?: () => void;
}

export const CareerChat: React.FC<CareerChatProps> = ({
  analysisContext,
  candidateName,
  presetQuestion,
  onClearPresetQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: analysisContext
        ? `Hello${candidateName ? ` ${candidateName}` : ''}! I have reviewed your ATS analysis (Score: ${analysisContext.ats_score}/100). Ask me anything: how to explain gaps, rewrite specific job bullets, prepare for technical questions, or tailor your pitch.`
        : 'Hello! I am your AI Career Copilot. Analyze a resume to get grounded coaching, or ask me any general career advice question now.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill preset question if sent from result card
  useEffect(() => {
    if (presetQuestion) {
      setInput(presetQuestion);
      if (onClearPresetQuestion) onClearPresetQuestion();
    }
  }, [presetQuestion, onClearPresetQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: analysisContext,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Chat server error');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error: ${err.message || 'Unable to reach Copilot chat.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const starterQuestions = [
    'How should I address the missing keywords in my summary?',
    'Give me a 30-second elevator pitch for this role.',
    'How can I justify my experience level against the job requirements?',
    'What is the best way to prepare for the technical interview for this stack?',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              AI Career Copilot Chat
            </h3>
            <p className="text-[11px] text-slate-500">
              {analysisContext
                ? `Context: ATS Score ${analysisContext.ats_score}% · Grounded on current resume evaluation`
                : 'General career advisor mode'}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content: 'Chat history cleared. What would you like to discuss next?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="text-xs text-slate-400 hover:text-slate-700 px-2.5 py-1 rounded-md hover:bg-slate-200/60 transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-br-none shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div
                className={`text-[9px] mt-1.5 ${
                  msg.role === 'user' ? 'text-orange-100 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
            <span>Copilot is formulating guidance...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starters */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-slate-400 shrink-0 text-[11px] font-semibold">Quick questions:</span>
          {starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(q);
              }}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your Copilot about interview prep, gaps, or resume phrasing..."
          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
