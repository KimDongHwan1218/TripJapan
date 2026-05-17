import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Header from "@/components/Header/Header";
import { layout, colors, spacing } from "@/styles";
import { PlaceDetail } from "./hooks/usePlaceDetail";

type Props = {
  place: PlaceDetail | null;
  loading: boolean;
};

export default function DetailView({ place, loading }: Props) {
  if (loading || !place) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header backwardButton="round" title={place.name} rightButtons={[{ type: "share" }]} />

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: place.thumbnail_url }} style={styles.image} />

        <View style={styles.section}>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.address}>{place.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소개</Text>
          <Text style={styles.description}>{place.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>리뷰</Text>
          <Text style={{ color: colors.textTertiary, marginTop: 8 }}>아직 리뷰가 없습니다.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  content: { ...layout.content },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: "100%", height: 260 },
  section: { paddingHorizontal: spacing.md, paddingVertical: 14 },
  name: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  address: { marginTop: 6, fontSize: 14, color: colors.textSecondary },
  sectionTitle: { fontSize: 17, fontWeight: "600", marginBottom: 6, color: colors.textPrimary },
  description: { fontSize: 15, lineHeight: 22, color: colors.textSecondary },
});
