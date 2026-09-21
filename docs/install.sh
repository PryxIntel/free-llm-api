#!/usr/bin/env bash
# The FreeLLMAPI installer moved to https://github.com/PryxIntel/free-llm-apiinstall.sh
# This shim keeps old `curl ... github.io ... | bash` one-liners working.
set -euo pipefail
exec bash -c "$(curl -fsSL https://github.com/PryxIntel/free-llm-apiinstall.sh)"
