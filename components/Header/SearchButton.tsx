// components/Header/SearchButton.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchStackParamList } from "../../navigation/SearchStackNavigator";

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
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.iconWrapper}>
        <Image source={require("../../assets/icons/search.png")} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 0,
  },
  iconWrapper: {
    marginLeft: 8,
    width: 24, // ✅ 아이콘 영역 고정
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#666",
  },
});

export default SearchButton;
