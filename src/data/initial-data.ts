// src/data/initial-data.ts

import { FunnelSection, Category } from '../models/types';

export const funnelSections: FunnelSection[] = [
    {
        id: 'topo',
        title: 'Topo de Funil: Conscientização e Descoberta',
        description: 'Scripts focados nos passos iniciais do contato com o cliente',
        categories: [
            {
                id: 'primeiro-contato',
                title: 'Script para estabelecer um primeiro contato',
                icon: 'fas fa-handshake',
                funnelStage: 'topo',
                description: 'Abordagem inicial para novos leads',
                briefing: `
                    <p>Estabelecer um primeiro contato é crucial no ramo da odontologia, especialmente ao lidar com 
                    novos pacientes. É a primeira oportunidade para criar uma impressão positiva e estabelecer uma 
                    conexão significativa.</p>
                    
                    <p>Independentemente do canal utilizado - seja através de telefonemas, e-mails, 
                    redes sociais ou pessoalmente - algumas estratégias podem ser empregadas para aumentar as 
                    chances de sucesso nesse processo.</p>

                    <h6 class="mt-3">Dicas importantes:</h6>
                    <ul>
                        <li>Realize uma pesquisa detalhada sobre o novo paciente</li>
                        <li>Seja claro e transparente sobre suas intenções</li>
                        <li>Ouça atentamente as preocupações do paciente</li>
                        <li>Demonstre profissionalismo e empatia</li>
                    </ul>
                `
            },
            {
                id: 'identificacao-necessidades',
                title: 'Script para identificação das necessidades do cliente',
                icon: 'fas fa-search',
                funnelStage: 'topo',
                description: 'Entender as principais demandas do cliente',
                briefing: `
                    <p>A identificação precisa das necessidades do cliente é fundamental para oferecer 
                    um atendimento personalizado e eficaz. Este processo ajuda a criar um plano de 
                    tratamento adequado e estabelecer expectativas claras.</p>

                    <h6 class="mt-3">Pontos-chave:</h6>
                    <ul>
                        <li>Faça perguntas abertas e específicas</li>
                        <li>Registre todas as informações relevantes</li>
                        <li>Confirme seu entendimento com o cliente</li>
                        <li>Identifique prioridades e urgências</li>
                    </ul>
                `
            }
        ]
    },
    {
        id: 'meio',
        title: 'Meio de Funil: Análise e Intenção',
        description: 'Scripts para qualificação e negociação',
        categories: [
            {
                id: 'negociacao-preco',
                title: 'Script de negociação de preço',
                icon: 'fas fa-dollar-sign',
                funnelStage: 'meio',
                description: 'Lidar com objeções sobre valores',
                briefing: `
                    <p>A negociação de preços é uma etapa delicada que requer habilidade para 
                    demonstrar o valor do serviço e manter a rentabilidade do negócio.</p>

                    <h6 class="mt-3">Aspectos importantes:</h6>
                    <ul>
                        <li>Enfatize o valor e qualidade do serviço</li>
                        <li>Apresente diferentes opções de pagamento</li>
                        <li>Mantenha a transparência nos valores</li>
                        <li>Destaque os diferenciais do serviço</li>
                    </ul>
                `
            }
        ]
    }
    // Adicione mais seções conforme necessário
];

export function getCategoryById(categoryId: string): Category | undefined {
    for (const section of funnelSections) {
        const category = section.categories.find(cat => cat.id === categoryId);
        if (category) return category;
    }
    return undefined;
}

export function getFunnelSectionById(sectionId: string): FunnelSection | undefined {
    return funnelSections.find(section => section.id === sectionId);
}