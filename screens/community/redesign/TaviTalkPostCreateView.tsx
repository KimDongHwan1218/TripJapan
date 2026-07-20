import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOARDS = [
  { key: "free", label: "자유게시판" },
  { key: "review", label: "여행후기" },
  { key: "question", label: "질문 Q&A" },
  { key: "food", label: "맛집 추천" },
  { key: "local", label: "대니 시기" },
  { key: "shopping", label: "쇼핑" },
];

type Props = {
  onGoBack?: () => void;
};

export default function TaviTalkPostCreateView({ onGoBack }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);

  const selectedLabel = BOARDS.find((b) => b.key === selectedBoard)?.label;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
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
        {/* 게시판 선택 드롭다운 */}
        <View style={styles.fieldBlock}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, !selectedBoard && styles.placeholder]}>
              {selectedLabel ?? "게시판을 선택해주세요."}
            </Text>
            <Ionicons
              name={dropdownOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.neutral500}
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {BOARDS.map((board) => (
                <TouchableOpacity
                  key={board.key}
                  style={[
                    styles.dropdownItem,
                    selectedBoard === board.key && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedBoard(board.key);
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedBoard === board.key && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {board.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 내용 입력 */}
        <View style={styles.fieldBlock}>
          <View style={styles.contentInputWrap}>
            <TextInput
              style={styles.contentInput}
              placeholder="내용을 입력해주세요."
              placeholderTextColor={colors.neutral500}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* 이미지 첨부 */}
        <View style={styles.fieldBlock}>
          <Text style={styles.imageGuide}>
            {"• 10MB 이하 이미지 파일 (JPG, PNG, GIF) 3개까지 첨부 가능"}
          </Text>
          <View style={styles.imageRow}>
            {images.map((img, idx) => (
              <TouchableOpacity key={idx} style={styles.imageSlot} activeOpacity={0.7}>
                {img ? (
                  <View style={styles.imageFilled}>
                    <TouchableOpacity
                      style={styles.imageRemoveBtn}
                      onPress={() => {
                        const next = [...images];
                        next[idx] = null;
                        setImages(next);
                      }}
                    >
                      <Ionicons name="close" size={14} color={colors.textWhite} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Ionicons name="camera-outline" size={28} color={colors.neutral300} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 등록하기 버튼 */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.submitBtn, !selectedBoard && styles.submitBtnDisabled]}
          activeOpacity={0.85}
          disabled={!selectedBoard}
        >
          <Text style={styles.submitBtnText}>등록하기</Text>
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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: spacing.md,
    gap: 16,
    paddingBottom: 24,
  },

  fieldBlock: {
    gap: 8,
  },

  // Dropdown
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
    fontWeight: "500",
  },
  placeholder: {
    color: colors.neutral500,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  dropdownItemSelected: {
    backgroundColor: colors.primarySoft,
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dropdownItemTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },

  // Content Input
  contentInputWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 180,
    backgroundColor: colors.surface,
  },
  contentInput: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    flex: 1,
    minHeight: 150,
  },

  // Image picker
  imageGuide: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  imageRow: {
    flexDirection: "row",
    gap: 10,
  },
  imageSlot: {
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
  imageFilled: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: radius.md,
    backgroundColor: colors.neutral300,
    overflow: "hidden",
  },
  imageRemoveBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
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
