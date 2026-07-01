import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.groq = new Groq({ apiKey: apiKey || 'dummy-key' });
  }

  async parseResume(text: string): Promise<any> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey || apiKey === 'dummy-key') {
      // Retornar dados mockados para o sistema funcionar na ausência de API Key
      return {
        firstName: "Guilherme",
        lastName: "Candidato Mockado",
        headline: "Engenheiro de Software Sênior (Mock)",
        summary: "Especialista em React, Node.js e inteligência artificial. Perfil gerado de forma simulada pela falta de chave de API no .env.",
        employabilityScore: 85,
        skills: ["React", "TypeScript", "Node.js", "AI", "NestJS"],
        experiences: [
          { company: "Tech Empresa", title: "Desenvolvedor", description: "Atuação em software." }
        ]
      };
    }

    const prompt = `
      Você é um assistente de IA especialista em recrutamento.
      Extraia as informações do currículo abaixo e retorne APENAS um JSON válido.
      Não adicione introduções ou formatações Markdown fora do JSON.
      
      IMPORTANTE:
      Para o campo "summary" (resumo), não copie simplesmente o texto original. 
      Eu quero que você crie um resumo NOVO, EXTREMAMENTE COMPLETO E BEM ESCRITO (em 1 ou 2 parágrafos),
      fazendo um compilado inteligente que una as experiências profissionais da pessoa, suas formações acadêmicas e seus objetivos de carreira.

      Retorne um JSON com a seguinte estrutura:
      {
        "firstName": "Nome",
        "lastName": "Sobrenome",
        "headline": "Um título profissional curto",
        "summary": "Um resumo profissional em 2 ou 3 frases",
        "employabilityScore": 85,
        "phone": "Telefone (se houver)",
        "location": "Localização (se houver)",
        "linkedinUrl": "URL do LinkedIn (se houver)",
        "githubUrl": "URL do GitHub (se houver)",
        "skills": ["Habilidade 1", "Habilidade 2"],
        "experiences": [
          { "company": "Empresa", "title": "Cargo", "period": "Período", "description": "Descrição" }
        ],
        "education": [
          { "institution": "Instituição", "degree": "Grau", "field": "Área", "period": "Período" }
        ],
        "courses": [
          { "name": "Nome do Curso", "institution": "Instituição", "hours": "Carga horária ou período" }
        ]
      }
      
      Currículo:
      ${text}
    `;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });

      const resultText = chatCompletion.choices[0]?.message?.content || '{}';
      
      // Limpa os code blocks do Markdown se existirem
      const cleanJsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(cleanJsonStr);
    } catch (error) {
      this.logger.error('Failed to parse resume with Groq', error);
      return {};
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Como a Groq foca em geração de texto e não embeddings nativos abertos, 
    // manteremos um array de embeddings (vetores) simulado estático apenas para o DB não falhar.
    return Array(768).fill(0.1);
  }
}
