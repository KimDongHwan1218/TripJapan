import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { useReviewWrite } from "./hooks/useReviewWrite";
import Header from "@/components/Header/Header";
import { layout, colors, spacing, typography, radius } from "@/styles";

type RouteProps = RouteProp<HomeStackParamList, "ReviewWrite">;

export default function ReviewWriteScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { placeId, placeName } = route.params;

  const {
    rating, setRating,
    title, setTitle,
    content, setContent,
    imageUri,
    loading,
    pickImage,
    submit,
  } = useReviewWrite(placeId);

  return (
    <View style={styles.container}>
      <Header backwardButton="simple" title="리뷰 작성" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.placeName}>{placeName}</Text>

          {/* 별점 */}
          <View style={styles.ratingSection}>
            <Text style={styles.label}>별점</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={star <= rating ? "#F4B400" : colors.neutral300}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 제목 */}
          <Text style={styles.label}>제목 (선택)</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="리뷰 제목을 입력하세요"
            style={styles.input}
            placeholderTextColor={colors.textTertiary}
          />

          {/* 내용 */}
          <Text style={styles.label}>내용</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="방문 경험을 자세히 알려주세요"
            style={[styles.input, styles.textArea]}
            multiline
            placeholderTextColor={colors.textTertiary}
          />

          {/* 이미지 */}
          <Text style={styles.label}>사진 (선택)</Text>
          <TouchableOpacity style={styles.imageArea} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={28} color={colors.neutral500} />
                <Text style={styles.imagePlaceholderText}>사진 추가</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 제출 버튼 */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.6 }]}
            onPress={() => submit(() => navigation.goBack())}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textWhite} />
            ) : (
              <Text style={styles.submitText}>리뷰 등록하기</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...layout.screen },
  content: { padding: spacing.lg, gap: spacing.lg },

  placeName: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },

  ratingSection: { gap: spacing.sm },
  stars: { flexDirection: "row", gap: spacing.sm },

  label: { ...typography.emphasis, color: colors.textPrimary },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  textArea: { height: 120, textAlignVertical: "top" },

  imageArea: {
    width: 120,
    height: 120,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.xs },
  imagePlaceholderText: { ...typography.caption, color: colors.textTertiary },
  previewImage: { width: "100%", height: "100%" },

  submitBtn: {
    ...layout.strongbutton,
    marginTop: spacing.sm,
  },
  submitText: { ...typography.strongbutton },
});
