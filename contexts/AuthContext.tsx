import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "@/config/env";



type User = {
  id: string;
  email?: string;
  phone?: string;
  bio?: string;
  name?: string;
  nickname?: string;
  profile_image?: string;
};

interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

type UpdateProfilePayload = {
  nickname?: string;
  bio?: string;
  profile_image?: string;
  phone?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
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

  console.log("user:", user);

  // 프로필 업데이트
  const updateProfile = async (payload: UpdateProfilePayload) => {
    if (!user || !accessToken) return;

    // 1️⃣ users 업데이트
    const userPayload: any = {};
    if (payload.phone !== undefined) userPayload.phone = payload.phone;
    if (payload.email !== undefined) userPayload.email = payload.email;

    console.log(userPayload);

    if (Object.keys(userPayload).length > 0) {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userPayload),
      });

      console.log(res);

      if (!res.ok) throw new Error("유저 정보 업데이트 실패");
    }

    // 2️⃣ profiles 업데이트 (userId 기준)
    const profilePayload: any = {};
    if (payload.nickname !== undefined) profilePayload.nickname = payload.nickname;
    if (payload.bio !== undefined) profilePayload.bio = payload.bio;
    if (payload.profile_image !== undefined)
      profilePayload.profile_image = payload.profile_image;

    if (Object.keys(profilePayload).length > 0) {
      const res = await fetch(
        `${API_BASE}/profiles/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(profilePayload),
        }
      );

      if (!res.ok) throw new Error("프로필 업데이트 실패");
    }

    // 3️⃣ 로컬 상태 병합 (ID 오염 없음)
    const nextUser: User = {
      ...user,
      ...userPayload,
      ...profilePayload,
    };

    setUser(nextUser);
    await AsyncStorage.setItem("user", JSON.stringify(nextUser));
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
