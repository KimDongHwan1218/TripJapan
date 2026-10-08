import { LocaleConfig } from "react-native-calendars";

// 앱 전체 달력(react-native-calendars)을 한국어로 — 기본값이 영어라 여행 만들기 달력이
// "October 2026 / Sun Mon…"으로 나오던 것(2026-10-08 실기기). LocaleConfig는 전역 설정이라 앱 시작 시 한 번만.
LocaleConfig.locales.ko = {
  monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";
