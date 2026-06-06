import { synchronize } from '@nozbe/watermelondb/sync';
import axios from 'axios';
import { database } from '../database'; // Garante que aponta para o teu arquivo de inicialização do banco

// Cria a instância do Axios apontando para a API no Render
const api = axios.create({
  baseURL: 'https://persefone-backend.onrender.com', // Substitua pela URL real gerada no Render
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function sincronizarBancoDeDados() {
  try {
    console.log('🔮 Iniciando sincronização mística com o Render...');

    await synchronize({
      database,
      // 1. Puxar alterações da Nuvem (Render) para o Celular
      pullChanges: async ({ lastPulledAt, schemaVersion }) => {
        const response = await api.get('/sync', {
          params: {
            lastPulledAt: lastPulledAt || 0,
            schemaVersion,
          },
        });

        const { changes, timestamp } = response.data;
        // O Render precisa devolver um objeto com { changes: { users: { created: [], updated: [], deleted: [] }, readings: ... }, timestamp: number }
        return { changes, timestamp };
      },

      // 2. Empurrar alterações do Celular para a Nuvem (Render)
      pushChanges: async ({ changes, lastPulledAt }) => {
        // Envia todas as criações e atualizações que o usuário fez em modo offline
        await api.post('/sync', {
          changes,
          lastPulledAt,
        });
      },
    });

    console.log('✨ Sincronização concluída com sucesso!');
  } catch (error) {
    console.error('❌ Falha na sincronização com o Render:', error);
    // Não quebra o app, o usuário continua rodando em Modo Offline perfeitamente (RF27)
  }
}