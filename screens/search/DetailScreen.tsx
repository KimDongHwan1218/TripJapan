import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import Header from "@/components/Header/Header";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE_URL;

type RouteParams = {
  params: {
    placeId: number;
  };
};

type PlaceDetail = {
  id: number;
  name: string;
  address: string;
  description: string;
  thumbnail_url: string;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
};

export default function DetailScreen() {
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { placeId } = route.params;

  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaceDetail();
  }, []);

  const fetchPlaceDetail = async () => {
    try {
      const res = await fetch(`${API_BASE}/places/${placeId}`);
      const data = await res.json();
      setPlace(data);
    } catch (err) {
      console.error("place detail fetch 실패", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !place) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        backwardButton="round"
        title={place.name}
        rightButtons={[{ type: "share" }]}
      />

      <ScrollView>
        <Image
          source={{ uri: place.thumbnail_url }}
          style={styles.image}
        />

        <View style={styles.section}>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.address}>{place.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소개</Text>
          <Text style={styles.description}>{place.description}</Text>
        </View>

        {/* 리뷰 영역 (다음 단계에서 CRUD 붙일 자리) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>리뷰</Text>
          <Text style={{ color: "#999", marginTop: 8 }}>
            아직 리뷰가 없습니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },

  image: {
    width: "100%",
    height: 260,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  address: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
});
