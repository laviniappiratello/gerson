import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 5, // Aumente a versão se for alterar o banco localmente
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
        { name: 'birth_date', type: 'string' },
        { name: 'signo', type: 'string' },
        { name: 'arcano', type: 'string' },
        { name: 'biometrics_enabled', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'readings',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'question', type: 'string' },
        { name: 'cards', type: 'string' },
        { name: 'deck_id', type: 'string' },
        { name: 'card_count', type: 'number' },
        { name: 'note', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'favorite', type: 'boolean' },
      ],
    }),
  ],
});