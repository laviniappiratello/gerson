import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import Reading from '../models/Reading';
import User from '../models/User';
import { migrations } from './migrations';
import { mySchema } from './schema';

const adapter = new SQLiteAdapter({
  schema: mySchema,
  migrations,
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [User, Reading],
});
