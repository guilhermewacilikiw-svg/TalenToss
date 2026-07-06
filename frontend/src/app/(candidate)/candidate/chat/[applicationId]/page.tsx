"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Send, Bot, User, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ChatInterviewPage() {
  const params = useParams();
  const applicationId = params.applicationId as string;
  
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChat();
  }, [applicationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Check if interview is finished
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderRole === "COMPANY" && lastMsg.content.includes("[ENTREVISTA_FINALIZADA]")) {
      setIsFinished(true);
    }
  }, [messages]);

  const loadChat = async () => {
    try {
      const res = await api.get(`/candidates/applications/${applicationId}/chat`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending || isFinished) return;

    const currentInput = inputValue;
    setInputValue("");
    
    // Optimistic UI
    const tempMsg = {
      id: Date.now().toString(),
      senderRole: "CANDIDATE",
      content: currentInput,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setSending(true);

    try {
      await api.post(`/candidates/applications/${applicationId}/chat`, { content: currentInput });
      // Fetch fresh chat to get DB IDs and bot response
      await loadChat();
    } catch (err) {
      console.error(err);
      // Revert optimistic if failed
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setInputValue(currentInput);
      alert("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  const formatMessage = (content: string) => {
    return content.replace("[ENTREVISTA_FINALIZADA]", "").trim();
  };

  if (loading) {
    return <div className="h-[80vh] flex items-center justify-center animate-pulse text-muted-foreground">Conectando ao assistente...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto h-[85vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/candidate/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">TalenToss Bot</h2>
            <p className="text-xs text-slate-500">Triagem Técnica Inicial</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        <div className="text-center text-xs text-slate-400 my-4">A entrevista técnica iniciou</div>
        
        {messages.map((msg) => {
          const isBot = msg.senderRole === 'COMPANY';
          return (
            <div key={msg.id} className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'}`}>
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isBot ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' : 'bg-primary text-white rounded-tr-none shadow-sm'}`}>
                {formatMessage(msg.content)}
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        {isFinished ? (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm">
            <CheckCircle2 className="w-5 h-5" /> Entrevista finalizada! O recrutador avaliará suas respostas.
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua resposta..."
              disabled={sending}
              className="flex-1 bg-slate-50 border-slate-200"
            />
            <Button type="submit" disabled={sending || !inputValue.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
