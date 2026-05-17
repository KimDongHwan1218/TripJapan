import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import type { Schedule } from "@/contexts/TripContext";
import type { RouteSegment } from "../hooks/useRouteInfo";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ITEM_HEIGHT = 72;

interface Props {
  schedules: Schedule[];
  segments?: RouteSegment[];
  onReorder: (newOrder: Schedule[]) => void;
  onDelete: (scheduleId: number) => void;
}

export default function SortableScheduleList({
  schedules,
  segments,
  onReorder,
  onDelete,
}: Props) {
  const [items, setItems] = useState<Schedule[]>(schedules);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // refs used inside PanResponder callbacks — avoids stale closures
  const itemsRef = useRef<Schedule[]>(schedules);
  const activeIndexRef = useRef<number | null>(null);
  const hoverIndexRef = useRef<number | null>(null);
  const containerPageYRef = useRef(0);
  const ghostY = useRef(new Animated.Value(0)).current;
  const containerRef = useRef<View>(null);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems(schedules);
    itemsRef.current = schedules;
  }, [schedules]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const handleDelete = (item: Schedule) => {
    Alert.alert("일정을 삭제할까요?", "", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => onDelete(item.id),
      },
    ]);
  };

  // 각 아이템의 드래그 핸들에 붙이는 PanResponder 팩토리
  // index는 closure로 캡처되지만, 실제 연산은 ref를 통해 수행
  const buildPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // 컨테이너의 화면 상 Y 좌표를 측정
        containerRef.current?.measure((_x, _y, _w, _h, _px, pageY) => {
          containerPageYRef.current = pageY;
        });
        activeIndexRef.current = index;
        hoverIndexRef.current = index;
        ghostY.setValue(index * ITEM_HEIGHT);
        setActiveIndex(index);
      },

      onPanResponderMove: (evt) => {
        if (activeIndexRef.current === null) return;
        const pageY = evt.nativeEvent.pageY;
        const relY = pageY - containerPageYRef.current;
        ghostY.setValue(relY - ITEM_HEIGHT / 2);

        const raw = Math.round(relY / ITEM_HEIGHT);
        const newHover = Math.max(0, Math.min(raw, itemsRef.current.length - 1));
        hoverIndexRef.current = newHover;
      },

      onPanResponderRelease: () => {
        const from = activeIndexRef.current;
        const to = hoverIndexRef.current;

        if (from !== null && to !== null && from !== to) {
          const newItems = [...itemsRef.current];
          const [removed] = newItems.splice(from, 1);
          newItems.splice(to, 0, removed);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setItems(newItems);
          itemsRef.current = newItems;
          onReorder(newItems);
        }

        activeIndexRef.current = null;
        hoverIndexRef.current = null;
        setActiveIndex(null);
      },

      onPanResponderTerminate: () => {
        activeIndexRef.current = null;
        hoverIndexRef.current = null;
        setActiveIndex(null);
      },
    });

  return (
    <View
      ref={containerRef}
      onLayout={() => {
        containerRef.current?.measure((_x, _y, _w, _h, _px, pageY) => {
          containerPageYRef.current = pageY;
        });
      }}
    >
      {items.map((item, idx) => {
        const segment = segments?.[idx]; // 이 아이템 다음 구간
        const isDragging = activeIndex === idx;
        const panHandlers = buildPanResponder(idx).panHandlers;

        return (
          <React.Fragment key={item.id}>
          <Animated.View
            style={[
              styles.item,
              isDragging && styles.itemDragging,
              isDragging && { transform: [{ translateY: ghostY }] },
            ]}
          >
            {/* 드래그 핸들 */}
            <View {...panHandlers} style={styles.dragHandle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="reorder-three" size={22} color={colors.neutral300} />
            </View>

            {/* 번호 */}
            <View style={styles.numBadge}>
              <Text style={styles.numText}>{idx + 1}</Text>
            </View>

            {/* 정보 */}
            <View style={styles.info}>
              <Text style={styles.activityText} numberOfLines={1}>
                {item.activity}
              </Text>
              {item.place_name ? (
                <Text style={styles.placeText} numberOfLines={1}>
                  {item.place_name}
                </Text>
              ) : null}
            </View>

            {/* 삭제 */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteBtnText}>일정 삭제</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 다음 일정까지의 이동 정보 */}
          {idx < items.length - 1 && segment && (
            <View style={styles.connector}>
              <View style={styles.connectorLine} />
              <Text style={styles.connectorText}>
                {segment.duration} · {segment.distance}
              </Text>
              <View style={styles.connectorLine} />
            </View>
          )}
        </React.Fragment>
        );
      })}

      {items.length === 0 && (
        <Text style={styles.empty}>일정이 없습니다. 지도에서 장소를 추가해보세요.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: 8,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  itemDragging: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  dragHandle: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  numBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  info: { flex: 1 },
  activityText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  placeText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  deleteBtn: {
    paddingHorizontal: 4,
  },
  deleteBtnText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  connector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  connectorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  connectorText: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  empty: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: "center",
    paddingVertical: 24,
    lineHeight: 20,
  },
});
