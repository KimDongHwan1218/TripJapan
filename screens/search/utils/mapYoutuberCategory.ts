// 유튜버 추천 장소의 자유 텍스트 분류(라멘, 카페, 온천/료칸 등)를
// 검색 화면이 이미 쓰는 카테고리 키(restaurant/cafe/event_place/goods)로 매핑한다.
export function mapYoutuberCategoryToAppCategory(raw: string | null): string {
  if (!raw) return "restaurant";

  if (/카페|디저트|커피|파르페|크레이프|팥토스트/.test(raw)) return "cafe";
  if (/온천|료칸|성지순례|공항|관광/.test(raw)) return "event_place";
  if (/쇼핑|돈키호테|굿즈|잡화/.test(raw)) return "goods";
  return "restaurant";
}
