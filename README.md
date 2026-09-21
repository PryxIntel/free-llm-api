# Free LLM API — Universal Multi-Provider AI Gateway & Router

<div align="center">

### ⚡ **Aggregate 34+ Free-Tier AI Providers & 600+ Models into One Unified `/v1` Endpoint**
*Zero-Cost, Ultra-Low Latency, Smart Dynamic Routing, Automated Fallback & AES-256 Encrypted*

**Created & Maintained by [@PryxIntel](https://github.com/PryxIntel)**

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-PryxIntel%2Ffree--llm--api-181717?logo=github)](https://github.com/PryxIntel/free-llm-api)
[![Stars](https://img.shields.io/github/stars/PryxIntel/free-llm-api?style=social)](https://github.com/PryxIntel/free-llm-api/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.18.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](tsconfig.json)
[![Security: AES-256-GCM](https://img.shields.io/badge/Security-AES--256--GCM%20Verified-success)](#-security--search-audit-verification)

<br/>

<p align="center">
  <img src="repo-assets/github-hero.png" width="900" alt="Free LLM API Gateway Dashboard by PryxIntel">
</p>

</div>

---

## 📌 GitHub Repository Optimization (For Maximum Search Discovery)

> [!TIP]
> When creating or updating your repository on GitHub, use these exact values in the **About** settings on your repository page to achieve top ranking on GitHub and Google searches:
> 
> - **Repository Name:** `free-llm-api`
> - **Description:** `⚡ Free LLM API Gateway: Aggregate 34+ free-tier AI providers & 600+ models into one unified OpenAI-compatible /v1 endpoint with auto-routing, failover & AES-256 encryption.`
> - **Website:** `https://github.com/PryxIntel/free-llm-api`
> - **Topics / Tags (Copy & Paste):**
>   `free-llm-api`, `free-llm`, `llm-gateway`, `openai-proxy`, `ai-gateway`, `free-api`, `gemini-api`, `groq`, `anthropic-proxy`, `claude-code`, `cursor`, `deepseek`, `mistral`, `ai-router`, `reverse-proxy`, `chatgpt-free`, `llm`

---

## 📑 Table of Contents

1. [Why Free LLM API?](#-why-free-llm-api)
2. [How It Works & Architecture](#-how-it-works--architecture)
3. [Supported Free Providers (34+)](#-supported-free-providers-34)
4. [Security & Search Audit Verification](#-security--search-audit-verification)
5. [Feature Comparison](#-feature-comparison)
6. [Quick Start Guide](#-quick-start-guide)
   - [Docker Deployment](#option-1-docker-compose-recommended)
   - [Local Node.js Setup](#option-2-local-nodejs-installation)
   - [Desktop App](#option-3-desktop-application)
7. [Client Integrations](#-client-integrations)
   - [Python OpenAI SDK](#openai-python-sdk)
   - [Node.js / TypeScript](#nodejs--typescript-sdk)
   - [cURL](#curl-terminal)
   - [Cursor / Claude Code / Cline / Roo Code](#ai-editors--coding-agents)
8. [Google Search Grounding & Search Features](#-search-capabilities--grounding)
9. [Configuration & Environment Variables](#-configuration--environment-variables)
10. [Pushing to GitHub](#-pushing-to-github)
11. [License & Attribution](#-license--open-source-compliance)

---

## 💡 Why Free LLM API?

Almost every modern AI research lab and model cloud provider provides **generous free developer tiers**:
- **Google AI Studio:** 1,500 requests per day (Gemini 2.5 Flash, 2.0 Pro)
- **Groq:** Ultra-fast Llama 3.3 70B & DeepSeek R1 with 30 RPM
- **Cerebras:** 1,000+ tokens/sec throughput with 1M tokens/day
- **Mistral AI, Cloudflare, OpenRouter, Cohere, Together, Zhipu:** Millions of free monthly tokens.

On their own, each provider imposes rate limits or quota walls that interrupt coding sessions.

**Free LLM API by PryxIntel** collapses all of them into a single, bulletproof, OpenAI-compatible `/v1` endpoint. Your applications talk to **one endpoint**—and Free LLM API automatically balances requests, fails over around rate limits, and routes to whichever model is free, fast, and online.

---

## 🏗️ How It Works & Architecture

```
   ┌──────────────────────────────────────────────────────────────┐
   │               CLIENT APPLICATIONS / AGENTS                   │
   │      (Cursor, Claude Code, LangChain, Python, Node.js)       │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                   POST /v1/chat/completions (OpenAI Wire)
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                  Free LLM API Gateway Core                   │
   │  ┌────────────────────────────────────────────────────────┐  │
   │  │  Authentication & Scrypt Hash Verification             │  │
   │  └───────────────────────────┬────────────────────────────┘  │
   │                              │                               │
   │  ┌───────────────────────────▼────────────────────────────┐  │
   │  │  SSRF URL Guard (Blocks Cloud Metadata & Internal IPs) │  │
   │  └───────────────────────────┬────────────────────────────┘  │
   │                              │                               │
   │  ┌───────────────────────────▼────────────────────────────┐  │
   │  │  Intelligent Routing (Latency, Headroom, Scoring)     │  │
   │  └───────────────────────────┬────────────────────────────┘  │
   │                              │                               │
   │  ┌───────────────────────────▼────────────────────────────┐  │
   │  │  Encrypted Credential Storage (AES-256-GCM / 0600)    │  │
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
            [Automatic Fallback Loop on 429 / 5xx Errors]
```

1. **Request Intake:** Receives requests from any standard OpenAI client or library.
2. **Feature & Quota Inspection:** Evaluates context window size, streaming requirements, tool calling, and multimodal inputs (images/audio).
3. **Adaptive Routing:** Directs traffic to the optimal free-tier provider based on real-time latency, health probes, and monthly token budgets.
4. **Seamless Failover:** If an upstream provider returns `429 Too Many Requests` or temporary outages, the router switches to a fallback provider automatically without dropping the client stream.

---

## 🌐 Supported Free Providers (34+)

<div align="center">

| Provider | Highlights / Flagship Models | Special Strengths | Free Quota Model |
| :--- | :--- | :--- | :--- |
| **Google AI Studio** | Gemini 2.5 Flash, Gemini 2.5 Pro | Vision, Audio, Native Search | 15 RPM / 1M TPM / 1.5K RPD |
| **Groq** | Llama 3.3 70B, DeepSeek R1 Distill | Sub-second Latency, Tools | 30 RPM / 14,400 RPD |
| **Cerebras** | Llama 3.1 8B & 70B | 1,000+ Tokens/sec | 30 RPM / 1M TPD |
| **Mistral AI** | Mistral Small, Codestral, Pixtral | Coding, Vision, Multilingual | 1 RPS Free Tier |
| **Cloudflare Workers AI** | Llama 3.3, DeepSeek, Qwen | Edge Serverless Execution | 10,000 Neurons / Day |
| **OpenRouter** | 20+ Free Community Endpoints (`:free`) | Varied Model Architectures | 20 RPM / 200 RPD |
| **Cohere** | Command R, Command R+ | RAG, Embeddings, Search | 1,000 Calls / Month |
| **ModelScope** | Qwen 2.5, DeepSeek V3/R4 | Open Chinese / English LLMs | Free Community Tier |
| **Z.ai (Zhipu)** | GLM-4 Flash | Function Calling, Fast Math | High Free RPM Tier |
| **Self-Hosted** | Ollama, vLLM, LM Studio, llama.cpp | 100% Offline Local Inference | Unlimited (Local Hardware) |

</div>

---

## 🔒 Security & Search Audit Verification

This project adheres to rigorous security standards. Here is an audited breakdown of its security posture:

### 1. Are Searches Secure?
- **Google Search Grounding:** Requests using the `google_search` tool are translated directly to Gemini's native API `{ google_search: {} }`. Searches run entirely **on Google's official infrastructure**. Free LLM API does not execute local scraping or shell scripts.
- **Log & Model Searches:** Search filtering in the dashboard (`/api/logs?q=...`) executes entirely in-memory using JavaScript string matching (`includes()`). Input is **never** passed into raw SQL, preventing SQL Injection (SQLi).
- **Tool-Call Sanitation:** Non-function tool calls (e.g. `web_search_call`, `local_shell`) are safely dropped before forwarding to ensure zero unauthorized command execution.

### 2. Encryption at Rest (AES-256-GCM)
- Stored provider credentials are encrypted using **AES-256-GCM** with 16-byte random initialization vectors (IV) and pinned 16-byte authentication tags.
- Development key files are created atomically with restrictive permissions (`0600` owner-only access).
- Keys are masked in UI and logs, revealing at most the last 2–4 characters.

### 3. SSRF Protection (`url-guard.ts`)
- Outbound requests for custom endpoints are verified against an SSRF protection suite.
- Explicitly blocks cloud metadata endpoints (AWS IMDSv2 `169.254.169.254`, Google `metadata.google.internal`, Alibaba, Oracle).
- Blocks HTTP redirect-following to avert DNS rebinding and redirect bypasses.

---

## 📊 Feature Comparison

| Feature | Free LLM API | LiteLLM | OpenRouter | Direct Provider SDKs |
| :--- | :---: | :---: | :---: | :---: |
| **Cost** | **100% Free** | Free / Paid | Pay-per-token | Free-tier limits |
| **Multi-Provider Aggregation** | ✅ 34+ Providers | ✅ | ✅ | ❌ Single provider |
| **Automatic 429 Failover** | ✅ Real-time | ⚠️ Manual config | ❌ | ❌ Manual |
| **Zero-Config Web Dashboard** | ✅ Built-in | ⚠️ Complex setup | ✅ Hosted | ❌ |
| **AES-256 Encrypted Key Storage** | ✅ Yes | ❌ Plaintext env | ⚠️ Cloud-stored | ❌ |
| **Desktop App (Win/Mac/Linux)** | ✅ Included | ❌ | ❌ | ❌ |
| **MCP (Model Context Protocol)** | ✅ Native | ⚠️ Addon | ❌ | ❌ |

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (Recommended)

Run the containerized gateway with persistent local storage:

```bash
# 1. Clone repository
git clone https://github.com/PryxIntel/free-llm-api.git
cd free-llm-api

# 2. Copy sample environment
cp .env.example .env

# 3. Start containers in background
docker compose up -d
```

Open **`http://localhost:3001`** in your browser to access the control panel.

---

### Option 2: Local Node.js Installation

**Requirements:** Node.js `>= 20.18.0` and npm `>= 10.0.0`

```bash
# 1. Clone repository
git clone https://github.com/PryxIntel/free-llm-api.git
cd free-llm-api

# 2. Install dependencies
npm install

# 3. Generate a secure encryption key
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))" >> .env

# 4. Initialize database schema
npm run db:migration:up

# 5. Launch development server (backend + web client)
npm run dev
```

---

### Option 3: Desktop Application

Build and run the desktop application with native system tray integration:

```bash
# Development mode
npm run desktop:dev

# Build distributable installer
npm run desktop:dist:win      # Windows (.exe installer)
npm run desktop:dist:mac:x64  # macOS (.dmg)
npm run desktop:dist:linux    # Linux (.AppImage, .deb)
```

---

## 💻 Client Integrations

Point any OpenAI-compatible client library or tool to your local Free LLM API instance:

### OpenAI Python SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="your-unified-api-key"
)

response = client.chat.completions.create(
    model="auto",  # 'auto' intelligently picks the highest-speed free provider
    messages=[
        {"role": "system", "content": "You are an expert software engineer."},
        {"role": "user", "content": "Write a Python script for asynchronous web scraping."}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
```

---

### Node.js / TypeScript SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:3001/v1',
  apiKey: 'your-unified-api-key',
});

const completion = await openai.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Explain Redis caching strategies.' }],
});

console.log(completion.choices[0].message.content);
```

---

### cURL (Terminal)

```bash
curl http://localhost:3001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-unified-api-key" \
  -d '{
    "model": "auto",
    "messages": [
      {"role": "user", "content": "Hello! Which provider are you running on?"}
    ]
  }'
```

---

### AI Editors & Coding Agents

- **Cursor:** In Cursor settings under *OpenAI API Key*, toggle *Override OpenAI Base URL* to `http://localhost:3001/v1` and paste your unified key.
- **Claude Code:** Set `ANTHROPIC_BASE_URL=http://localhost:3001` and pass your unified key as `ANTHROPIC_API_KEY`.
- **Cline / Roo Code:** Select `OpenAI Compatible`, enter Base URL `http://localhost:3001/v1`, Model ID `auto`, and your key.

---

## 🔍 Search Capabilities & Grounding

Enable real-time Google search grounding by specifying the `google_search` tool:

```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    { "role": "user", "content": "What are the latest AI hardware announcements this week?" }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "google_search",
        "description": "Ground output with real-time web search"
      }
    }
  ]
}
```

The gateway translates this tool directly into Google Gemini's native search grounding mechanism, returning authoritative search citations without executing local scrapers.

---

## ⚙️ Configuration & Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3001` | Local port for gateway and dashboard |
| `HOST` | `::` | Host binding (`127.0.0.1` for loopback, `0.0.0.0` for local LAN) |
| `ENCRYPTION_KEY` | *(auto in dev)* | 64-character hex key for AES-256-GCM credential encryption |
| `FREEAPI_DB_PATH` | `./data/freellmapi.sqlite` | SQLite database file location |
| `PROXY_RATE_LIMIT_RPM` | `120` | Maximum requests per minute allowed per IP |
| `FREEAPI_BLOCK_PRIVATE_PROVIDER_URLS` | `false` | Enable to block private network IPs (SSRF hardening) |
| `TRUST_PROXY` | `false` | Enable when running behind Nginx or Cloudflare reverse proxy |

---

## 📦 Pushing to GitHub

To push this repository to your GitHub account (`PryxIntel`):

```bash
# 1. Update remote to the new SEO-optimized repository slug:
git remote set-url origin https://github.com/PryxIntel/free-llm-api.git

# 2. Stage and commit your changes:
git add .
git commit -m "feat: SEO-optimized repository launch for PryxIntel"

# 3. Push to your GitHub repository:
git branch -M main
git push -u origin main
```

---

## 📄 License & Open Source Compliance

This project is licensed under the **MIT License**.

Under the terms of the MIT License, you are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software. The original copyright notice is retained in [`LICENSE`](./LICENSE).

**Project Maintainer & Author:** [@PryxIntel](https://github.com/PryxIntel)
