"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    tradeName: '',
    description: '',
    logoUrl: ''
  });

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const res = await api.get('/companies/my-company');
      if (res.data) {
        setCompanyId(res.data.id);
        setFormData({
          name: res.data.name || '',
          tradeName: res.data.tradeName || '',
          description: res.data.description || '',
          logoUrl: res.data.logoUrl || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/companies/${companyId}`, formData);
      alert('Configurações atualizadas com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Carregando perfil...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Canal da Empresa</h2>
          <p className="text-muted-foreground mt-1">Gerencie as informações públicas da sua empresa para os candidatos.</p>
        </div>
        <Link href="/vagas" target="_blank" className="shrink-0 w-full md:w-auto">
          <Button variant="outline" className="w-full">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visualizar Portal Público
          </Button>
        </Link>
      </div>

      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle>Perfil Público</CardTitle>
          <CardDescription>
            Essas informações representam a sua marca empregadora.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Razão Social</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  disabled
                  className="bg-gray-50 text-gray-500"
                  title="A Razão Social não pode ser alterada após o cadastro."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradeName">Nome Fantasia</Label>
                <Input 
                  id="tradeName" 
                  value={formData.tradeName}
                  disabled
                  className="bg-gray-50 text-gray-500"
                  title="O Nome Fantasia não pode ser alterado após o cadastro."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Sobre a Empresa (Descrição)</Label>
              <textarea 
                id="description" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Conte sobre a missão, visão e cultura da sua empresa..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL da Logo (Opcional)</Label>
              <div className="flex flex-col md:flex-row gap-3">
                <Input 
                  id="logoUrl" 
                  type="url"
                  value={formData.logoUrl}
                  onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                  placeholder="https://sua-empresa.com/logo.png"
                  className="flex-1"
                />
                {formData.logoUrl && (
                  <div className="w-10 h-10 border rounded-md overflow-hidden shrink-0 hidden md:flex items-center justify-center bg-gray-50">
                    <img src={formData.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 bg-gray-50/50 rounded-b-xl">
            <Button type="submit" disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
