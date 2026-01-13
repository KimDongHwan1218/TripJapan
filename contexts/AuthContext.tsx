import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "@/config/env";

type User = {
  id: string;
  profileId: string;
  email?: string;
  name?: string;
  nickname?: string;
  profile_image?: string;
};

interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Pick<User, "nickname" | "profile_image">) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = ENV.API_BASE_URL;

  // 앱 시작 시 자동 로그인
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        const savedAccess = await AsyncStorage.getItem("accessToken");

        if (savedUser && savedAccess) {
          setUser(JSON.parse(savedUser));
          setAccessToken(savedAccess);
        }
      } catch (e) {
        console.error("Auth load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  // 로그인
  const login = async (data: AuthData) => {
    setUser(data.user);
    setAccessToken(data.accessToken);

    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    await AsyncStorage.setItem("accessToken", data.accessToken);
    await AsyncStorage.setItem("refreshToken", data.refreshToken);
  };

  // 로그아웃
  const logout = async () => {
    setUser(null);
    setAccessToken(null);

    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  };

  // 프로필 업데이트
  const updateProfile = async (
    payload: Pick<User, "nickname" | "profile_image">
  ) => {
    if (!user || !accessToken) return;

    const res = await fetch(
      `${API_BASE}/profiles/${user.profileId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) throw new Error("프로필 업데이트 실패");

    const { profile } = await res.json();

    setUser((prev) => {
      if (!prev) return prev;

      const next = {
        ...prev,
        nickname: profile.nickname,
        profile_image: profile.profile_image,
      };

      AsyncStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
