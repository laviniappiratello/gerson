import { Q } from '@nozbe/watermelondb';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { SignoNome } from '../../constants/OraculoData';
import { database } from '../database';

export type DeckId = 'rider-waite' | 'cigano' | 'marselha';

export type UserProfile = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  birthDate: string;
  signo: SignoNome;
  arcano: string;
  biometricsEnabled: boolean;
};

export type CardDraw = {
  cardId: number;
  nome: string;
  invertida: boolean;
};

export type ReadingRecord = {
  id: string;
  userId: string;
  question: string;
  cards: CardDraw[];
  deckId?: DeckId;
  cardCount?: number;
  note?: string;
  createdAt: number;
  favorite: boolean;
};

export type ThirdPartyReadingRecord = {
  id: string;
  pessoaNome: string;
  pessoaSigno: SignoNome;
  question: string;
  cards: CardDraw[];
  deckId?: DeckId;
  cardCount?: number;
  createdAt: number;
};

const USER_KEY = '@persephone/user';
const USERS_KEY = '@persephone/users';
const SESSION_KEY = '@persephone/session';
const ONBOARDING_KEY = '@persephone/onboarding_seen';
const READINGS_KEY = '@persephone/readings';
const CURRENT_USER_ID_KEY = '@persephone/current_user_id';
const THIRD_PARTY_READINGS_KEY = '@persephone/third_party_readings';

const hasDb = Platform.OS !== 'web' && database !== null;

type RawUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  birth_date: string;
  signo: string;
  arcano: string;
  biometrics_enabled: boolean;
};

type RawReading = {
  id: string;
  user_id: string;
  question: string;
  cards: string;
  deck_id?: string;
  card_count?: number;
  note?: string;
  created_at: number;
  favorite?: boolean;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mapRawUser(raw: RawUser): UserProfile {
  return {
    id: raw.id,
    nome: raw.name,
    email: raw.email,
    senha: raw.password,
    birthDate: raw.birth_date,
    signo: raw.signo as SignoNome,
    arcano: raw.arcano,
    biometricsEnabled: raw.biometrics_enabled,
  };
}

function mapRawReading(raw: RawReading): ReadingRecord {
  return {
    id: raw.id,
    userId: raw.user_id,
    question: raw.question,
    cards: JSON.parse(raw.cards) as CardDraw[],
    deckId: raw.deck_id as DeckId | undefined,
    cardCount: raw.card_count,
    note: raw.note ?? '',
    createdAt: raw.created_at,
    favorite: raw.favorite ?? false,
  };
}

function inferDeckId(cards: CardDraw[]): DeckId {
  const firstCardId = cards[0]?.cardId ?? 0;
  if (firstCardId >= 200) return 'marselha';
  if (firstCardId >= 100) return 'cigano';
  return 'rider-waite';
}

function normalizeReading(reading: ReadingRecord): ReadingRecord {
  return {
    ...reading,
    deckId: reading.deckId ?? inferDeckId(reading.cards),
    cardCount: reading.cardCount ?? reading.cards.length,
    note: reading.note ?? '',
    favorite: reading.favorite ?? false,
  };
}

async function setCurrentUserId(userId: string) {
  await AsyncStorage.setItem(CURRENT_USER_ID_KEY, userId);
}

async function getCurrentUserId() {
  return AsyncStorage.getItem(CURRENT_USER_ID_KEY);
}

async function clearCurrentUserId() {
  await AsyncStorage.removeItem(CURRENT_USER_ID_KEY);
}

async function getStoredUsers(): Promise<UserProfile[]> {
  const rawUsers = await AsyncStorage.getItem(USERS_KEY);
  if (rawUsers) {
    return JSON.parse(rawUsers) as UserProfile[];
  }

  const rawLegacyUser = await AsyncStorage.getItem(USER_KEY);
  if (!rawLegacyUser) return [];

  const legacyUser = JSON.parse(rawLegacyUser) as UserProfile;
  const migrated = [legacyUser];
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(migrated));
  return migrated;
}

async function setStoredUsers(users: UserProfile[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getUserReadingsKey(userId: string) {
  return `${READINGS_KEY}_${userId}`;
}

export async function saveUser(user: UserProfile) {
  if (hasDb) {
    const users = database.get('users');
    const normalizedEmail = normalizeEmail(user.email);
    const found = await users.query(Q.where('email', normalizedEmail)).fetch();

    let savedId = user.id;
    await database.write(async () => {
      if (found.length > 0) {
        const current = found[0] as any;
        await current.update((record: any) => {
          record._raw.name = user.nome;
          record._raw.email = normalizedEmail;
          record._raw.password = user.senha;
          record._raw.birth_date = user.birthDate;
          record._raw.signo = user.signo;
          record._raw.arcano = user.arcano;
          record._raw.biometrics_enabled = user.biometricsEnabled;
        });
        savedId = current.id;
        return;
      }

      const created = await users.create((record: any) => {
        if (user.id) {
          record._raw.id = user.id;
        }
        record._raw.name = user.nome;
        record._raw.email = normalizedEmail;
        record._raw.password = user.senha;
        record._raw.birth_date = user.birthDate;
        record._raw.signo = user.signo;
        record._raw.arcano = user.arcano;
        record._raw.biometrics_enabled = user.biometricsEnabled;
      });
      savedId = created.id;
    });

    await setCurrentUserId(savedId);
    return;
  }

  const users = await getStoredUsers();
  const normalizedEmail = normalizeEmail(user.email);
  const foundIndex = users.findIndex((item) => normalizeEmail(item.email) === normalizedEmail);

  if (foundIndex >= 0) {
    users[foundIndex] = { ...users[foundIndex], ...user, id: users[foundIndex].id };
    await setStoredUsers(users);
    await setCurrentUserId(users[foundIndex].id);
    return;
  }

  const next = [...users, user];
  await setStoredUsers(next);
  await setCurrentUserId(user.id);
}

export async function getUser(): Promise<UserProfile | null> {
  if (hasDb) {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return null;

    const users = database.get('users');
    const byId = await users.find(currentUserId).catch(() => null as any);
    if (!byId) return null;

    return mapRawUser((byId as any)._raw as RawUser);
  }

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  const users = await getStoredUsers();
  return users.find((item) => item.id === currentUserId) ?? null;
}

export async function authenticateUser(email: string, senha: string): Promise<UserProfile | null> {
  if (hasDb) {
    const users = database.get('users');
    const normalizedEmail = normalizeEmail(email);
    const found = await users.query(Q.where('email', normalizedEmail)).fetch();
    if (found.length === 0) return null;

    const raw = (found[0] as any)._raw as RawUser;
    if (raw.password !== senha) return null;
    await setCurrentUserId(raw.id);
    return mapRawUser(raw);
  }

  const users = await getStoredUsers();
  const normalizedEmail = normalizeEmail(email);
  const found = users.find((item) => normalizeEmail(item.email) === normalizedEmail);
  if (!found) return null;
  if (found.senha !== senha) return null;

  await setCurrentUserId(found.id);
  return found;
}

export async function updateUser(partial: Partial<UserProfile>) {
  const current = await getUser();
  if (!current) return null;
  const updated = { ...current, ...partial };
  await saveUser(updated);
  return updated;
}

export async function setSessionLoggedIn(loggedIn: boolean) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(loggedIn));
}

export async function isSessionLoggedIn(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) === true : false;
}

export async function clearSession() {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(false));
  await clearCurrentUserId();
}

export async function hasUsers(): Promise<boolean> {
  if (hasDb) {
    const users = database.get('users');
    const list = await users.query().fetch();
    return list.length > 0;
  }

  const users = await getStoredUsers();
  return users.length > 0;
}

export async function setOnboardingSeen() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function hasSeenOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
}

export async function addReading(reading: ReadingRecord) {
  const normalizedReading = normalizeReading(reading);

  if (hasDb) {
    const readings = database.get('readings');
    await database.write(async () => {
      await readings.create((record: any) => {
        if (normalizedReading.id) {
          record._raw.id = normalizedReading.id;
        }
        record._raw.user_id = normalizedReading.userId;
        record._raw.question = normalizedReading.question;
        record._raw.cards = JSON.stringify(normalizedReading.cards);
        record._raw.deck_id = normalizedReading.deckId ?? null;
        record._raw.card_count = normalizedReading.cardCount ?? normalizedReading.cards.length;
        record._raw.note = normalizedReading.note ?? '';
        record._raw.created_at = normalizedReading.createdAt;
        record._raw.favorite = normalizedReading.favorite;
      });
    });
    return;
  }

  const key = getUserReadingsKey(normalizedReading.userId);
  const list = await getReadings(normalizedReading.userId);
  const next = [normalizedReading, ...list].slice(0, 40);
  await AsyncStorage.setItem(key, JSON.stringify(next));
}

export async function getReadings(userId?: string): Promise<ReadingRecord[]> {
  if (hasDb) {
    const readings = database.get('readings');
    const query = userId
      ? readings.query(Q.where('user_id', userId), Q.sortBy('created_at', Q.desc))
      : readings.query(Q.sortBy('created_at', Q.desc));
    const records = await query.fetch();
    return records.map((item: any) => mapRawReading(item._raw as RawReading));
  }

  if (userId) {
    const key = getUserReadingsKey(userId);
    const userRaw = await AsyncStorage.getItem(key);
    if (userRaw) {
      return (JSON.parse(userRaw) as ReadingRecord[]).map(normalizeReading);
    }

    const legacyRaw = await AsyncStorage.getItem(READINGS_KEY);
    const legacyAll = legacyRaw ? (JSON.parse(legacyRaw) as ReadingRecord[]) : [];
    const migrated = legacyAll.filter((reading) => reading.userId === userId).map(normalizeReading);
    if (migrated.length > 0) {
      await AsyncStorage.setItem(key, JSON.stringify(migrated.slice(0, 40)));
    }
    return migrated;
  }

  const raw = await AsyncStorage.getItem(READINGS_KEY);
  return raw ? (JSON.parse(raw) as ReadingRecord[]).map(normalizeReading) : [];
}

export async function setReadingFavorite(userId: string, readingId: string, favorite: boolean) {
  if (hasDb) {
    const readings = database.get('readings');
    const record = await readings.find(readingId).catch(() => null as any);
    if (!record) return false;

    await database.write(async () => {
      await record.update((item: any) => {
        item._raw.favorite = favorite;
      });
    });

    return true;
  }

  const key = getUserReadingsKey(userId);
  const list = await getReadings(userId);
  const next = list.map((item) => (item.id === readingId ? { ...item, favorite } : item));
  await AsyncStorage.setItem(key, JSON.stringify(next));
  return true;
}

export async function setReadingNote(userId: string, readingId: string, note: string) {
  const cleanedNote = note.trim();

  if (hasDb) {
    const readings = database.get('readings');
    const record = await readings.find(readingId).catch(() => null as any);
    if (!record) return false;

    await database.write(async () => {
      await record.update((item: any) => {
        item._raw.note = cleanedNote;
      });
    });

    return true;
  }

  const key = getUserReadingsKey(userId);
  const list = await getReadings(userId);
  const next = list.map((item) => (item.id === readingId ? { ...item, note: cleanedNote } : item));
  await AsyncStorage.setItem(key, JSON.stringify(next));
  return true;
}

export async function toggleReadingFavorite(userId: string, readingId: string) {
  const list = await getReadings(userId);
  const current = list.find((item) => item.id === readingId);
  if (!current) return false;

  return setReadingFavorite(userId, readingId, !current.favorite);
}

export function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Third Party Readings

export async function addThirdPartyReading(reading: ThirdPartyReadingRecord) {
  const list = await getThirdPartyReadings();
  const next = [reading, ...list].slice(0, 40);
  await AsyncStorage.setItem(THIRD_PARTY_READINGS_KEY, JSON.stringify(next));
}

export async function getThirdPartyReadings(): Promise<ThirdPartyReadingRecord[]> {
  const raw = await AsyncStorage.getItem(THIRD_PARTY_READINGS_KEY);
  return raw ? (JSON.parse(raw) as ThirdPartyReadingRecord[]) : [];
}
