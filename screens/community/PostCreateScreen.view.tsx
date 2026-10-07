import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import Text, { TextInput } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOARDS = [
  { key: "free", label: "자유게시판" },
  { key: "review", label: "여행후기" },
  { key: "question", label: "질문 Q&A" },
  { key: "food", label: "맛집 추천" },
  { key: "info", label: "애니 성지" },
  { key: "shopping", label: "쇼핑 성지" },
];

type Props = {
  boardType: string;
  title: string;
  body: string;
  images: string[];
  loading: boolean;
  onChangeBoardType: (type: string) => void;
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
  onChangeBoardType,
  onChangeTitle,
  onChangeBody,
  onPickImages,
  onSubmit,
  onCancel,
}: Props) {
  const insets = useSafeAreaInsets();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedLabel = BOARDS.find((b) => b.key === boardType)?.label ?? boardType;
  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !loading;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
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
        <View>
          <TouchableOpacity
            style={[styles.dropdown, dropdownOpen && styles.dropdownOpen]}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>{selectedLabel}</Text>
            <Ionicons
              name={dropdownOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.neutral500}
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {BOARDS.map((board, idx) => (
                <TouchableOpacity
                  key={board.key}
                  style={[
                    styles.dropdownItem,
                    boardType === board.key && styles.dropdownItemSelected,
                    idx === BOARDS.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => {
                    onChangeBoardType(board.key);
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      boardType === board.key && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {board.label}
                  </Text>
                  {boardType === board.key && (
                    <Ionicons name="checkmark" size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 제목 입력 — Figma엔 없어서 한때 빠졌는데, 등록 로직(usePostCreate)과 목록/상세 화면이
            전부 제목을 쓰고 있어서 제목칸이 없으면 "제목과 내용을 모두 입력해주세요"로 등록 자체가 막혔음 */}
        <View style={styles.inputField}>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력해주세요."
            placeholderTextColor={colors.neutral500}
            value={title}
            onChangeText={onChangeTitle}
            maxLength={60}
            returnKeyType="next"
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
            {"• 10MB 이하 이미지 파일 (JPG, PNG, GIF) 10개까지 첨부 가능"}
          </Text>
          <View style={styles.imageRow}>
            {images.map((img, i) => (
              <View key={i} style={styles.imageThumb}>
                <Image source={{ uri: img }} style={styles.imageThumbImg} resizeMode="cover" />
              </View>
            ))}
            {images.length < 10 && (
              <TouchableOpacity style={styles.imageAddBtn} onPress={onPickImages} activeOpacity={0.7}>
                {/* Figma: camera icon 20×20 */}
                <Ionicons name="camera-outline" size={20} color={colors.neutral300} />
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
          activeOpacity={0.7}
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

  // Figma: paddingHorizontal=20 (content area x=20), paddingTop=20
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,  // Figma: 16px gap between elements
  },

  // Figma: dropdown bg=white, border 1px #ECECEC (backgroundBase), padding=15, radius=12
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md, borderCurve: "continuous",
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 50,
    backgroundColor: colors.surface,
  },
  dropdownOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: "transparent",
  },
  // Figma: placeholder Medium 14px #8E9196
  dropdownText: {
    fontSize: 14,
    color: colors.neutral500,
    fontWeight: "500",
  },
  dropdownList: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
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

  // Figma: content textarea — border 1px #ECECEC, padding 15, radius 12, height 160
  inputField: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md, borderCurve: "continuous",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
  },
  titleInput: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  // Figma: content textarea 320×160, Medium 14px #8E9196 placeholder
  contentInput: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    lineHeight: 20,
    height: 160,
  },

  // Figma: image section — guide text + 60×60 slots
  imageSection: { gap: 12 },
  imageGuide: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  imageRow: {
    flexDirection: "row",
    gap: 12,
  },
  // Figma: image slot 60×60
  imageThumb: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  imageThumbImg: {
    width: "100%",
    height: "100%",
  },
  // Figma: add photo slot 60×60, camera icon 20×20
  imageAddBtn: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral100,
  },

  // Figma: footer — button container 308×70 (20px top space + 50px pill inside)
  footer: {
    paddingHorizontal: 28,  // Figma: button x=26
    paddingTop: 20,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  // Figma: button 308×50 pill
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 50,
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
