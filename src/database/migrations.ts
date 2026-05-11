import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'users',
          columns: [{ name: 'password', type: 'string' }],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'readings',
          columns: [{ name: 'favorite', type: 'boolean' }],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        addColumns({
          table: 'readings',
          columns: [
            { name: 'deck_id', type: 'string' },
            { name: 'card_count', type: 'number' },
          ],
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        addColumns({
          table: 'readings',
          columns: [{ name: 'note', type: 'string' }],
        }),
      ],
    },
  ],
});
