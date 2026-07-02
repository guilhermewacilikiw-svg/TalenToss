"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, Building2, UserCircle, Target, Shield, Cpu, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'empresa' | 'candidato'>('empresa');

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#111827] flex flex-col font-sans selection:bg-primary/10">
      {/* Navbar header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo width={140} height={40} />
          </div>

          <div className="hidden md:flex bg-gray-100/80 p-0.5 rounded-full border border-gray-200/50">
            <button 
              onClick={() => setActiveTab('empresa')}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                activeTab === 'empresa' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Sou Empresa
            </button>
            <button 
              onClick={() => setActiveTab('candidato')}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                activeTab === 'candidato' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UserCircle className="w-3.5 h-3.5" /> Sou Candidato
            </button>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-[#111827] transition-colors">
              Entrar
            </Link>
            <Link href="/login">
              <Button size="sm" className="rounded-full bg-[#111827] text-white hover:bg-[#111827]/90 font-semibold px-5 shadow-sm border-0">
                Criar Conta
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Mobile Tabs */}
        <div className="md:hidden flex justify-center p-4 border-b border-gray-100 bg-white">
           <div className="flex bg-gray-100/80 p-0.5 rounded-full border border-gray-200/50 w-full max-w-sm">
            <button 
              onClick={() => setActiveTab('empresa')}
              className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                activeTab === 'empresa' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Empresa
            </button>
            <button 
              onClick={() => setActiveTab('candidato')}
              className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                activeTab === 'candidato' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Candidato
            </button>
          </div>
        </div>

        {activeTab === 'empresa' ? <EmpresaView /> : <CandidatoView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 py-12 bg-white mt-auto">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo width={120} height={35} />
          <p className="text-xs font-medium text-gray-400">
            &copy; {new Date().getFullYear()} TalenToss Inc. A inteligência artificial que simplifica o recrutamento global.
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
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Hero Section */}
      <section className="relative py-28 overflow-hidden bg-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/60 border border-blue-100 text-xs font-semibold text-primary mb-8 tracking-wider uppercase">
            <BrainCircuit className="w-3.5 h-3.5 animate-pulse" /> Inteligência Artificial de Ponta
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-gray-900">
            A contratação ideal, <span className="text-primary">10x mais rápida.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            TalenToss automatiza a triagem, o mapeamento de competências e o agendamento seletivo. Menos planilhas, mais conversação com candidatos de alta similaridade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-sm bg-primary hover:bg-primary/95 font-semibold">
                Começar Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#como-funciona" className="text-sm font-semibold text-gray-500 hover:text-gray-900 py-3 px-6 transition-colors">
              Como funciona →
            </a>
          </div>
        </div>
      </section>


      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">Pipeline de Recrutamento Automatizado</h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">Do anúncio da vaga à proposta oficial de emprego com zero esforço manual.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-100/80 bg-white hover:shadow-lg hover:border-gray-200/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-50/50 text-primary flex items-center justify-center mb-6 font-bold text-sm">01</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Publique em segundos</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Nossa IA lê sua breve descrição e sugere competências, salário e requisitos estruturados de forma automática.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100/80 bg-white hover:shadow-lg hover:border-gray-200/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-50/50 text-primary flex items-center justify-center mb-6 font-bold text-sm">02</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">IA Classifica Candidatos</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Não perca horas lendo PDFs. O sistema analisa currículos e calcula o score de match baseado em similaridade semântica.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100/80 bg-white hover:shadow-lg hover:border-gray-200/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-50/50 text-primary flex items-center justify-center mb-6 font-bold text-sm">03</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Onboarding e Agenda</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Os melhores ranqueados recebem mensagens com links integrados ao calendário oficial da empresa automaticamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recurso Destaque IA */}
      <section className="py-24 bg-[#F5F7FA] border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">Chega de buscas por palavras-chave antigas</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Nossa busca de IA compreende conceitos e experiência prática. Se você busca um profissional de "Vendas B2B e CRM", a IA saberá mapear habilidades correlatas como "Negociação", "Gestão de Pipeline", "HubSpot" e "Salesforce", mesmo que não estejam literais no perfil.
              </p>
              <ul className="space-y-3 font-semibold text-sm text-gray-700">
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Análise Comportamental Integrada</li>
                <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Conformidade com a LGPD</li>
                <li className="flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> Extração de Experiência em Milissegundos</li>
              </ul>
            </div>
            <div className="p-6 bg-white border border-gray-200/60 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold text-gray-600">IA ANALYTICS</span>
                </div>
                <span className="text-xs font-bold text-primary">Match 96%</span>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-8 bg-blue-50/50 border border-blue-100 rounded p-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary tracking-wide">QUALIFICAÇÃO COMPLETA</span>
                  <span className="text-[10px] text-gray-500">Salesforce, CRM, Pipeline</span>
                </div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
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
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Hero Section */}
      <section className="relative py-28 overflow-hidden bg-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50/60 border border-green-100 text-xs font-semibold text-green-600 mb-8 tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5" /> 1-Click Profile Setup
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-gray-900">
            Destaque-se de forma <span className="text-green-500">instantânea.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Não gaste tempo preenchendo cadastros manuais. Suba seu currículo em PDF e deixe nossa Inteligência Artificial ler, traduzir e criar um perfil atraente para headhunters globais.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-sm bg-green-500 hover:bg-green-600 border-0 text-white font-semibold">
                Enviar Meu Currículo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#como-funciona-candidato" className="text-sm font-semibold text-gray-500 hover:text-gray-900 py-3 px-6 transition-colors">
              Como funciona →
            </a>
          </div>
        </div>
      </section>


      {/* Como Funciona para Candidatos */}
      <section id="como-funciona-candidato" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">Seu Perfil Conectado em Minutos</h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">Tudo que você precisa fazer é manter seu arquivo PDF de currículo atualizado.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-100/80 bg-white hover:shadow-lg hover:border-gray-200/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-green-50/50 text-green-600 flex items-center justify-center mb-6 font-bold text-sm">01</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Faça o Upload</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Nossa tecnologia de extração lê o conteúdo de texto do seu arquivo PDF em poucos milissegundos.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100/80 bg-white hover:shadow-lg hover:border-gray-200/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-green-50/50 text-green-600 flex items-center justify-center mb-6 font-bold text-sm">02</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Preenchimento IA</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">A IA cria uma bio profissional, extrai suas competências-chave e formata suas experiências de maneira organizada.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100/80 bg-white hover:shadow-lg hover:border-gray-200/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-green-50/50 text-green-600 flex items-center justify-center mb-6 font-bold text-sm">03</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Agende de Volta</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Quando uma empresa der match com seu perfil, agende sua entrevista no calendário dela com apenas um clique.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recurso Destaque IA para Candidatos */}
      <section className="py-24 bg-[#F5F7FA] border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="premium-badge bg-green-50 text-green-700 border border-green-100">Parser Inteligente</span>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">Valorização máxima do seu currículo</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Nossa IA não se limita a copiar e colar dados. Ela reorganiza suas conquistas profissionais, infere competências técnicas correlacionadas e escreve um resumo profissional otimizado para motores de busca internos de grandes empresas.
              </p>
              <ul className="space-y-3 font-semibold text-sm text-gray-700">
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-green-600" /> Cálculo automático de score de empregabilidade</li>
                <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-600" /> Controle total dos seus dados de contato</li>
                <li className="flex items-center gap-2"><Cpu className="w-4 h-4 text-green-600" /> Atualização em tempo real ao subir novos PDFs</li>
              </ul>
            </div>
            
            <div className="p-6 bg-white border border-gray-200/60 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-600">PARSER IA COMPLETO</span>
                </div>
                <span className="text-xs font-bold text-green-600">Score 94%</span>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 text-[9px] font-bold rounded-full">Gestão Financeira</span>
                  <span className="px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 text-[9px] font-bold rounded-full">Orçamento</span>
                  <span className="px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 text-[9px] font-bold rounded-full">Excel Avançado</span>
                </div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
