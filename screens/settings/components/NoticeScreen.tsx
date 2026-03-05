import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";
import Header from "@/components/Header/Header";
import { layout, typography, spacing, colors } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";

type NavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  "NoticeScreen"
>;

type Notice = {
  id: string;
  title: string;
  createdAt: string;
};

export default function NoticeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    // GET /notices
    // setNotices(response.data)
  }, []);

  return (
    <View style={layout.screen}>
      <Header title="공지사항" backwardButton="simple" />

      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("NoticeDetailScreen", {
                noticeId: item.id,
              })
            }
          >
            <Text style={typography.body}>{item.title}</Text>
            <Text style={typography.caption}>{item.createdAt}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});