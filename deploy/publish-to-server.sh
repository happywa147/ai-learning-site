#!/usr/bin/env bash
set -euo pipefail

REMOTE="${1:-}"
PORT="${2:-22}"
REMOTE_DIR="${REMOTE_DIR:-/www/wwwroot/ai.mynaxis.com}"

if [[ -z "$REMOTE" ]]; then
  echo "用法：./deploy/publish-to-server.sh 用户名@服务器IP [端口]"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

node scripts/validate-content.js

rsync -avz --delete \
  -e "ssh -p ${PORT}" \
  --exclude ".git/" \
  --exclude ".github/" \
  --exclude "deploy/" \
  --exclude ".DS_Store" \
  ./ "${REMOTE}:${REMOTE_DIR}/"

echo "发布完成：${REMOTE}:${REMOTE_DIR}"
