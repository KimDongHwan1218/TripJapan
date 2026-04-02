import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, typography, radius } from "@/styles";
import type { Schedule } from "@/contexts/TripContext";

type Props = {
  date: string;
  schedules: Schedule[];
  saving: boolean;
  editingId: number | null;
  editDraft: Partial<Schedule>;
  showAddForm: boolean;
  newActivity: string;
  newTime: string;
  newNotes: string;
  onStartEdit: (s: Schedule) => void;
  onCancelEdit: () => void;
  onConfirmEdit: () => void;
  onEditDraftChange: (field: string, value: string) => void;
  onDelete: (id: number) => void;
  onShowAddForm: () => void;
  onCancelAdd: () => void;
  onConfirmAdd: () => void;
  onNewActivityChange: (v: string) => void;
  onNewTimeChange: (v: string) => void;
  onNewNotesChange: (v: string) => void;
  onGoBack: () => void;
};

export default function TripEditView({
  date,
  schedules,
  saving,
  editingId,
  editDraft,
  showAddForm,
  newActivity,
  newTime,
  newNotes,
  onStartEdit,
  onCancelEdit,
  onConfirmEdit,
  onEditDraftChange,
  onDelete,
  onShowAddForm,
  onCancelAdd,
  onConfirmAdd,
  onNewActivityChange,
  onNewTimeChange,
  onNewNotesChange,
  onGoBack,
}: Props) {
  const dateLabel = date
    ? new Date(date).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })
    : "";

  return (
    <View style={styles.container}>
      <Header backwardButton="simple" title="일정 편집" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.dateLabel}>{dateLabel}</Text>

        {/* 일정 목록 */}
        {schedules.length === 0 && !showAddForm ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={40} color={colors.neutral300} />
            <Text style={styles.emptyText}>이 날 일정이 없습니다</Text>
          </View>
        ) : (
          schedules.map((s) => (
            <View key={s.id} style={styles.card}>
              {editingId === s.id ? (
                // 편집 인라인
                <View style={styles.editForm}>
                  <TextInput
                    style={styles.input}
                    value={editDraft.time ?? ""}
                    onChangeText={(v) => onEditDraftChange("time", v)}
                    placeholder="시간 (예: 14:00)"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TextInput
                    style={styles.input}
                    value={editDraft.activity ?? ""}
                    onChangeText={(v) => onEditDraftChange("activity", v)}
                    placeholder="활동명"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TextInput
                    style={[styles.input, { height: 70, textAlignVertical: "top" }]}
                    value={editDraft.notes ?? ""}
                    onChangeText={(v) => onEditDraftChange("notes", v)}
                    placeholder="메모 (선택)"
                    multiline
                    placeholderTextColor={colors.textTertiary}
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onCancelEdit}>
                      <Text style={styles.cancelText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveBtn} onPress={onConfirmEdit} disabled={saving}>
                      {saving ? (
                        <ActivityIndicator size="small" color={colors.textWhite} />
                      ) : (
                        <Text style={styles.saveBtnText}>저장</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // 보기 모드
                <View style={styles.cardContent}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.time}>{s.time || "--:--"}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.activity}>{s.activity}</Text>
                    {s.place_name ? (
                      <Text style={styles.place}>
                        <Ionicons name="location-outline" size={12} color={colors.textTertiary} /> {s.place_name}
                      </Text>
                    ) : null}
                    {s.notes ? <Text style={styles.notes}>{s.notes}</Text> : null}
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => onStartEdit(s)} style={styles.iconBtn}>
                      <Ionicons name="pencil-outline" size={18} color={colors.textTertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(s.id)} style={styles.iconBtn}>
                      <Ionicons name="trash-outline" size={18} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}

        {/* 새 일정 추가 폼 */}
        {showAddForm ? (
          <View style={styles.card}>
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                value={newTime}
                onChangeText={onNewTimeChange}
                placeholder="시간 (예: 14:00)"
                placeholderTextColor={colors.textTertiary}
              />
              <TextInput
                style={styles.input}
                value={newActivity}
                onChangeText={onNewActivityChange}
                placeholder="활동명 *"
                placeholderTextColor={colors.textTertiary}
              />
              <TextInput
                style={[styles.input, { height: 70, textAlignVertical: "top" }]}
                value={newNotes}
                onChangeText={onNewNotesChange}
                placeholder="메모 (선택)"
                multiline
                placeholderTextColor={colors.textTertiary}
              />
              <View style={styles.editActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onCancelAdd}>
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, !newActivity.trim() && { opacity: 0.5 }]}
                  onPress={onConfirmAdd}
                  disabled={!newActivity.trim() || saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={colors.textWhite} />
                  ) : (
                    <Text style={styles.saveBtnText}>추가</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={onShowAddForm}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addBtnText}>일정 추가</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  content: { padding: spacing.lg, gap: spacing.md },

  dateLabel: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, marginBottom: spacing.xs },

  empty: { alignItems: "center", paddingVertical: 40, gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textTertiary },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  cardContent: { flexDirection: "row", alignItems: "flex-start", padding: spacing.md, gap: spacing.md },

  timeBlock: {
    width: 52,
    alignItems: "center",
    paddingTop: 2,
  },
  time: { fontSize: 13, fontWeight: "700", color: colors.primary },

  info: { flex: 1, gap: 3 },
  activity: { fontSize: 15, fontWeight: "700", color: colors.textPrimary },
  place: { fontSize: 12, color: colors.textTertiary },
  notes: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  cardActions: { flexDirection: "row", gap: spacing.xs },
  iconBtn: { padding: spacing.xs },

  editForm: { padding: spacing.md, gap: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  editActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm, marginTop: spacing.xs },
  cancelBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.neutral100 },
  cancelText: { fontSize: 14, color: colors.textSecondary },
  saveBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.primary },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: colors.textWhite },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: radius.md,
  },
  addBtnText: { fontSize: 14, fontWeight: "600", color: colors.primary },
});
