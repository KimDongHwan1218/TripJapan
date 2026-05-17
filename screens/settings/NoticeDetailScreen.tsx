import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Header from "@/components/Header/Header";
import { layout, typography, spacing, colors } from "@/styles";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingsStackParamList } from "@/navigation/SettingsStackNavigator";

type RouteProps = RouteProp<SettingsStackParamList, "NoticeDetailScreen">;

const MOCK_DETAILS: Record<string, { title: string; content: string; createdAt: string }> = {
  "1": {
    title: "타비 서비스 이용약관 개정 안내",
    createdAt: "2026-04-01",
    content: `안녕하세요, 타비입니다.

서비스 이용약관이 2026년 4월 15일부터 변경됩니다.

주요 변경 사항은 다음과 같습니다.

1. 제 3조 (서비스 이용) 항목 추가
   - 여행 일정 공유 기능 관련 조항이 추가되었습니다.

2. 제 7조 (개인정보) 조항 수정
   - 위치 정보 수집 및 이용 목적이 명확히 기재되었습니다.

3. 제 11조 (면책조항) 보완
   - 외부 서비스 연동(항공, 숙박 등) 관련 면책 조항이 추가되었습니다.

변경된 약관은 시행일 이후 앱 이용 시 자동으로 적용됩니다.
문의 사항은 고객센터로 연락 주세요.

감사합니다.
타비 서비스팀 드림`,
  },
  "2": {
    title: "개인정보 처리방침 변경 안내",
    createdAt: "2026-03-15",
    content: `안녕하세요, 타비입니다.

개인정보 처리방침이 변경되었습니다.

주요 변경 내용:
- 수집 항목: 이메일, 닉네임, 프로필 이미지
- 이용 목적: 서비스 제공 및 개선
- 보유 기간: 회원 탈퇴 후 30일

자세한 내용은 설정 > 약관 및 개인정보 처리방침에서 확인하실 수 있습니다.`,
  },
  "3": {
    title: "타비 앱 v1.2 업데이트 안내",
    createdAt: "2026-03-01",
    content: `타비 v1.2 업데이트 내용을 안내해드립니다.

신규 기능:
- 여행 일정 드래그 & 드롭 순서 변경
- 구글/카카오 소셜 로그인 지원
- 장소 검색 기능 강화 (Google Places 연동)
- 경로 정보 표시 (도보/대중교통)

개선 사항:
- 커뮤니티 게시글 상세 화면 UI 개선
- 홈 화면 로딩 속도 개선
- 다크모드 지원 준비 중

항상 타비를 이용해 주셔서 감사합니다!`,
  },
  "4": {
    title: "일본 여행 정보 서비스 오픈 안내",
    createdAt: "2026-02-10",
    content: `타비에서 일본 여행 정보 서비스를 오픈합니다!

일본 전역의 관광지, 맛집, 카페, 쇼핑 정보를 타비에서 만나보세요.

제공 정보:
- 도쿄, 오사카, 교토, 후쿠오카 등 주요 도시 정보
- 현지인 추천 맛집 및 카페
- 최신 팝업스토어 및 이벤트 정보
- 쇼핑 스팟 (돈키호테, 드럭스토어 등)

앞으로도 더 많은 정보를 추가해 나갈 예정입니다.
많은 이용 부탁드립니다!`,
  },
  "5": {
    title: "커뮤니티 이용 정책 안내",
    createdAt: "2026-01-20",
    content: `타비 커뮤니티를 건강하게 유지하기 위한 이용 정책을 안내드립니다.

금지 행위:
- 욕설, 비방, 혐오 표현
- 광고성 게시글
- 개인정보 노출
- 허위 정보 유포

위반 시 조치:
1차: 경고
2차: 7일 이용 정지
3차: 영구 이용 정지

건전한 커뮤니티 문화를 함께 만들어 나가요!
감사합니다.`,
  },
};

export default function NoticeDetailScreen() {
  const { params } = useRoute<RouteProps>();
  const noticeId = params?.noticeId ?? "";

  const notice = MOCK_DETAILS[noticeId] ?? {
    title: "공지사항",
    createdAt: "",
    content: "내용을 불러올 수 없습니다.",
  };

  return (
    <View style={layout.screen}>
      <Header title="공지사항" backwardButton="simple" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{notice.title}</Text>
        {notice.createdAt ? (
          <Text style={styles.date}>
            {new Date(notice.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        ) : null}
        <View style={styles.divider} />
        <Text style={styles.body}>{notice.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 26,
  },
  date: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.lg,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
