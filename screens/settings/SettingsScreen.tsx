import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import Header from "@/components/Header/Header";
import { layout, spacing, typography, colors } from "@/styles";

import ProfileSummaryCard from "./components/ProfileSummaryCard";
import SettingsSection from "./components/SettingsSection";
import AppInfoSection from "./components/AppInfoSection";

export default function SettingsScreen() {

  return (
    <View style={styles.container}>
      <Header title="설정" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileSummaryCard />
        <SettingsSection />
        <AppInfoSection />
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  content: {
    ...layout.content,
  },
  tabContainer: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderBottomColor: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.textPrimary,
  },
});