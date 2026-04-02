import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOARD_LABELS: Record<string, string> = {
  free: "자유게시판",
  review: "여행후기",
  question: "질문 Q&A",
  food: "맛집 추천",
  info: "정보",
  shopping: "쇼핑",
};

type Props = {
  boardType: string;
  title: string;
  body: string;
  images: string[];
  loading: boolean;
  onChangeTitle: (text: string) => void;
  onChangeBody: (text: string) => void;
  onPickImages: () => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function PostCreateView({
  boardType,
  title,
  body,
  images,
  loading,
  onChangeTitle,
  onChangeBody,
  onPickImages,
  onSubmit,
  onCancel,
}: Props) {
  const insets = useSafeAreaInsets();
  const boardLabel = BOARD_LABELS[boardType] ?? boardType;
  const canSubmit = body.trim().length > 0 && !loading;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>글쓰기</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 게시판 (pre-selected, 변경 불가) */}
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>{boardLabel}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.neutral500} />
        </View>

        {/* 제목 입력 */}
        <View style={styles.inputField}>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력해주세요."
            placeholderTextColor={colors.neutral500}
            value={title}
            onChangeText={onChangeTitle}
          />
        </View>

        {/* 내용 입력 */}
        <View style={styles.inputField}>
          <TextInput
            style={styles.contentInput}
            placeholder="내용을 입력해주세요."
            placeholderTextColor={colors.neutral500}
            value={body}
            onChangeText={onChangeBody}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 이미지 첨부 */}
        <View style={styles.imageSection}>
          <Text style={styles.imageGuide}>
            {"• 10MB 이하 이미지 파일 (JPG, PNG, GIF) 3개까지 첨부 가능"}
          </Text>
          <View style={styles.imageRow}>
            {images.map((img, i) => (
              <View key={i} style={styles.imageThumb}>
                <Image source={{ uri: img }} style={styles.imageThumbImg} resizeMode="cover" />
              </View>
            ))}
            {images.length < 3 && (
              <TouchableOpacity style={styles.imageAddBtn} onPress={onPickImages} activeOpacity={0.7}>
                <Ionicons name="camera-outline" size={28} color={colors.neutral300} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 등록하기 버튼 */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={onSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.submitBtnText}>등록하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },

  // Dropdown (board, pre-selected)
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.surface,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  // Input Fields
  inputField: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  titleInput: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  contentInput: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    minHeight: 160,
  },

  // Images
  imageSection: { gap: 10 },
  imageGuide: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  imageRow: {
    flexDirection: "row",
    gap: 10,
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  imageThumbImg: {
    width: "100%",
    height: "100%",
  },
  imageAddBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral100,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: colors.neutral300,
  },
  submitBtnText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: "700",
  },
});
