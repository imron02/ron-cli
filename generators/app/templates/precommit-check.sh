#!/usr/bin/env bash
set -e

# allow being run from somewhere other than the git rootdir
gitroot=$(git rev-parse --show-cdup)

# default gitroot to . if we're already at the rootdir
gitroot=${gitroot:-.};
nm_bin=$gitroot/node_modules/.bin

echo "===== Linting changed Staged files ===="
SRC_FILES=$(git diff --staged --diff-filter=ACMTUXB --name-only -- '*.js' | grep -v '\.test\|mock\|e2e\.js$') && x=1

function lint() {
  if [ "$1" ]; then
    echo "Linting changed $1 files"
    $nm_bin/eslint -c .eslintrc.js --cache --color $1
  else
    echo "No $1 files changed"
  fi
}

lint "$SRC_FILES"

echo "⚡️  changed files passed linting!  ⚡️"
