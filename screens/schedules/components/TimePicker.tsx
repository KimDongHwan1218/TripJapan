// components/TimePicker.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  ampm: string;
  hour: string;
  minute: string;
  onChangeAmpm: (v: string) => void;
  onChangeHour: (v: string) => void;
  onChangeMinute: (v: string) => void;
};

export default function TimePicker({
  ampm,
  hour,
  minute,
  onChangeAmpm,
  onChangeHour,
  onChangeMinute,
}: Props) {
  return (
    <View style={styles.row}>
      {/* AM/PM */}
      <View style={styles.column}>
        <Text style={styles.label}>오전/오후</Text>
        <Picker
          selectedValue={ampm}
          style={styles.picker}
          onValueChange={onChangeAmpm}
          mode="dropdown"
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>

      {/* Hour */}
      <View style={styles.column}>
        <Text style={styles.label}>시</Text>
        <Picker
          selectedValue={hour}
          style={styles.picker}
          onValueChange={onChangeHour}
          mode="dropdown"
        >
          {["01","02","03","04","05","06","07","08","09","10","11","12"].map(
            (h) => (
              <Picker.Item key={h} label={h} value={h} />
            )
          )}
        </Picker>
      </View>

      {/* Minute */}
      <View style={styles.column}>
        <Text style={styles.label}>분</Text>
        <Picker
          selectedValue={minute}
          style={styles.picker}
          onValueChange={onChangeMinute}
          mode="dropdown"
        >
          <Picker.Item label="00" value="00" />
          <Picker.Item label="30" value="30" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  picker: {
    width: "100%",
    height: 150, // wheel style
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
});
