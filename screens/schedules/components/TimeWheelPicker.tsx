import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;

type Props = {
  value: string; // "HH:MM"
  onChange: (v: string) => void;
};

export default function TimeWheelPicker({ value, onChange }: Props) {
  const hourListRef = useRef<FlatList>(null);
  const minuteListRef = useRef<FlatList>(null);

  const [hour, minute] = value.split(":");

  const hours = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, "0")
      ),
    []
  );

  const minutes = useMemo(
    () => ["00", "10", "20", "30", "40", "50"],
    []
  );

  useEffect(() => {
    const hIndex = hours.indexOf(hour);
    const mIndex = minutes.indexOf(minute);

    if (hIndex >= 0) {
      hourListRef.current?.scrollToOffset({
        offset: hIndex * ITEM_HEIGHT,
        animated: false,
      });
    }

    if (mIndex >= 0) {
      minuteListRef.current?.scrollToOffset({
        offset: mIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [hour, minute]);

  const onHourScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.y / ITEM_HEIGHT
    );
    onChange(`${hours[index]}:${minute}`);
  };

  const onMinuteScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.y / ITEM_HEIGHT
    );
    onChange(`${hour}:${minutes[index]}`);
  };

  const renderItem =
    (selected: string) =>
    ({ item }: { item: string }) =>
      (
        <View style={styles.item}>
          <Text
            style={[
              styles.text,
              item === selected && styles.activeText,
            ]}
          >
            {item}
          </Text>
        </View>
      );

  return (
    <View style={styles.container}>
      {/* 시 */}
      <View style={styles.column}>
        <FlatList
          ref={hourListRef}
          data={hours}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={onHourScrollEnd}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={renderItem(hour)}
        />
      </View>

      {/* 분 */}
      <View style={styles.column}>
        <FlatList
          ref={minuteListRef}
          data={minutes}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={onMinuteScrollEnd}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={renderItem(minute)}
        />
      </View>

      {/* 중앙 포커스 라인 */}
      <View style={styles.centerHighlight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
    height: ITEM_HEIGHT * VISIBLE_COUNT,
  },
  column: {
    width: 80,
    alignItems: "center",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#aaa",
  },
  activeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  unit: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  centerHighlight: {
    position: "absolute",
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    pointerEvents: "none",
  },
});
