// src/tests/api-test.ts

async function testAPI() {
    const baseUrl = 'http://localhost:3000/api/scripts';

    try {
        console.log('🚀 Iniciando testes da API...\n');

        // Teste 1: Criar um novo script
        console.log('Teste 1: Criando novo script...');
        const createResponse = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Script de Teste',
                content: 'Olá, {Nome do Contato}! Este é um script de teste.',
                funnelStage: 'topo',
                tags: ['teste', 'primeiro contato']
            })
        });
        const newScript = await createResponse.json();
        console.log('✅ Script criado:', newScript);

        // Teste 2: Buscar todos os scripts
        console.log('\nTeste 2: Buscando todos os scripts...');
        const getAllResponse = await fetch(baseUrl);
        const allScripts = await getAllResponse.json();
        console.log('✅ Scripts encontrados:', allScripts.length);

        // Teste 3: Buscar script por ID
        console.log('\nTeste 3: Buscando script específico...');
        const getOneResponse = await fetch(`${baseUrl}/${newScript.id}`);
        const foundScript = await getOneResponse.json();
        console.log('✅ Script encontrado:', foundScript.title);

        // Teste 4: Atualizar script
        console.log('\nTeste 4: Atualizando script...');
        const updateResponse = await fetch(`${baseUrl}/${newScript.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Script de Teste Atualizado'
            })
        });
        const updatedScript = await updateResponse.json();
        console.log('✅ Script atualizado:', updatedScript.title);

        // Teste 5: Buscar por etapa do funil
        console.log('\nTeste 5: Buscando scripts por etapa do funil...');
        const getByStageResponse = await fetch(`${baseUrl}?stage=topo`);
        const stageScripts = await getByStageResponse.json();
        console.log('✅ Scripts do topo do funil:', stageScripts.length);

        // Teste 6: Deletar script
        console.log('\nTeste 6: Deletando script...');
        const deleteResponse = await fetch(`${baseUrl}/${newScript.id}`, {
            method: 'DELETE'
        });
        const deleteResult = await deleteResponse.json();
        console.log('✅ Resultado da deleção:', deleteResult);

        console.log('\n✨ Todos os testes concluídos com sucesso!');
    } catch (error) {
        console.error('\n❌ Erro durante os testes:', error);
    }
}

// Executar testes
testAPI();