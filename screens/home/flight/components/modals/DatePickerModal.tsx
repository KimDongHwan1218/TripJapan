import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { colors, radius } from "@/styles";

type Props = {
  visible: boolean;
  tripType: "oneway" | "roundtrip";
  departDate?: string;
  returnDate?: string;
  onConfirm: (depart: string, ret?: string) => void;
  onClose: () => void;
};

export default function DatePickerModal({
  visible,
  tripType,
  departDate,
  returnDate,
  onConfirm,
  onClose
}: Props) {
  const [selectedDepart, setSelectedDepart] = useState<string | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);
  const [mode, setMode] = useState<"depart" | "return">("depart");

  useEffect(() => {
    setSelectedDepart(departDate ?? null);
    setSelectedReturn(returnDate ?? null);
    setMode("depart");
  }, [visible]);

  const onDayPress = (day: any) => {
    if (mode === "depart") {
      setSelectedDepart(day.dateString);
      if (tripType === "roundtrip") {
        setMode("return");
        setSelectedReturn(null);
      }
    } else {
      setSelectedReturn(day.dateString);
    }
  };

  const markedDates = {
    ...(selectedDepart && {
      [selectedDepart]: { selected: true, selectedColor: "#2563EB" }
    }),
    ...(selectedReturn && {
      [selectedReturn]: { selected: true, selectedColor: "#2563EB" }
    })
  };

  const canConfirm =
    tripType === "oneway"
      ? !!selectedDepart
      : !!selectedDepart && !!selectedReturn;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {mode === "depart" ? "출발일 선택" : "귀국일 선택"}
          </Text>

          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            minDate={mode === "return" ? selectedDepart ?? undefined : undefined}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!canConfirm}
              style={[
                styles.confirmBtn,
                !canConfirm && { opacity: 0.4 }
              ]}
              onPress={() =>
                onConfirm(
                  selectedDepart!,
                  tripType === "roundtrip" ? selectedReturn! : undefined
                )
              }
            >
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: colors.surface,
    padding: 20,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "center"
  },
  cancel: {
    fontSize: 14,
    color: colors.textTertiary
  },
  confirmBtn: {
    backgroundColor: colors.info,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.lg, borderCurve: "continuous"
  },
  confirmText: {
    color: colors.textWhite,
    fontWeight: "700"
  }
});
