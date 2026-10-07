#!/usr/bin/env bash
# 폰 조작 헬퍼: a.sh shot NAME | tap X Y | swipe X1 Y1 X2 Y2 [ms] | back | ui | text STR | key CODE
# 사용: bash scripts/device.sh version v005_날짜_단계명 → 이후 snap 설명 으로 단계별 스크린샷 보관(screenshots/는 gitignore)
# DEV는 무선 디버깅 메인 화면의 IP:포트(켤 때마다 바뀜) — 바뀌면 아래 값을 수정
export MSYS_NO_PATHCONV=1
ADB="$LOCALAPPDATA/Microsoft/WinGet/Packages/Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe/platform-tools/adb.exe"
DEV="192.168.1.60:42305"
D="$(cd "$(dirname "$0")/.." && pwd)/screenshots/_tmp"
mkdir -p "$D"
a() { "$ADB" -s "$DEV" "$@"; }
case "$1" in
  shot) a exec-out screencap -p > "$D/$2.png"; echo "$D/$2.png" ;;
  tap) a shell input tap "$2" "$3" ;;
  swipe) a shell input swipe "$2" "$3" "$4" "$5" "${6:-400}" ;;
  back) a shell input keyevent 4 ;;
  key) a shell input keyevent "$2" ;;
  text) a shell input text "$2" ;;
  ui)
    # 화면의 텍스트/설명/클릭가능 요소와 중심 좌표 출력
    a shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1
    a exec-out cat /sdcard/ui.xml | tr '>' '\n' | grep -E 'text="[^"]+"|content-desc="[^"]+"|clickable="true"' \
      | sed -nE 's/.*text="([^"]*)".*content-desc="([^"]*)".*clickable="([^"]*)".*bounds="\[([0-9]+),([0-9]+)\]\[([0-9]+),([0-9]+)\]".*/\1|\2|\3|\4 \5 \6 \7/p' \
      | awk -F'|' '{split($4,b," "); cx=int((b[1]+b[3])/2); cy=int((b[2]+b[4])/2); t=$1; if(t=="")t=$2; if(t==""&&$3=="true")t="(clickable)"; if(t!="") printf "%-40s %s (%d,%d)\n", substr(t,1,40), ($3=="true"?"C":" "), cx, cy}'
    ;;
  launch) a shell monkey -p com.hwan1218.tripjapan -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1 ;;
  snap)
    # 앱이 화면 맨 앞이 아니면 찍지 않음(런처·다른 앱이 찍히는 실수 방지)
    a shell dumpsys window | grep -m1 mCurrentFocus | grep -q com.hwan1218.tripjapan || { echo "SKIP: app not in front"; exit 1; }
    # 현재 버전 폴더(screenshots/.current)에 번호 붙여 보관: a.sh snap 설명
    R="$(cd "$(dirname "$0")/.." && pwd)/screenshots"; V=$(cat "$R/.current"); mkdir -p "$R/$V"
    N=$(ls "$R/$V" | grep -c ".png$"); printf -v NN "%02d" $((N+1)); F="$R/$V/${NN}_$2.png"
    a exec-out screencap -p > "$F"; echo "$F" ;;
  version) R="$(cd "$(dirname "$0")/.." && pwd)/screenshots"; echo "$2" > "$R/.current"; mkdir -p "$R/$2"; echo "now: $2" ;;
  tapt)
    # 화면에서 글자(부분 일치)를 찾아 그 중심을 탭: device.sh tapt "관광지" [n번째]
    P=$(bash "$0" ui | grep -F "$2" | sed -n "${3:-1}p" | grep -oE "([0-9]+,[0-9]+)" | tr -d "()" | tr "," " ")
    [ -z "$P" ] && { echo "NOT FOUND: $2"; exit 1; }; a shell input tap $P ;;
  focus) a shell dumpsys window | grep -m1 mCurrentFocus ;;
esac
