import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  PanResponder, Animated, LayoutAnimation,
  Platform, UIManager, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import type { Schedule } from "@/contexts/TripContext";
import type { RouteSegment } from "../hooks/useRouteInfo";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ITEM_HEIGHT = 72;

interface Props {
  schedules: Schedule[];
  segments?: RouteSegment[];
  onReorder: (newOrder: Schedule[]) => void;
  onDelete: (scheduleId: number) => void;
}

export default function SortableScheduleList({ schedules, segments, onReorder, onDelete }: Props) {
  const [items, setItems] = useState<Schedule[]>(schedules);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const itemsRef = useRef<Schedule[]>(schedules);
  const draggingIdRef = useRef<number | null>(null);
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

  // 드래그 중 실시간 순서 미리보기
  const displayItems = useMemo(() => {
    if (draggingId === null || hoverIndex === null) return items;
    const fromIdx = items.findIndex((i) => i.id === draggingId);
    if (fromIdx === -1 || fromIdx === hoverIndex) return items;
    const arr = [...items];
    const [el] = arr.splice(fromIdx, 1);
    arr.splice(hoverIndex, 0, el);
    return arr;
  }, [items, draggingId, hoverIndex]);

  // 드래그 중인 아이템 데이터 (ghost용)
  const draggingItem = draggingId !== null ? items.find((i) => i.id === draggingId) ?? null : null;

  const handleDelete = (item: Schedule) => {
    Alert.alert("일정을 삭제할까요?", "", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: () => onDelete(item.id) },
    ]);
  };

  const buildPanResponder = (itemId: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        containerRef.current?.measure((_x, _y, _w, _h, _px, pageY) => {
          containerPageYRef.current = pageY;
        });
        const fromIdx = itemsRef.current.findIndex((i) => i.id === itemId);
        draggingIdRef.current = itemId;
        hoverIndexRef.current = fromIdx;
        ghostY.setValue(fromIdx * ITEM_HEIGHT);
        setDraggingId(itemId);
        setHoverIndex(fromIdx);
      },

      onPanResponderMove: (evt) => {
        if (draggingIdRef.current === null) return;
        const relY = evt.nativeEvent.pageY - containerPageYRef.current;
        ghostY.setValue(relY - ITEM_HEIGHT / 2);

        const raw = Math.round(relY / ITEM_HEIGHT);
        const newHover = Math.max(0, Math.min(raw, itemsRef.current.length - 1));
        if (newHover !== hoverIndexRef.current) {
          hoverIndexRef.current = newHover;
          setHoverIndex(newHover);
        }
      },

      onPanResponderRelease: () => {
        const draggedId = draggingIdRef.current;
        const to = hoverIndexRef.current;

        if (draggedId !== null && to !== null) {
          const from = itemsRef.current.findIndex((i) => i.id === draggedId);
          if (from !== -1 && from !== to) {
            const newItems = [...itemsRef.current];
            const [removed] = newItems.splice(from, 1);
            newItems.splice(to, 0, removed);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setItems(newItems);
            itemsRef.current = newItems;
            onReorder(newItems);
          }
        }

        draggingIdRef.current = null;
        hoverIndexRef.current = null;
        setDraggingId(null);
        setHoverIndex(null);
      },

      onPanResponderTerminate: () => {
        draggingIdRef.current = null;
        hoverIndexRef.current = null;
        setDraggingId(null);
        setHoverIndex(null);
      },
    });

  return (
    <View
      ref={containerRef}
      style={{ position: "relative" }}
      onLayout={() => {
        containerRef.current?.measure((_x, _y, _w, _h, _px, pageY) => {
          containerPageYRef.current = pageY;
        });
      }}
    >
      {displayItems.map((item, idx) => {
        const isActive = item.id === draggingId;
        const segment = segments?.[idx];
        const panHandlers = buildPanResponder(item.id).panHandlers;

        return (
          <React.Fragment key={item.id}>
            <View style={[styles.item, isActive && styles.itemHidden]}>
              <View {...panHandlers} style={styles.dragHandle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="reorder-three" size={22} color={colors.neutral300} />
              </View>
              <View style={styles.numBadge}>
                <Text style={styles.numText}>{idx + 1}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.activityText} numberOfLines={1}>{item.activity}</Text>
                {item.place_name ? (
                  <Text style={styles.placeText} numberOfLines={1}>{item.place_name}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.deleteBtnText}>삭제</Text>
              </TouchableOpacity>
            </View>

            {idx < displayItems.length - 1 && segment && (
              <View style={styles.connector}>
                <View style={styles.connectorLine} />
                <Text style={styles.connectorText}>{segment.duration} · {segment.distance}</Text>
                <View style={styles.connectorLine} />
              </View>
            )}
          </React.Fragment>
        );
      })}

      {/* 드래그 중 손가락 따라다니는 ghost */}
      {draggingItem && (
        <Animated.View
          style={[styles.item, styles.ghost, { transform: [{ translateY: ghostY }] }]}
          pointerEvents="none"
        >
          <Ionicons name="reorder-three" size={22} color={colors.neutral300} />
          <View style={styles.numBadge}>
            <Text style={styles.numText}>
              {(hoverIndex ?? 0) + 1}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.activityText} numberOfLines={1}>{draggingItem.activity}</Text>
            {draggingItem.place_name ? (
              <Text style={styles.placeText} numberOfLines={1}>{draggingItem.place_name}</Text>
            ) : null}
          </View>
        </Animated.View>
      )}

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
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: 10,
  },
  // 드래그 중 원래 자리는 투명하게
  itemHidden: { opacity: 0 },
  // 손가락 따라다니는 ghost — 드래그 중임을 알리는 용도로만 카드+그림자 사용
  ghost: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: radius.md,
    borderBottomWidth: 0,
    opacity: 0.95,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    zIndex: 10,
  },
  dragHandle: { paddingVertical: 4, paddingHorizontal: 2 },
  numBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  numText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  info: { flex: 1 },
  activityText: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  placeText: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  deleteBtn: { paddingHorizontal: 4 },
  deleteBtnText: { fontSize: 12, color: colors.textTertiary, fontWeight: "500" },

  connector: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, marginBottom: 8, gap: 8,
  },
  connectorLine: { flex: 1, height: 1, backgroundColor: "#E8E8E8" },
  connectorText: { fontSize: 11, color: colors.textTertiary, fontWeight: "500" },

  empty: {
    fontSize: 13, color: colors.textTertiary,
    textAlign: "center", paddingVertical: 24, lineHeight: 20,
  },
});
