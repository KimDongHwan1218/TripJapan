import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, radius } from "@/styles";

import AirportPickerModal from "./modals/AirportPickerModal";
import DatePickerModal from "./modals/DatePickerModal";
import PassengerPickerModal from "./modals/PassengerPickerModal";
import CabinPickerModal from "./modals/CabinPickerModal";

type PickerTarget =
  | null
  | "from"
  | "to"
  | "date"
  | "passenger"
  | "cabin";

export type FlightSearchParams = {
  tripType?: "roundtrip" | "oneway";
  from?: string;
  to?: string;
  departDate?: string;
  returnDate?: string;
  adults?: number;
  cabin?: "economy" | "business";
};

type Props = {
  initialParams?: FlightSearchParams;
};

export default function FlightSearchWidget({ initialParams }: Props) {
  const navigation = useNavigation<any>();

  const [tripType, setTripType] = useState<"roundtrip" | "oneway">(
    initialParams?.tripType ?? "roundtrip"
  );
  const [from, setFrom] = useState(initialParams?.from ?? "ICN");
  const [to, setTo] = useState(initialParams?.to ?? "NRT");
  const [departDate, setDepartDate] = useState(
    initialParams?.departDate ?? "2026-03-10"
  );
  const [returnDate, setReturnDate] = useState(
    initialParams?.returnDate ?? "2026-03-15"
  );
  const [adults, setAdults] = useState(initialParams?.adults ?? 1);
  const [cabin, setCabin] = useState<"economy" | "business">(
    initialParams?.cabin ?? "economy"
  );

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  const isValid =
    from !== to &&
    !!departDate &&
    (tripType === "oneway" || !!returnDate);

  const handleSearch = () => {
    if (!isValid) return;

    navigation.navigate("FlightSearchResult", {
      tripType,
      from,
      to,
      departDate,
      returnDate: tripType === "roundtrip" ? returnDate : undefined,
      adults,
      cabin
    });
  };

  return (
    <View style={styles.card}>
      {/* 왕복 / 편도 */}
      <View style={styles.toggleRow}>
        {(["roundtrip", "oneway"] as const).map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setTripType(type)}
            style={[
              styles.toggleBtn,
              tripType === type && styles.activeToggle
            ]}
          >
            <Text style={tripType === type ? styles.activeText : styles.text}>
              {type === "roundtrip" ? "왕복" : "편도"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 출발 / 도착 */}
      <TouchableOpacity
        onPress={() => setPickerTarget("from")}
        style={styles.field}
      >
        <Text>출발지: {from}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setPickerTarget("to")}
        style={styles.field}
      >
        <Text>도착지: {to}</Text>
      </TouchableOpacity>

      {/* 날짜 */}
      <TouchableOpacity
        onPress={() => setPickerTarget("date")}
        style={styles.field}
      >
        <Text>
          출발일 {departDate}
          {tripType === "roundtrip" && ` · 귀국일 ${returnDate}`}
        </Text>
      </TouchableOpacity>

      {/* 인원 / 좌석 */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setPickerTarget("passenger")}>
          <Text>성인 {adults}명</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPickerTarget("cabin")}>
          <Text>{cabin === "economy" ? "일반석" : "비즈니스석"}</Text>
        </TouchableOpacity>
      </View>

      {/* 검색 */}
      <TouchableOpacity
        style={[styles.searchBtn, !isValid && styles.disabledBtn]}
        onPress={handleSearch}
        disabled={!isValid}
      >
        <Text style={styles.searchText}>검색하기</Text>
      </TouchableOpacity>

      {/* Modals */}
      <AirportPickerModal
        visible={pickerTarget === "from" || pickerTarget === "to"}
        onClose={() => setPickerTarget(null)}
        onSelect={(code) => {
          pickerTarget === "from" ? setFrom(code) : setTo(code);
          setPickerTarget(null);
        }}
      />

      <DatePickerModal
        visible={pickerTarget === "date"}
        tripType={tripType}
        departDate={departDate}
        returnDate={returnDate}
        onConfirm={(d, r) => {
          setDepartDate(d);
          if (r) setReturnDate(r);
          setPickerTarget(null);
        }}
        onClose={() => setPickerTarget(null)}
      />

      <PassengerPickerModal
        visible={pickerTarget === "passenger"}
        adults={adults}
        onConfirm={(count) => {
          setAdults(count);
          setPickerTarget(null);
        }}
        onClose={() => setPickerTarget(null)}
      />

      <CabinPickerModal
        visible={pickerTarget === "cabin"}
        cabin={cabin}
        onSelect={(value) => {
          setCabin(value);
          setPickerTarget(null);
        }}
        onClose={() => setPickerTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  toggleBtn: {
    flex: 1,
    padding: spacing.sm,
    alignItems: "center",
  },
  activeToggle: {
    borderBottomWidth: 2,
  },
  activeText: {
    fontWeight: "700",
  },
  text: {
    color: colors.textTertiary,
  },
  field: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  searchBtn: {
    marginTop: 14,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  searchText: {
    color: colors.textWhite,
    textAlign: "center",
    fontWeight: "700",
  },
});
