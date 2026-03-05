import * as ImagePicker from "expo-image-picker";

export async function pickImage() {
  // 권한 요청
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("사진 접근 권한이 필요합니다.");
    return null;
  }

  // 이미지 선택
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1, // 최대 화질
  });

  if (result.canceled) return null;

  // 선택한 이미지 URI 반환
  return result.assets[0].uri;
}
