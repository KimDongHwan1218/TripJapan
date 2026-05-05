import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Header from "@/components/Header/Header";
import { layout, spacing, colors, radius, typography } from "@/styles";

const TABS = ["이용약관", "개인정보 처리방침"] as const;
type Tab = typeof TABS[number];

const TERMS = `제 1조 (목적)
본 약관은 타비(이하 "회사")가 제공하는 일본 여행 정보 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제 2조 (정의)
1. "서비스"란 회사가 제공하는 여행 정보, 커뮤니티, 일정 관리 등 모든 서비스를 의미합니다.
2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.

제 3조 (서비스 이용)
1. 서비스는 연중무휴 24시간 제공됩니다.
2. 회사는 시스템 점검, 증설 및 교체를 위해 서비스를 일시적으로 중단할 수 있습니다.
3. 이용자는 서비스 이용 시 관련 법령과 본 약관을 준수해야 합니다.

제 4조 (회원가입 및 계정)
1. 소셜 로그인(카카오, 구글)을 통해 회원가입이 이루어집니다.
2. 이용자는 본인의 계정을 타인에게 양도하거나 공유할 수 없습니다.

제 5조 (커뮤니티 이용)
1. 이용자는 타인의 권리를 침해하거나 법령에 위반되는 게시물을 작성해서는 안 됩니다.
2. 다음 행위는 금지됩니다:
   - 욕설, 비방, 혐오 표현
   - 광고성 게시글 및 스팸
   - 개인정보 무단 게시
   - 허위 정보 유포

제 6조 (면책조항)
1. 회사는 무료로 제공하는 서비스의 이용과 관련하여 이용자에게 발생한 손해에 대해 책임지지 않습니다.
2. 외부 서비스(항공, 숙박 등)에 관한 정보는 해당 업체가 책임지며, 회사는 중개자 역할만 합니다.

제 7조 (약관의 변경)
회사는 필요한 경우 약관을 변경할 수 있으며, 변경 시 앱 내 공지사항을 통해 안내합니다.`;

const PRIVACY = `개인정보 처리방침

타비(이하 "회사")는 이용자의 개인정보를 중요하게 생각하며, 개인정보 보호법을 준수합니다.

1. 수집하는 개인정보 항목
   - 필수: 소셜 로그인 정보(이름, 이메일, 프로필 이미지)
   - 선택: 닉네임, 자기소개, 전화번호

2. 개인정보 수집 및 이용 목적
   - 회원 식별 및 서비스 제공
   - 커뮤니티 기능 운영
   - 서비스 개선 및 신규 기능 개발
   - 공지사항 전달

3. 개인정보 보유 및 이용 기간
   - 회원 탈퇴 후 30일까지 보관 후 파기
   - 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관

4. 개인정보 제3자 제공
   회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
   단, 이용자의 동의가 있거나 법령의 규정에 의한 경우는 예외로 합니다.

5. 개인정보 파기
   개인정보 보유 기간 경과 및 처리 목적 달성 후 해당 정보를 지체 없이 파기합니다.

6. 이용자의 권리
   이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다.
   설정 > 프로필 편집에서 직접 수정하거나, 고객센터로 문의해 주세요.

7. 문의처
   개인정보 관련 문의: support@tavi.app`;

export default function PolicyScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("이용약관");

  return (
    <View style={layout.screen}>
      <Header title="약관 및 개인정보 처리방침" backwardButton="simple" />

      {/* 탭 */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.body}>
          {activeTab === "이용약관" ? TERMS : PRIVACY}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textTertiary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  body: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
