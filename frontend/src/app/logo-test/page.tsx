"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Zap, Target } from 'lucide-react';
import Link from 'next/link';

export default function LogoTestPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#111827] flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full space-y-12 text-center">
        
        <div className="space-y-4">
          <span className="premium-badge bg-primary/10 text-primary px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider">
            Painel de Escolha de Identidade
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Qual é o novo símbolo do TalenToss?
          </h1>
          <p className="text-gray-500 font-medium max-w-lg mx-auto text-sm">
            Criei 3 opções modernas utilizando vetores SVG puros, seguindo a estética de design system do Stripe e da Linear.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Opção 1 */}
          <div className="p-8 bg-white border border-gray-100/90 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OPÇÃO 1</span>
            
            {/* SVG Logo 1 */}
            <div className="w-48 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-4 border border-gray-100">
              <svg viewBox="0 0 260 56" fill="none" className="w-full h-full">
                {/* Orbital loop connecting companies & candidates */}
                <path d="M 22 28 C 22 18 52 18 52 28 C 52 38 22 38 22 28 Z" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
                <circle cx="25" cy="28" r="8" fill="#60A5FA" />
                <circle cx="49" cy="28" r="8" fill="#3B82F6" />
                <text x="75" y="38" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="800" fill="#111827" letterSpacing="-0.03em">
                  TalenToss
                </text>
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">Conexão Orbital</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Dois nós (candidato e empresa) orbitando em um laço infinito, representando conexão contínua e similaridade.
              </p>
            </div>
          </div>

          {/* Opção 2 */}
          <div className="p-8 bg-white border border-gray-100/90 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OPÇÃO 2</span>
            
            {/* SVG Logo 2 */}
            <div className="w-48 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-4 border border-gray-100">
              <svg viewBox="0 0 260 56" fill="none" className="w-full h-full">
                {/* Monogram T shapes forming an arrow */}
                <path d="M 20 18 V 38 C 20 40 22 42 24 42 H 42" stroke="#3B82F6" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 32 14 V 30 C 32 32 34 34 36 34 H 48" stroke="#10B981" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="75" y="38" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="800" fill="#111827" letterSpacing="-0.03em">
                  TalenToss
                </text>
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">Monograma TT</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Linhas de design modernas formando as letras "T" entrelaçadas em azul e verde, simulando o pipeline e fluxo seletivo.
              </p>
            </div>
          </div>

          {/* Opção 3 */}
          <div className="p-8 bg-white border border-gray-100/90 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OPÇÃO 3</span>
            
            {/* SVG Logo 3 */}
            <div className="w-48 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-4 border border-gray-100">
              <svg viewBox="0 0 260 56" fill="none" className="w-full h-full">
                {/* Two capsule silhouettes and an AI Sparkle in green */}
                <rect x="20" y="24" width="8" height="18" rx="4" fill="#3B82F6" />
                <rect x="42" y="16" width="8" height="26" rx="4" fill="#60A5FA" />
                <path d="M 35 15 C 35 17.5 36.5 19 39 19 C 36.5 19 35 20.5 35 23 C 35 20.5 33.5 19 31 19 C 33.5 19 35 17.5 35 15 Z" fill="#10B981" />
                <text x="75" y="38" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="800" fill="#111827" letterSpacing="-0.03em">
                  TalenToss
                </text>
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">Astro & Match</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Duas formas minimalistas (candidato e empresa) unidas pelo Sparkle (faísca de IA), enfatizando inteligência artificial.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6">
          <Link href="/">
            <Button variant="outline" className="rounded-full px-6 border-gray-200 text-xs font-bold uppercase tracking-wider">
              Voltar para a Home
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
