"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, Building2, UserCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'empresa' | 'candidato'>('empresa');

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#111827] flex flex-col font-sans">
      {/* Navbar with embedded Tabs */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo width={150} height={42} />
          </div>

          <div className="hidden md:flex bg-gray-100 p-1 rounded-full border border-gray-200">
            <button 
              onClick={() => setActiveTab('empresa')}
              className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'empresa' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4" /> Sou Empresa
            </button>
            <button 
              onClick={() => setActiveTab('candidato')}
              className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'candidato' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UserCircle className="w-4 h-4" /> Sou Candidato
            </button>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
              Entrar
            </Link>
            <Link href="/login">
              <Button size="sm" className="rounded-full font-semibold px-6 shadow-sm">
                Criar Conta
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Mobile Tabs Fallback */}
        <div className="md:hidden flex justify-center p-4 border-b border-gray-200 bg-white">
           <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200 w-full max-w-sm">
            <button 
              onClick={() => setActiveTab('empresa')}
              className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'empresa' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Empresa
            </button>
            <button 
              onClick={() => setActiveTab('candidato')}
              className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'candidato' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Candidato
            </button>
          </div>
        </div>

        {activeTab === 'empresa' ? <EmpresaView /> : <CandidatoView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center bg-white">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} TalenToss. A inteligência que conecta vagas aos talentos certos.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// ABA DA EMPRESA
// ==========================================
function EmpresaView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="relative py-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm font-semibold text-blue-600 mb-8">
            <Building2 className="w-4 h-4" /> Para Empresas
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight text-gray-900">
            A inteligência que conecta vagas aos <span className="text-primary">talentos certos.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Sistema inteligente de recrutamento com IA. Publique sua vaga, e nossa IA faz uma varredura no banco cruzando perfis através de vetores matemáticos para entregar o candidato ideal até 10x mais rápido.
          </p>
          <Link href="/login">
            <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-md bg-primary hover:bg-primary/90">
              Postar Minha Primeira Vaga
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 bg-[#F5F7FA]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center text-gray-900">Passo a passo para Empresas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-6 font-bold text-xl">1</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Crie a Vaga</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Descreva os requisitos. Não se preocupe com formatação, a IA entende o contexto semântico.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-6 font-bold text-xl">2</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Match Perfeito</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Usando PgVector, convertemos sua vaga em embeddings matemáticos e cruzamos com milhares de candidatos instantaneamente.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-6 font-bold text-xl">3</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Contrate Rápido</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Acesse a lista ranqueada por porcentagem de compatibilidade. Analise os perfis filtrados e feche a contratação.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// ABA DO CANDIDATO
// ==========================================
function CandidatoView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="relative py-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-semibold text-emerald-600 mb-8">
            <UserCircle className="w-4 h-4" /> Para Talentos
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight text-gray-900">
            Seja encontrado pelas <span className="text-emerald-500">melhores empresas.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Chega de preencher formulários intermináveis. Envie seu PDF e deixe a Inteligência Artificial (Llama 3) estruturar seu perfil e conectá-lo às vagas onde você tem 90%+ de similaridade.
          </p>
          <Link href="/login">
            <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-md bg-emerald-500 hover:bg-emerald-600 text-white border-0">
              Fazer Upload do Currículo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 bg-[#F5F7FA]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center text-gray-900">Passo a passo para Candidatos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 font-bold text-xl">1</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Upload do PDF</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Cadastre-se e jogue seu currículo na tela. Você não precisa digitar suas experiências manualmente de novo.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 font-bold text-xl">2</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Análise Inteligente</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Nossa IA avançada extrairá suas Habilidades e gerará um Score de Empregabilidade exclusivo baseado no seu perfil.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 font-bold text-xl">3</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Vagas Recomendadas</h3>
              <p className="text-gray-500 font-medium leading-relaxed">O TalenToss cruza seu perfil vetorial com as empresas e entrega as vagas exatas onde você se encaixa perfeitamente.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
