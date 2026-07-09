import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "../../navigation/SearchStackNavigator";
import { colors, spacing, radius } from "@/styles";
import IconButton from "@/components/ui/IconButton";

type SearchNavigationProp = NativeStackNavigationProp<SearchStackParamList, "SearchHomeScreen">;

interface Props {
  domain?: string;
}

const SearchButton: React.FC<Props> = ({ domain }) => {
  const navigation = useNavigation<SearchNavigationProp>();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    navigation.navigate("SearchHomeScreen", { query });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={`${domain || "전체"} 검색`}
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <IconButton name="search-outline" size={18} color={colors.textTertiary} onPress={handleSearch} style={styles.iconWrapper} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundSubtle,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
    width: 60,
  },
  iconWrapper: {
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchButton;
