# FreeLLMAPI

<div align="center">

### **Unified OpenAI-Compatible Multi-Provider AI Gateway & Intelligent Router**
*Aggregating 34+ Free-Tier LLM Providers & 600+ Model Endpoints behind a Single Local Endpoint*

**Maintained & Authored by [@PryxIntel](https://github.com/PryxIntel)**

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-PryxIntel%2Ffreellmapi-181717?logo=github)](https://github.com/PryxIntel/freellmapi)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.18.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](tsconfig.json)
[![Security: AES--256--GCM](https://img.shields.io/badge/Security-AES--256--GCM%20Encrypted-success)](#security-architecture--audit)

<br/>

<p align="center">
  <img src="repo-assets/github-hero.png" width="850" alt="FreeLLMAPI Dashboard">
</p>

</div>

---

## 📑 Table of Contents
- [Executive Overview](#executive-overview)
- [Architecture & How It Works](#architecture--how-it-works)
- [Security & Search Audit Verification](#security--search-audit-verification)
- [Key Features](#key-features)
- [Supported Providers](#supported-providers)
- [Quick Start](#quick-start)
  - [Option A: Docker (Recommended)](#option-a-docker-recommended)
  - [Option B: Local Node.js Installation](#option-b-local-nodejs-installation)
  - [Option C: Desktop Application](#option-c-desktop-application)
- [Usage & Client Integration](#usage--client-integration)
  - [OpenAI Python SDK](#openai-python-sdk)
  - [OpenAI Node.js SDK](#openai-nodejs-sdk)
  - [cURL](#curl)
  - [Cursor / Claude Code / Cline / Roo Code](#cursor--claude-code--cline--roo-code)
- [Search Capabilities & Grounding](#search-capabilities--grounding)
- [Environment Configuration](#environment-configuration)
- [Repository Management & Pushing](#repository-management--pushing)
- [License & Open Source Compliance](#license--open-source-compliance)

---

## 🌟 Executive Overview

Every leading AI laboratory provides developer free tiers—Google AI Studio, Groq, Cerebras, Cloudflare Workers AI, Mistral, Cohere, OpenRouter, and dozens more. Individually, each provider imposes rate limits (RPM/RPD) or token quotas that restrict continuous production workflows. 

**FreeLLMAPI** solves this fragmentation by stacking these tiers into an intelligent, unified reverse-proxy gateway:
- **Unified `/v1` Endpoint:** Fully compatible with the OpenAI Chat Completions, Responses API, Anthropic Messages API, native Gemini, and Ollama protocols.
- **Intelligent Dynamic Routing:** Automatically routes each prompt to the fastest, highest-intelligence available model.
- **Automated Failover & Quota Tracking:** Detects rate limits (`429`), provider outages (`5xx`), or context overflow and seamlessly fails over to alternate sibling keys or backup providers without dropping the client stream.
- **Local-First & Self-Hosted:** All credentials, routing logs, and session caches reside solely on your local hardware.

---

## 🏗️ Architecture & How It Works

```
   ┌──────────────────────────────────────────────────────────────┐
   │               CLIENT APPLICATIONS / AGENTS                   │
   │   (OpenAI SDK, LangChain, Cursor, Claude Code, cURL, etc.)   │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                       POST /v1/chat/completions
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                FreeLLMAPI Gateway Core                       │
   │  ┌────────────────────────────────────────────────────────┐  │
   │  │ Authentication & Rate Limiting (Scrypt / Timing-Safe)  │  │
   │  └───────────────────────────┬────────────────────────────┘  │
   │                              │                               │
   │  ┌───────────────────────────▼────────────────────────────┐  │
   │  │ SSRF Guard & URL Validation (Metadata & Private IP Blk)│  │
   │  └───────────────────────────┬────────────────────────────┘  │
   │                              │                               │
   │  ┌───────────────────────────▼────────────────────────────┐  │
   │  │ Router Engine (Scoring, Headroom, Speed, Bandit Eval)  │  │
   │  └───────────────────────────┬────────────────────────────┘  │
   │                              │                               │
   │  ┌───────────────────────────▼────────────────────────────┐  │
   │  │ Encrypted Credential Store (AES-256-GCM + chmod 0600)  │  │
   │  └───────────────────────────┬────────────────────────────┘  │
   └──────────────────────────────┼───────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ Google Gemini │         │     Groq      │         │   Cerebras    │
│  (Grounding)  │         │ (Ultra-Fast)  │         │  (High-Speed) │
└───────────────┘         └───────────────┘         └───────────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  ▼
                     [Automatic Fallback Loop]
```

1. **Inbound Request:** The client sends an OpenAI-standard completion payload.
2. **Context & Budget Evaluation:** The server determines prompt token length, required features (vision, tool calling, reasoning, search grounding), and user priorities.
3. **Multi-Armed Bandit Routing:** Picks the optimum provider key based on current latency scores, available monthly quotas, and health probe states.
4. **Resilient Streaming:** Streams tokens back via Server-Sent Events (SSE). If a provider fails mid-stream before tokens are committed, the router transparently switches to the next configured provider.

---

## 🔒 Security & Search Audit Verification

FreeLLMAPI contains defensive security mechanisms to protect credentials, local network integrity, and user privacy:

### 1. Are Searches Secure?
* **Google Search Grounding:** Search queries sent with `google_search` tools are mapped directly to Google Gemini's native API `{ google_search: {} }`. Searches are executed **server-side on Google's infrastructure** with verified citations. The proxy does not run arbitrary web scrapers, curl commands, or headless browsers.
* **Internal Log & Model Search:** Search queries in the dashboard (`/api/logs?q=...`) operate on in-memory ring buffers using strict, case-insensitive substring comparisons (`String.prototype.includes`). User input **never** interpolates into raw SQL queries, eliminating SQL Injection (SQLi) vectors.
* **Zero Shell Execution for Web Searches:** The server explicitly parses and drops unhandled tool types (e.g., `web_search_call`, `local_shell`) before contacting upstream providers to ensure no unintended execution occurs.

### 2. Encryption at Rest (AES-256-GCM)
* Stored provider API keys are encrypted at rest using **AES-256-GCM** with a cryptographically secure 16-byte random IV per record and a pinned 16-byte authentication tag (`crypto.createCipheriv`).
* Key files are created atomically with restrictive permissions (`0600` / Owner-only access) via `restrictToOwner()`.
* Keys rendered in the UI or logs are aggressively masked (`maskKey()`), preventing leakage of short or partial secrets.

### 3. Server-Side Request Forgery (SSRF) Protection
* Outbound requests for custom endpoints pass through a dedicated `url-guard.ts` validation suite.
* Explicitly blocks **Cloud Metadata IP addresses** (AWS IMDSv2 `169.254.169.254`, `fd00:ec2::254`, Google `metadata.google.internal`, Alibaba `100.100.100.200`, Oracle `192.0.0.192`).
* Blocks link-local ranges and private loopbacks when configured with `FREEAPI_BLOCK_PRIVATE_PROVIDER_URLS=true`.
* Prevents HTTP redirect following to avert DNS-rebinding and redirect-based SSRF bypasses.

### 4. Application Hardening
* **Constant-Time Comparison:** Session tokens and authentication keys use `crypto.timingSafeEqual` to defeat timing-attack side channels.
* **Content Security Policy (CSP):** Emits strict CSP headers with SHA-256 hash pinning on inline scripts, preventing Cross-Site Scripting (XSS).
* **Network Binding:** Binds strictly to `127.0.0.1` / loopback by default. Public network exposure (`HOST_BIND=0.0.0.0`) requires explicit operator opt-in.

---

## ⚡ Key Features

- **34+ Providers Out of the Box:** Native adapters for Google Gemini, Groq, Cerebras, Mistral, OpenRouter, Cloudflare Workers AI, Cohere, DeepSeek, Zhipu AI, ModelScope, and more.
- **Custom Model Integration:** Connect any self-hosted model (Ollama, LM Studio, vLLM, llama.cpp, LocalAI) via standard OpenAI-compatible endpoints.
- **Prompt Compression Pipeline:** Built-in semantic compaction engine strips redundant boilerplate, whitespace, and repetitive system prompts to conserve context windows.
- **Model Context Protocol (MCP) Server:** Built-in stateless JSON-RPC `/mcp` endpoint allowing AI coding agents (Cursor, Claude Code, Cline) to query active providers, model availability, and routing metrics.
- **Audio & Vision Modalities:** Proxies audio transcriptions (Whisper), speech synthesis (TTS), and image generation (FLUX, Stable Diffusion, DALL-E) across compatible free endpoints.
- **Modern Local Dashboard:** Built with React, Vite, and Tailwind-inspired styling for monitoring real-time request latencies, token consumption, and provider health.

---

## 🌐 Supported Providers

<div align="center">

| Provider | Highlight Models | Capabilities | Free Quota Model |
| :--- | :--- | :--- | :--- |
| **Google AI Studio** | Gemini 2.5 Flash, 2.5 Pro, 2.0 Flash Thinking | Vision, Audio, Tools, Search | 15 RPM / 1M TPM / 1,500 RPD |
| **Groq** | Llama 3.3 70B, DeepSeek R1 Distill, Mixtral | Ultra-Low Latency, Tools | 30 RPM / 14.4K RPD |
| **Cerebras** | Llama 3.1 8B & 70B | High-Throughput (1000+ T/s) | 30 RPM / 1M TPD |
| **Mistral AI** | Mistral Small, Codestral, Pixtral | Code, Vision, Multilingual | 1 RPS / Generous Monthly Tier |
| **Cloudflare Workers AI** | Llama 3.3, DeepSeek, Qwen | Edge Serverless Inference | 10,000 Neurons / Day |
| **OpenRouter** | 20+ Free Community Models (`:free`) | Varied Architecture Pool | 20 RPM / 200 RPD |
| **Cohere** | Command R, Command R+ | RAG, Retrieval, Search | 1,000 Calls / Month |
| **ModelScope** | Qwen 2.5, DeepSeek V3/R4 | Open Chinese / English LLMs | Daily Developer Allowance |
| **Self-Hosted** | Ollama, vLLM, LM Studio, llama.cpp | Local GPU / CPU Offload | Unlimited (Local Hardware) |

</div>

---

## 🚀 Quick Start

### Option A: Docker (Recommended)

Run the containerized gateway with persistent local storage:

```bash
# 1. Clone the repository
git clone https://github.com/PryxIntel/freellmapi.git
cd freellmapi

# 2. Copy the sample environment
cp .env.example .env

# 3. Launch via Docker Compose
docker compose up -d
```

Access the web dashboard at: **`http://localhost:3001`**

---

### Option B: Local Node.js Installation

**Prerequisites:** Node.js `>= 20.18.0` and `npm >= 10.0.0`

```bash
# 1. Clone repository
git clone https://github.com/PryxIntel/freellmapi.git
cd freellmapi

# 2. Install workspace dependencies
npm install

# 3. Generate local encryption key & configure environment
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))" >> .env

# 4. Run database migrations
npm run db:migration:up

# 5. Start development server (backend + dashboard)
npm run dev
```

---

### Option C: Desktop Application

The desktop application bundles the local gateway and a system tray manager into an Electron bundle:

```bash
# Build client and run desktop app in development
npm run desktop:dev

# Or package distributable for your platform
npm run desktop:dist:win      # Windows (.exe)
npm run desktop:dist:mac:x64  # macOS (.dmg)
npm run desktop:dist:linux    # Linux (.AppImage / .deb)
```

---

## 💻 Usage & Client Integration

Once FreeLLMAPI is running, retrieve your **Unified API Key** from the dashboard (or generate one in the Keys tab). Configure any OpenAI-compatible client to point to your local URL:

### OpenAI Python SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="your-freellmapi-unified-key"
)

response = client.chat.completions.create(
    model="auto",  # Let FreeLLMAPI choose the best free model, or specify a model
    messages=[
        {"role": "system", "content": "You are a senior software architect."},
        {"role": "user", "content": "Explain zero-knowledge proofs in three bullet points."}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
```

---

### OpenAI Node.js SDK

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:3001/v1',
  apiKey: 'your-freellmapi-unified-key',
});

const completion = await openai.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Write a TypeScript debounce function.' }],
});

console.log(completion.choices[0].message.content);
```

---

### cURL

```bash
curl http://localhost:3001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-freellmapi-unified-key" \
  -d '{
    "model": "auto",
    "messages": [
      {"role": "user", "content": "What is the capital of Japan?"}
    ]
  }'
```

---

### Cursor / Claude Code / Cline / Roo Code

Point your AI editor or coding agent to FreeLLMAPI:
- **Base URL:** `http://localhost:3001/v1` (or `http://localhost:3001` depending on client)
- **API Key:** Your FreeLLMAPI unified key
- **Model Name:** `auto` (or pick any specific supported model ID like `gemini-2.5-flash`, `llama-3.3-70b-versatile`)

---

## 🔍 Search Capabilities & Grounding

FreeLLMAPI supports **real-time web search grounding** when using models with native search capabilities (e.g. Google Gemini):

```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    { "role": "user", "content": "What are the latest tech headlines today?" }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "google_search",
        "description": "Ground output with live web search results"
      }
    }
  ]
}
```

The gateway maps `google_search` to Google's official native grounding API `{ google_search: {} }`. Citations and search sources are included directly in the response metadata.

---

## ⚙️ Environment Configuration

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `3001` | HTTP port for gateway and dashboard |
| `HOST` | `::` | Host address (`127.0.0.1` for local-only, `0.0.0.0` for LAN) |
| `ENCRYPTION_KEY` | *(auto in dev)* | 64-character hexadecimal key for AES-256-GCM credential encryption |
| `FREEAPI_DB_PATH` | `./data/freellmapi.sqlite` | SQLite database file location |
| `PROXY_RATE_LIMIT_RPM`| `120` | Max incoming requests per minute per IP |
| `FREEAPI_BLOCK_PRIVATE_PROVIDER_URLS` | `false` | Block loopback & RFC1918 IPs on custom providers (SSRF protection) |
| `TRUST_PROXY` | `false` | Enable only when behind an upstream Nginx/Cloudflare reverse proxy |

---

## 📦 Repository Management & Pushing

To link this codebase to your own GitHub account (`PryxIntel`) and push updates:

```bash
# 1. Update the git remote URL to your repository:
git remote set-url origin https://github.com/PryxIntel/freellmapi.git

# 2. Stage your changes and commit:
git add .
git commit -m "feat: complete brand refresh and security audit for PryxIntel"

# 3. Push to your repository:
git branch -M main
git push -u origin main
```

---

## 📄 License & Open Source Compliance

This project is licensed under the **MIT License**.

Under the terms of the MIT License, you are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software. As required by the MIT license, the original copyright notice remains in the [`LICENSE`](./LICENSE) file.

**Project Maintainer & Author:** [@PryxIntel](https://github.com/PryxIntel)
