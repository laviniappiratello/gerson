import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DeckId } from './storage';

export type FavoriteCard = {
  userId: string;
  deckId: DeckId;
  cardId: string | number;
};

const FAVORITES_KEY = '@persephone/favorite_cards';

function getFavoriteCardsKey(userId: string) {
  return `${FAVORITES_KEY}_${userId}`;
}

async function getFavoriteCards(userId: string): Promise<FavoriteCard[]> {
  try {
    const key = getFavoriteCardsKey(userId);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteCard[];
  } catch (error) {
    console.error('Erro ao buscar cartas favoritas:', error);
    return [];
  }
}

async function setFavoriteCards(userId: string, favorites: FavoriteCard[]) {
  try {
    const key = getFavoriteCardsKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(favorites));
  } catch (error) {
    console.error('Erro ao salvar cartas favoritas:', error);
  }
}

export async function toggleFavoriteCard(userId: string, deckId: DeckId, cardId: string | number): Promise<boolean> {
  const favorites = await getFavoriteCards(userId);
  const isFavorited = favorites.some((item) => item.deckId === deckId && item.cardId === cardId);

  if (isFavorited) {
    const updated = favorites.filter((item) => !(item.deckId === deckId && item.cardId === cardId));
    await setFavoriteCards(userId, updated);
    return false;
  }

  const updated = [...favorites, { userId, deckId, cardId }];
  await setFavoriteCards(userId, updated);
  return true;
}

export async function isFavoriteCard(userId: string, deckId: DeckId, cardId: string | number): Promise<boolean> {
  const favorites = await getFavoriteCards(userId);
  return favorites.some((item) => item.deckId === deckId && item.cardId === cardId);
}

export async function getFavoritedCardsByDeck(userId: string, deckId: DeckId): Promise<FavoriteCard[]> {
  const favorites = await getFavoriteCards(userId);
  return favorites.filter((item) => item.deckId === deckId);
}

export async function getAllFavoritedCards(userId: string): Promise<FavoriteCard[]> {
  return getFavoriteCards(userId);
}

export async function clearFavoriteCards(userId: string) {
  const key = getFavoriteCardsKey(userId);
  await AsyncStorage.removeItem(key);
}
