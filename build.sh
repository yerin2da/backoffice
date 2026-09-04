#!/usr/bin/env bash
#
# release+symlink 무중단 배포 스크립트
# git pull은 이 스크립트 밖에서 이미 완료되었다고 가정한다 (여기서는 실행하지 않음).
#
# 동작:
#   1. (가능하면) 로컬 HEAD가 upstream과 같은지 체크만 함 - fetch/pull은 하지 않음
#   2. npm run build 를 build/releases/<timestamp> 로 빌드
#   3. build/current 심볼릭 링크를 새 release로 무중단 전환
#
# 전제: 이 스크립트는 저장소 루트(/home/bomul/git/partner-bo/build.sh)에 위치.
#       nginx root는 /home/bomul/git/partner-bo/build/current 를 바라봄.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$SCRIPT_DIR"
BUILD_ROOT="$REPO_DIR/build"
RELEASES_DIR="$BUILD_ROOT/releases"
CURRENT_LINK="$BUILD_ROOT/current"

# 1. git pull 여부 체크 (네트워크 접근 없이, 마지막으로 fetch된 upstream ref 기준)
if [ -d "$REPO_DIR/.git" ]; then
    LOCAL_HEAD="$(git -C "$REPO_DIR" rev-parse HEAD)"
    REMOTE_HEAD="$(git -C "$REPO_DIR" rev-parse '@{u}' 2>/dev/null || true)"
    if [ -n "$REMOTE_HEAD" ] && [ "$LOCAL_HEAD" != "$REMOTE_HEAD" ]; then
        echo "ERROR: 로컬 HEAD($LOCAL_HEAD)가 upstream($REMOTE_HEAD)과 다릅니다. git pull 먼저 실행하세요." >&2
        exit 1
    fi
fi

# 2. releases/<timestamp> 로 빌드
TIMESTAMP="$(date '+%Y%m%d%H%M%S')"
RELEASE_DIR="$RELEASES_DIR/$TIMESTAMP"
mkdir -p "$RELEASE_DIR"

( cd "$REPO_DIR" && BUILD_PATH="$RELEASE_DIR" npm run build )

# 3. current 심볼릭 링크를 새 release로 무중단(원자적) 전환
ln -sfn "releases/$TIMESTAMP" "$BUILD_ROOT/current_tmp"
mv -Tf "$BUILD_ROOT/current_tmp" "$CURRENT_LINK"

echo "current -> releases/$TIMESTAMP"
