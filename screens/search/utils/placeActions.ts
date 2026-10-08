import { Linking, Share, Clipboard } from "react-native";
import type { PlaceDetail } from "../hooks/usePlaceDetail";

// 장소 상세 시안 B·C의 길찾기·공유·주소 복사 — 두 시안이 같이 씀
// 길찾기는 구글 지도 길찾기 URL(앱이 있으면 앱으로 열림). 좌표가 없으면 이름+주소로 검색
export function openDirections(place: PlaceDetail) {
  const dest =
    place.latitude != null && place.longitude != null
      ? `${place.latitude},${place.longitude}`
      : encodeURIComponent(`${place.name} ${place.address ?? ""}`.trim());
  Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${dest}`);
}

export function sharePlace(place: PlaceDetail) {
  const url =
    place.latitude != null && place.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`
      : "";
  Share.share({ message: [place.name, place.address, url].filter(Boolean).join("\n") }).catch(() => {});
}

export function copyAddress(place: PlaceDetail) {
  Clipboard.setString(place.address || place.name);
}

export const hasCoords = (place: PlaceDetail) => place.latitude != null && place.longitude != null;
