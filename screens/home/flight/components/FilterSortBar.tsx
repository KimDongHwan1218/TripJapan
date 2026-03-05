import { View, Text, TouchableOpacity } from "react-native";

export default function FilterSortBar() {
  return (
    <View style={{ flexDirection: "row", padding: 10 }}>
      <TouchableOpacity>
        <Text>필터</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginLeft: 20 }}>
        <Text>정렬</Text>
      </TouchableOpacity>
    </View>
  );
}
