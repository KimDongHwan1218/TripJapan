import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type User = {
  id: string;
  email?: string;
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://tavi-server.onrender.com";

  // 앱 시작 시 자동 로그인
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        const savedAccess = await AsyncStorage.getItem("accessToken");
        const savedRefresh = await AsyncStorage.getItem("refreshToken");

        if (savedUser && savedAccess && savedRefresh) {
          setUser(JSON.parse(savedUser));
          setAccessToken(savedAccess);

          // accessToken 유효성 검사
          const res = await fetch(`${API_URL}/auth/check`, {
            headers: { Authorization: `Bearer ${savedAccess}` },
          });

          // accessToken 만료 → refreshToken으로 재발급
          if (res.status === 401) {
            const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: savedRefresh }),
            });

            const refreshData = await refreshRes.json();

            if (refreshData.success) {
              await AsyncStorage.setItem("accessToken", refreshData.accessToken);
              setAccessToken(refreshData.accessToken);
            } else {
              await logout();
            }
          }
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

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
