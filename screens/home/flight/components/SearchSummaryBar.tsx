import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import SearchEditModal from "./modals/SearchEditModal";

export default function SearchSummaryBar({ params }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ padding: 12 }}>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Text>
          {params.from} → {params.to} · 성인{params.adults} · 일반석
        </Text>
      </TouchableOpacity>

      <SearchEditModal
        visible={open}
        onClose={() => setOpen(false)}
        params={params}
      />
    </View>
  );
}
