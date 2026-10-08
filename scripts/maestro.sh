#!/usr/bin/env bash
# Maestro 실행 래퍼: bash scripts/maestro.sh maestro/flows/tour.yaml [추가 인자]
# - Java 17(winget Microsoft.OpenJDK.17) + Maestro CLI(~/.maestro, GitHub 릴리스 zip) 경로를 잡아줌
# - 연결된 폰 자동 선택, 스크린샷은 screenshots/<현재 버전>(scripts/device.sh version 으로 지정)에 저장
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export JAVA_HOME="$(ls -d "/c/Program Files/Microsoft/jdk-17"* 2>/dev/null | head -1)"
export PATH="$JAVA_HOME/bin:$USERPROFILE/.maestro/maestro/bin:$LOCALAPPDATA/Microsoft/WinGet/Packages/Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe/platform-tools:$PATH"
export MAESTRO_CLI_NO_ANALYTICS=1
# Windows 기본 인코딩(MS949)으로 흐름 파일을 읽으면 한글 선택자가 깨져서 요소를 못 찾음
export JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"
DEV="${DEV:-$(adb devices | awk 'NR>1 && $2=="device"{print $1; exit}')}"
VER="$(cat "$ROOT/screenshots/.current" 2>/dev/null || echo _tmp)"
OUT="$ROOT/screenshots/$VER"; mkdir -p "$OUT"
FLOW="$1"; shift
# Maestro 2.x는 takeScreenshot을 자체 결과 폴더(~/.maestro/tests/<시각>/<흐름>/takeScreenshot)에 저장함
# → 실행이 끝나면(실패해도) 그 폴더의 이미지를 현재 버전 폴더로 복사
set +e
maestro --device "$DEV" test "$ROOT/$FLOW" "$@"
RC=$?
LAST="$(ls -td "$USERPROFILE/.maestro/tests"/*/ 2>/dev/null | head -1)"
N=0
for p in "$LAST"*/takeScreenshot/*.png; do [ -f "$p" ] && cp "$p" "$OUT/" && N=$((N+1)); done
echo "screenshots: $N -> $OUT"
exit $RC
