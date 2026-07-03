"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { Loader2, Bot, ArrowLeft, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Tecnologia / Engenharia',
    level: 'Pleno',
    workModel: 'Remoto',
    contractType: 'CLT',
    salaryRange: 'A combinar',
    description: '',
    requirements: '',
    benefits: 'Vale Refeição, Plano de Saúde, Auxílio Home Office'
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const requirementsArray = formData.requirements.split(',').map(r => r.trim()).filter(Boolean);
      
      const compiledDescription = `
📍 Área: ${formData.department}
🏷️ Cargo/Nível: ${formData.level}
💻 Modelo: ${formData.workModel}
💼 Contrato: ${formData.contractType}
💰 Salário: ${formData.salaryRange}
🎁 Benefícios: ${formData.benefits}

---------------------------------------------
📝 DESCRIÇÃO DA VAGA
${formData.description}
`.trim();

      await api.post('/jobs', {
        title: formData.title,
        description: compiledDescription,
        requirements: requirementsArray,
        status: 'OPEN'
      });
      
      router.push('/dashboard/jobs');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWithAi = async () => {
    setIsAiGenerating(true);
    // Simulate high quality B2B AI job generation
    setTimeout(() => {
      setFormData({
        title: 'Desenvolvedor React / Node.js Pleno',
        department: 'Tecnologia / Engenharia',
        level: 'Pleno',
        workModel: 'Remoto',
        contractType: 'CLT',
        salaryRange: 'R$ 7.000,00 - R$ 9.500,00',
        description: 'Buscamos um desenvolvedor apaixonado por construir interfaces rápidas e escaláveis usando Next.js, TailwindCSS e integrando APIs REST/GraphQL escritas em Node.js com TypeScript. O candidato ideal tem experiência prática com microsserviços e gosta de ambientes ágeis.',
        requirements: 'React, Next.js, Node.js, TypeScript, REST API, TailwindCSS, Git',
        benefits: 'Vale Refeição Flexível, Seguro Saúde Premium, Auxílio Home Office Mensal, Gympass, Day Off no Aniversário'
      });
      setIsAiGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Criar Nova Vaga</h2>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
            Preencha os detalhes para publicar no Portal de Carreiras
          </p>
        </div>
      </div>

      <Card className="premium-card overflow-hidden border-0 shadow-xl shadow-gray-200/40">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-100/60 shrink-0">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Informações Estruturadas</h3>
              <p className="text-xs text-gray-500 font-medium">Estes dados otimizam o match da IA com os candidatos.</p>
            </div>
          </div>

          <Button 
            type="button" 
            onClick={generateWithAi} 
            disabled={isAiGenerating}
            className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs tracking-wider uppercase rounded-xl h-10 px-5 border-0 shadow-md shadow-primary/20 shrink-0 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isAiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            {isAiGenerating ? 'IA Gerando...' : 'Preencher com IA'}
          </Button>
        </div>

        <form onSubmit={handleCreateJob} className="p-6 md:p-8 space-y-8 bg-white">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-bold text-gray-700">Título da Vaga <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="Ex: Engenheiro Front-end Sênior" 
                required 
                className="premium-input h-12 w-full text-base font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-bold text-gray-700">Área / Departamento <span className="text-red-500">*</span></Label>
                <select 
                  id="department"
                  value={formData.department} 
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-gray-800"
                >
                  <option value="Tecnologia / Engenharia">Tecnologia / Engenharia</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Vendas e Comercial">Vendas e Comercial</option>
                  <option value="Marketing e Comunicação">Marketing e Comunicação</option>
                  <option value="Financeiro e Administrativo">Financeiro e Administrativo</option>
                  <option value="Operações / Logística">Operações / Logística</option>
                  <option value="Atendimento / Suporte">Atendimento / Suporte</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-bold text-gray-700">Cargo / Nível <span className="text-red-500">*</span></Label>
                <select 
                  id="level"
                  value={formData.level} 
                  onChange={e => setFormData({...formData, level: e.target.value})}
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-gray-800"
                >
                  <option value="Estágio">Estágio</option>
                  <option value="Júnior">Júnior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Sênior">Sênior</option>
                  <option value="Especialista">Especialista</option>
                  <option value="Liderança / Coordenação">Liderança / Coordenação</option>
                  <option value="Diretoria / Gerência">Diretoria / Gerência</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workModel" className="text-sm font-bold text-gray-700">Modelo de Trabalho <span className="text-red-500">*</span></Label>
                <select 
                  id="workModel"
                  value={formData.workModel} 
                  onChange={e => setFormData({...formData, workModel: e.target.value})}
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-gray-800"
                >
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractType" className="text-sm font-bold text-gray-700">Tipo de Contrato <span className="text-red-500">*</span></Label>
                <select 
                  id="contractType"
                  value={formData.contractType} 
                  onChange={e => setFormData({...formData, contractType: e.target.value})}
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-gray-800"
                >
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Temporário">Temporário</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryRange" className="text-sm font-bold text-gray-700">Faixa Salarial / Remuneração</Label>
                <Input 
                  id="salaryRange" 
                  value={formData.salaryRange} 
                  onChange={e => setFormData({...formData, salaryRange: e.target.value})} 
                  placeholder="Ex: R$ 5.000,00 - R$ 7.000,00 (ou 'A combinar')" 
                  required 
                  className="premium-input h-12 w-full font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-bold text-gray-700">Principais Tecnologias / Skills</Label>
                <Input 
                  id="requirements" 
                  value={formData.requirements} 
                  onChange={e => setFormData({...formData, requirements: e.target.value})} 
                  placeholder="Ex: React, Node.js, Vendas, Inglês Fluente" 
                  required 
                  className="premium-input h-12 w-full font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits" className="text-sm font-bold text-gray-700">Benefícios da Vaga</Label>
              <Input 
                id="benefits" 
                value={formData.benefits} 
                onChange={e => setFormData({...formData, benefits: e.target.value})} 
                placeholder="Ex: Vale Refeição, Seguro de Vida, Plano de Saúde" 
                required 
                className="premium-input h-12 w-full font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-bold text-gray-700">Descrição Detalhada (Responsabilidades e Cultura)</Label>
              <textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="flex min-h-[200px] w-full rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400 font-medium resize-y"
                placeholder="Descreva as responsabilidades, atribuições, o que a pessoa fará no dia a dia e um pouco sobre a cultura da empresa..." 
                required 
              />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-end gap-4">
            <Link href="/dashboard/jobs">
              <Button type="button" variant="ghost" className="h-12 px-6 font-bold text-gray-500 rounded-xl">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="bg-[#111827] text-white hover:bg-[#111827]/90 h-12 px-10 rounded-xl font-bold shadow-lg shadow-gray-900/10 border-0 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar Vaga no Portal'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
