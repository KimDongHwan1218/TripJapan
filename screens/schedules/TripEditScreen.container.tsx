import { useState } from "react";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScheduleStackParamList } from "@/navigation/ScheduleStackNavigator";
import { useTripEdit } from "./hooks/useTripEdit";
import TripEditView from "./TripEditScreen.view";
import type { Schedule } from "@/contexts/TripContext";

type RouteProps = RouteProp<ScheduleStackParamList, "TripEditScreen">;
type NavProp = NativeStackNavigationProp<ScheduleStackParamList>;

export default function TripEditScreenContainer() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { tripDayId, date } = route.params;

  const { daySchedules, saving, handleAdd, handleUpdate, handleDelete } = useTripEdit(tripDayId);

  // 인라인 편집 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Schedule>>({});

  // 새 일정 추가 폼
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newNotes, setNewNotes] = useState("");

  function startEdit(schedule: Schedule) {
    setEditingId(schedule.id);
    setEditDraft({ activity: schedule.activity, time: schedule.time, notes: schedule.notes ?? "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({});
  }

  async function confirmEdit() {
    if (!editingId) return;
    await handleUpdate(editingId, editDraft);
    cancelEdit();
  }

  async function confirmAdd() {
    if (!newActivity.trim()) return;
    await handleAdd({ activity: newActivity.trim(), time: newTime, notes: newNotes });
    setNewActivity("");
    setNewTime("");
    setNewNotes("");
    setShowAddForm(false);
  }

  return (
    <TripEditView
      date={date}
      schedules={daySchedules}
      saving={saving}
      editingId={editingId}
      editDraft={editDraft}
      showAddForm={showAddForm}
      newActivity={newActivity}
      newTime={newTime}
      newNotes={newNotes}
      onStartEdit={startEdit}
      onCancelEdit={cancelEdit}
      onConfirmEdit={confirmEdit}
      onEditDraftChange={(field, value) => setEditDraft((d) => ({ ...d, [field]: value }))}
      onDelete={handleDelete}
      onShowAddForm={() => setShowAddForm(true)}
      onCancelAdd={() => setShowAddForm(false)}
      onConfirmAdd={confirmAdd}
      onNewActivityChange={setNewActivity}
      onNewTimeChange={setNewTime}
      onNewNotesChange={setNewNotes}
      onGoBack={() => navigation.goBack()}
    />
  );
}
