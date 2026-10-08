#!/usr/bin/env bash
# 폰 조작 헬퍼: a.sh shot NAME | tap X Y | swipe X1 Y1 X2 Y2 [ms] | back | ui | text STR | key CODE
# 사용: bash scripts/device.sh version v005_날짜_단계명 → 이후 snap 설명 으로 단계별 스크린샷 보관(screenshots/는 gitignore)
export MSYS_NO_PATHCONV=1
ADB="$LOCALAPPDATA/Microsoft/WinGet/Packages/Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe/platform-tools/adb.exe"
# 무선 디버깅 포트는 켤 때마다 바뀜 → 연결된 기기 중 첫 번째를 자동 사용(페어링된 기기는 mdns 이름으로 잡혀 포트가 바뀌어도 유지).
# 특정 기기를 쓰려면 DEV=IP:포트 bash scripts/device.sh ...
DEV="${DEV:-$("$ADB" devices | awk 'NR>1 && $2=="device" {print $1; exit}')}"
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
  waitfor)
    # 글자가 화면에 나타날 때까지 기다림(고정 sleep 대신): device.sh waitfor "실시간 타비톡" [최대초=10]
    # 화면 구조 조회 1회가 약 1~2초라 그 간격으로 확인. 나타나면 바로 반환, 시간 초과면 exit 1
    END=$(( $(date +%s) + ${3:-10} ))
    while [ "$(date +%s)" -lt "$END" ]; do
      bash "$0" ui | grep -qF "$2" && exit 0
    done
    echo "TIMEOUT: $2"; exit 1 ;;
  tapw)
    # 나타날 때까지 기다렸다가 탭: device.sh tapw "번역" [최대초=10]
    bash "$0" waitfor "$2" "${3:-10}" && bash "$0" tapt "$2" ;;
  anim)
    # 폰 애니메이션 끄기/되돌리기(탐색 속도용): device.sh anim off | on  (원래 값은 세 항목 모두 1.0)
    V=$([ "$2" = "off" ] && echo 0 || echo 1.0)
    for k in window_animation_scale transition_animation_scale animator_duration_scale; do a shell settings put global $k $V; done
    echo "animations: $2" ;;
  focus) a shell dumpsys window | grep -m1 mCurrentFocus ;;
esac
