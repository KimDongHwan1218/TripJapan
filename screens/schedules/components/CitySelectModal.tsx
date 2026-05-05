import React from "react";
import { Modal, View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { CITY_META, TripCity } from "@/constants/cities";
import { colors, spacing, radius } from "@/styles";

interface CitySelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: TripCity) => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2열 grid 기준

export default function CitySelectModal({
  visible,
  onClose,
  onSelect,
}: CitySelectModalProps) {
  const cities = Object.values(CITY_META);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.title}>여행지 선택</Text>
            <View style={{ width: 40 }} /> 
          </View>

          {/* City Grid */}
          <FlatList
            data={cities}
            keyExtractor={(item) => item.key}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => onSelect(item.key)}
              >
                <Image source={item.image} style={styles.image} />

                {/* bottom overlay */}
                <View style={styles.overlayLabel}>
                  <Text style={styles.cityKo}>{item.label.ko}</Text>
                  <Text style={styles.cityEn}>{item.label.en}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  container: {
    maxHeight: "85%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.lg,
  },

  header: {
    height: 52,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  close: {
    fontSize: 14,
    color: colors.primary,
  },

  list: {
    padding: spacing.lg,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
    marginHorizontal: spacing.sm,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlayLabel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  cityKo: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: "700",
  },

  cityEn: {
    color: colors.neutral200,
    fontSize: 11,
    marginTop: 2,
  },
});
