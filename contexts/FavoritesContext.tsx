import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthContext";
import { ENV } from "@/config/env";

const STORAGE_KEY = "@tabi_favorites";
const API_BASE = ENV.API_BASE_URL;

export type FavoritePlace = {
  id: number;
  name: string;
  address: string;
  thumbnail_url: string;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
};

type FavoritesContextType = {
  favorites: FavoritePlace[];
  isFavorite: (placeId: number) => boolean;
  toggleFavorite: (place: FavoritePlace) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (user && accessToken) {
        try {
          const res = await fetch(`${API_BASE}/favorites`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) {
            const data: FavoritePlace[] = await res.json();
            setFavorites(data);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return;
          }
        } catch {}
      }
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    };
    load();
  }, [user?.id]);

  const save = async (updated: FavoritePlace[]) => {
    setFavorites(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isFavorite = useCallback(
    (placeId: number) => favorites.some((f) => f.id === placeId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (place: FavoritePlace) => {
      const previous = favorites;
      const exists = favorites.some((f) => f.id === place.id);
      const updated = exists
        ? favorites.filter((f) => f.id !== place.id)
        : [place, ...favorites];
      await save(updated);

      if (user && accessToken) {
        try {
          const res = exists
            ? await fetch(`${API_BASE}/favorites/${place.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` },
              })
            : await fetch(`${API_BASE}/favorites`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ placeId: place.id }),
              });
          if (!res.ok) throw new Error(`즐겨찾기 동기화 실패: ${res.status}`);
        } catch (err) {
          console.error("즐겨찾기 서버 동기화 실패, 로컬 상태 롤백", err);
          await save(previous);
          throw err;
        }
      }
    },
    [favorites, user, accessToken]
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
