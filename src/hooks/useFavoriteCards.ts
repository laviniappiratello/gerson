import { useEffect, useState } from 'react';
import { getAllFavoritedCards, toggleFavoriteCard, type FavoriteCard } from '../services/favoriteCards';
import type { DeckId } from '../services/storage';

export const useFavoriteCards = (userId: string | null) => {
  const [favorites, setFavorites] = useState<FavoriteCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      return;
    }

    const loadFavorites = async () => {
      setLoading(true);
      const fav = await getAllFavoritedCards(userId);
      setFavorites(fav);
      setLoading(false);
    };

    void loadFavorites();
  }, [userId]);

  const handleToggleFavorite = async (deckId: DeckId, cardId: string | number) => {
    if (!userId) return;

    const newStatus = await toggleFavoriteCard(userId, deckId, cardId);
    
    // Atualizar o estado local
    if (newStatus) {
      setFavorites((prev) => [...prev, { userId, deckId, cardId }]);
    } else {
      setFavorites((prev) => prev.filter((item) => !(item.deckId === deckId && item.cardId === cardId)));
    }

    return newStatus;
  };

  const isFavorited = (deckId: DeckId, cardId: string | number): boolean => {
    return favorites.some((item) => item.deckId === deckId && item.cardId === cardId);
  };

  return {
    favorites,
    loading,
    handleToggleFavorite,
    isFavorited,
  };
};
