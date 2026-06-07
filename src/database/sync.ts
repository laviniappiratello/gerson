import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from './index'; // Ajuste o caminho para onde seu banco é exportado

export async function syncDatabase() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/sync?lastPulledAt=${lastPulledAt}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(await response.text());
      
      const { changes, timestamp } = await response.json();
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/sync`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes, lastPulledAt }),
      });
      if (!response.ok) throw new Error(await response.text());
    },
  });
}