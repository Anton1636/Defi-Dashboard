# Screenshots
<img width="1907" height="862" alt="image" src="https://github.com/user-attachments/assets/9a766dc8-df00-4c16-8294-e58bc95ef36a" />
<img width="1918" height="854" alt="image" src="https://github.com/user-attachments/assets/e126a0d0-65c3-4f53-9b57-0c2704c90185" />


# NEXORA — Liquidity Galaxy

> **Your DeFi portfolio, all in one place.**  
> Track positions across Uniswap, Aave and Compound. Real-time prices, AI insights, multi-chain support.

![NEXORA Portfolio Desktop](./public/screenshots/desktop.png)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-purple)](./public/manifest.json)

---

## Live Demo

http://defi-dashboard-topaz-phi.vercel.app/

| Mode        | Access                           |
| ----------- | -------------------------------- |
| Demo wallet | Sign in with Google → `demo.eth` |
| Real wallet | MetaMask → Ethereum Mainnet      |
| Testnet     | MetaMask → Sepolia               |

Demo includes: $24,850 mock portfolio · 3 active positions · all features unlocked

---

## What Makes NEXORA Different

Most DeFi dashboards are data viewers. NEXORA is a **financial operating system** — it not only shows your positions but explains them, warns you about risks, and helps you optimize.

---

## Tech Stack

| Layer         | Technology                               |
| ------------- | ---------------------------------------- |
| Framework     | Next.js 15 (App Router, RSC)             |
| Language      | TypeScript (strict mode)                 |
| Styling       | CSS Custom Properties (design tokens)    |
| UI State      | Zustand                                  |
| Server State  | TanStack Query v5                        |
| Web3          | RainbowKit + wagmi + viem                |
| Auth          | Auth.js v5 (SIWE + Google OAuth)         |
| Database      | PostgreSQL + Prisma 7                    |
| AI            | Gemini API (3-model fallback chain)      |
| Charts        | Recharts                                 |
| API           | GraphQL (Yoga) + REST                    |
| RPC           | Infura (5 chains)                        |
| External APIs | GeckoTerminal (pools), GoPlus (security) |
| PWA           | Service Worker + Web App Manifest        |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop (PostgreSQL)
- [Infura](https://infura.io) account (free)
- [Google Cloud](https://console.cloud.google.com) OAuth credentials
- [WalletConnect](https://cloud.walletconnect.com) project ID (free)

### 1. Clone & Install

```bash
git clone https://github.com/Anton1636/Defi-Dashboard.git
cd Defi-Dashboard
npm install
```

### 2. Environment Setup

Create `.env.local` in the project root:

```env
# ─── Database ───────────────────────────────────────
# PostgreSQL via Docker (see docker-compose.yml)
DATABASE_URL="postgresql://user:password@localhost:5432/defi_dashboard"

# ─── Auth ───────────────────────────────────────────
# Generate: openssl rand -base64 32
AUTH_SECRET="your-32-char-secret"

# Google OAuth: console.cloud.google.com → Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ─── Blockchain ─────────────────────────────────────
# Infura: infura.io → Create project → Project ID
NEXT_PUBLIC_INFURA_API_KEY="your-infura-key"

# WalletConnect: cloud.walletconnect.com → New Project
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-id"

# ─── AI ─────────────────────────────────────────────
# Gemini: aistudio.google.com → Get API key (free tier)
GEMINI_API_KEY="your-gemini-key"

# ─── App ────────────────────────────────────────────
# true = mock portfolio data (no wallet needed)
# false = real on-chain data (requires mainnet wallet)
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

### 3. Database

```bash
# Start PostgreSQL
docker compose up -d

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 4. Run

```bash
npm run dev
# → http://localhost:3001
```

# GitHub Actions Setup

## Required Secrets

Go to: Settings → Secrets and variables → Actions → New repository secret

### For CI (required):

| Secret                                 | How to get                |
| -------------------------------------- | ------------------------- |
| `AUTH_SECRET`                          | `openssl rand -base64 32` |
| `NEXT_PUBLIC_INFURA_API_KEY`           | infura.io → Project ID    |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | cloud.walletconnect.com   |
| `GEMINI_API_KEY`                       | aistudio.google.com       |
| `GOOGLE_CLIENT_ID`                     | console.cloud.google.com  |
| `GOOGLE_CLIENT_SECRET`                 | console.cloud.google.com  |

### For Vercel deployment (optional until Day 35):

| Secret              | How to get                      |
| ------------------- | ------------------------------- |
| `VERCEL_TOKEN`      | vercel.com → Settings → Tokens  |
| `VERCEL_ORG_ID`     | vercel.com → Settings → General |
| `VERCEL_PROJECT_ID` | vercel.com → Project → Settings |

### For Railway DB migration (optional until Day 35):

| Secret                    | How to get                         |
| ------------------------- | ---------------------------------- |
| `DATABASE_URL_PRODUCTION` | railway.app → PostgreSQL → Connect |

## Variables (not secrets)

Go to: Settings → Secrets and variables → Actions → Variables tab

| Variable        | Value                                        |
| --------------- | -------------------------------------------- |
| `VERCEL_ORG_ID` | Your Vercel org ID (enables preview deploys) |

## CI without secrets

CI will run typecheck + lint + build even without secrets configured.
Build uses `NEXT_PUBLIC_USE_MOCK_DATA=true` so no real credentials needed.

### 5. Sign In Options

| Method       | Requirements        | Portfolio data |
| ------------ | ------------------- | -------------- |
| Google OAuth | Google account      | Mock ($24,850) |
| MetaMask     | Extension + Sepolia | Mock (testnet) |
| MetaMask     | Extension + Mainnet | Real positions |

---

## Features

### 📊 Portfolio

- **Desktop** — analytics dashboard: portfolio chart, allocation cards, assets table, right AI panel
- **Mobile** — focus mode: orbital visualization, liquidity streams, position capsules, bottom nav
- Historical chart with 6 time ranges (24H / 7D / 30D / 90D / 1Y / ALL)
- Total vs Protocol comparison modes
- Real-time price ticker (WebSocket via Binance)

### 📍 Positions

- Uniswap V3 LP — fee tracking, in/out-of-range status, token prices
- Aave V3 — Health Factor bar, collateral/debt breakdown, supply/borrow rows
- Compound V3 — APR comparison, utilization rate
- Token Approval Scanner powered by GoPlus
- Filter by protocol with live counts

### ⚡ Analytics

- Real-time gas prices (Low / Normal / High) with mini sparklines
- Protocol-specific optimization suggestions
- Transaction Simulator — 6 types with gas estimation
- Impermanent Loss Visualizer + IL Calculator
- Gas-aware withdrawal cost estimates

### 🤖 AI Insights

- Gemini-powered analysis (Flash → Pro → Ultra fallback)
- Streaming responses with typing indicator
- 8 quick-action questions
- Analysis history saved to PostgreSQL
- PRO / SIMPLE mode toggle

### 🔔 Alerts

- 5 trigger types: Liquidation risk, LP out-of-range, Low gas, Price change, Fees ready to claim
- 4 severity levels: Critical / Warning / Info / Success
- Auto-refresh every 30 seconds
- Per-alert read state + Mark all read
- Animated red badge on sidebar

### 📈 Portfolio Historical Chart

- Deterministic seeded generation (no `Math.random` in render — React 18 compliant)
- AreaChart (total) + LineChart (per-protocol comparison)
- Hover to inspect any data point
- Change % calculation from range start

### ⚖️ Wallet Compare

- Side-by-side comparison of any two wallets
- 8 metrics: Total Value, 24h Change, Positions, Best APY, Health Factor, LP Fees, Risk Score, Protocols
- Crown (👑) winner detection per metric
- Visual bar comparison
- ENS name resolution
- AI-generated comparison summary

### 🛡 Risk Topology

- 2D orbital map — X axis = exposure size, Y axis = risk level
- 4 concentric zones: Safe / Moderate / High / Critical
- Hover tooltips per position
- Risk score formula per protocol (HF, IL, borrow ratio, concentration)
- Sidebar: breakdown bars, portfolio score, top risk, risk factors

### 🌡 Liquidity Heat Map

- Live pool data from GeckoTerminal API (no API key)
- 4+ chains: Ethereum, Arbitrum, Base, Polygon, Solana
- Lazy search — local filter → API fallback
- Your LP range overlay with dashed boundary
- Current price vertical line
- Peak liquidity zone detection
- Estimated daily fees per price bucket

### 📱 PWA

- Installable on iOS and Android (Web App Manifest)
- 3 cache strategies: API (network-first), static (cache-first), navigation (network-first)
- Offline detection banner
- Install prompt (beforeinstallprompt)
- Push notification infrastructure (sw.js)

---

## Data Flow

```
User Wallet (MetaMask / WalletConnect)
         │
         ▼
   RainbowKit + wagmi
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Infura RPC   Auth.js v5
(on-chain)   (session)
    │         │
    ▼         ▼
Portfolio  PostgreSQL
  API      (AI history,
(mock or    user data)
  real)
    │
    ▼
TanStack Query (cache + dedupe)
    │
    ▼
Zustand (UI state: sidebar, theme)
    │
    ▼
React Components (streaming, memoized)
```

---

## AI Architecture

```
User query
    │
    ▼
Gemini 1.5 Flash  ──────────────────────┐
    │ fails?                             │
    ▼                                   │
Gemini 1.5 Pro  ────────────────────┐   │
    │ fails?                         │   │
    ▼                                │   │
Gemini 1.0 Ultra                    │   │
    │                                │   │
    └────────────────────────────────┘   │
    │                                    │
    ▼                                    │
Streaming response → UI              Cached
    │                               response
    ▼
Saved to PostgreSQL
(userId, prompt, response, tokens)
```

**Why deterministic?** `temperature: 0` ensures consistent portfolio scores across re-runs. Base64 hash caching prevents duplicate API calls for identical inputs.

---

## Security Model

> NEXORA is a **read-only** application. It never requests transaction signing unless explicitly triggered by the user.

| Aspect             | Implementation                                                 |
| ------------------ | -------------------------------------------------------------- |
| Private keys       | Never leave the browser — handled entirely by wallet extension |
| Session            | Auth.js v5 with SIWE — signed message, not a password          |
| API keys           | Server-side only — never exposed to client                     |
| Token approvals    | GoPlus API scans for risky contracts before display            |
| Address validation | Regex + ENS resolution before any API call                     |
| Secrets            | `.env.local` — not committed to git                            |
| RPC calls          | Read-only (`eth_call`, `eth_getLogs`) — no write operations    |

---

## Protocol Integration Details

### Uniswap V3

- Position data via mock (mainnet: subgraph or NFT Manager contract)
- In-range detection: `currentTick >= tickLower && currentTick <= tickUpper`
- Fee calculation: `feeGrowthInside * liquidity / 2^128`
- Liquidity Heat Map: gaussian approximation (real: tick bitmap from subgraph)

### Aave V3

- Health Factor: `totalCollateralETH * avgLiquidationThreshold / totalDebtETH`
- Liquidation threshold: `< 1.0` = liquidatable, `< 1.5` = warning
- Net APY: `supplyAPY - borrowAPY * (debt/collateral)`

### Compound V3

- Utilization: `totalBorrows / totalSupply`
- Supply APR: `utilizationRate * kink * multiplier`
- Borrow APR: supply side + reserve factor

---

## Gas Strategy

NEXORA recommends transaction timing based on network conditions:

| Gas Level | Threshold  | Recommendation                |
| --------- | ---------- | ----------------------------- |
| 🟢 Low    | < 15 gwei  | All operations — optimal time |
| 🟡 Normal | 15–30 gwei | Standard operations only      |
| 🔴 High   | > 30 gwei  | Delay unless liquidation risk |

Estimated costs shown for: Uniswap swap, Aave supply/repay, Compound supply, ERC-20 transfer.

---

## Supported Networks

| Chain            | Status     | Uniswap V3 Factory                           |
| ---------------- | ---------- | -------------------------------------------- |
| Ethereum Mainnet | ✅ Live    | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Arbitrum One     | ✅ Live    | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Base             | ✅ Live    | `0x33128a8fC17869897dcE68Ed026d694621f6FDfD` |
| Optimism         | ✅ Live    | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Polygon          | ✅ Live    | `0x1F98431c8aD98523631AE4a59f267346ea31F984` |
| Sepolia          | ✅ Testnet | `0x0227628f3F023bb0B980b67D528571c95c6DaC1c` |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login — Google OAuth + SIWE
│   ├── (dashboard)/         # Protected routes (require session)
│   │   ├── portfolio/       # Desktop analytics + Mobile focus mode
│   │   ├── positions/       # Uniswap/Aave/Compound cards
│   │   ├── analytics/       # Gas + Simulator + IL Visualizer
│   │   ├── ai-insights/     # Gemini chat + history
│   │   ├── alerts/          # Alert feed with severity filters
│   │   ├── risk/            # Risk Topology 2D map
│   │   ├── liquidity/       # Liquidity Heat Map
│   │   ├── compare/         # Wallet comparison
│   │   ├── transactions/    # Transaction history
│   │   ├── approvals/       # Token approval manager
│   │   ├── watchlist/       # Saved addresses
│   │   └── settings/        # RPC, notifications, preferences
│   ├── api/                 # API routes (portfolio, gas, AI, auth)
│   ├── globals.css          # Design system — 50+ CSS tokens
│   └── layout.tsx           # Root layout + PWA meta
│
├── components/
│   ├── alerts/              # AlertFeed, AlertItem, AlertBadge
│   ├── analytics/           # GasWidget, GasSuggestions, ILVisualizer
│   ├── charts/              # PortfolioChart, LiquidityHeatMap
│   ├── compare/             # WalletCompare
│   ├── layout/              # Sidebar, TopBar, MobileNav, MobileDrawer
│   ├── orbital/             # OrbitalSystem, LiquidityStreams, PositionCapsule
│   ├── positions/           # UniswapCard, AaveCard, CompoundCard
│   ├── pwa/                 # ServiceWorkerRegistration, InstallBanner, OfflineBanner
│   ├── risk/                # RiskTopology, RiskScanner
│   ├── simulator/           # TransactionSimulator
│   └── ui/                  # Card, Badge, StatCell, SectionLabel (shared)
│
├── hooks/                   # useAlerts, useGas, useIsClient,
│                            # usePortfolio, usePWA, useUniswapPools, useWallet
├── lib/                     # alertEngine, chartData, gas, liquidityData,
│                            # riskEngine, walletCompare
├── store/                   # priceStore (Zustand), sidebarStore (Zustand)
└── types/                   # DeFiPosition, UniswapPosition, AavePosition, CompoundPosition
```

---

## Development Checklist

### Foundation & Architecture

| Item                             | Status                   |
| -------------------------------- | ------------------------ |
| Next.js 15 + strict TypeScript   | ✅                       |
| Path aliases (`@/`)              | ✅                       |
| ESLint + Prettier                | ✅                       |
| Environment validation           | ⚠️ Runtime only          |
| UI separated from business logic | ✅ hooks/ vs components/ |
| Global state (Zustand)           | ✅ sidebar, prices       |
| Server state (TanStack Query)    | ✅ portfolio, gas, AI    |

### Design System (all in `globals.css`)

| Token Type                   | Status                            |
| ---------------------------- | --------------------------------- |
| Colors (15 accent vars)      | ✅                                |
| Typography scale (8 sizes)   | ✅                                |
| Radius system (3 levels)     | ✅                                |
| Shadow / elevation model     | ✅                                |
| Surface hierarchy (4 levels) | ✅                                |
| Motion / 15+ animations      | ✅                                |
| Spacing scale (8px grid)     | ✅                                |
| 3 layout modes               | ✅ portfolio / analytics / action |

### Components

| Component            | Status |
| -------------------- | ------ |
| Card (with variants) | ✅     |
| Buttons              | ✅     |
| Inputs               | ✅     |
| Skeletons            | ✅     |
| Empty states         | ✅     |
| Tooltips             | ✅     |

### Web3

| Item                                  | Status        |
| ------------------------------------- | ------------- |
| Multi-wallet (MetaMask, WC, Coinbase) | ✅ RainbowKit |
| SIWE authentication                   | ✅ Auth.js v5 |
| 6 network configs                     | ✅            |
| Gas estimator                         | ✅            |
| Transaction simulator                 | ✅            |
| Token approval scanner                | ✅ GoPlus     |

### UX States

| State               | Status |
| ------------------- | ------ |
| Loading (skeletons) | ✅     |
| Empty               | ✅     |
| Error               | ✅     |
| Offline             | ✅ PWA |
| No wallet           | ✅     |

### Testing

| Type              | Status         |
| ----------------- | -------------- |
| Unit tests        | ❌ Post-deploy |
| Component tests   | ❌             |
| Integration tests | ❌             |

---

## Known Limitations

| Limitation           | Detail                                                               |
| -------------------- | -------------------------------------------------------------------- |
| **Mock data**        | Real data: set `NEXT_PUBLIC_USE_MOCK_DATA=false` + mainnet wallet    |
| **Liquidity ticks**  | Gaussian approximation — real tick data requires Uniswap subgraph    |
| **Solana LP range**  | Heat map shows depth only — no LP range overlay for non-EVM          |
| **MetaMask mobile**  | Requires browser extension — WalletConnect deep link works on mobile |
| **No unit tests**    | Planned after production deploy                                      |
| **320px breakpoint** | Not explicitly tested                                                |

---

**Lines of code breakdown** _(approximate)_:

- Components: ~8,000 lines
- Hooks + lib: ~1,500 lines
- API routes: ~800 lines
- Design system: ~600 lines

---

## Architecture Decisions

**Why Next.js instead of Vite?**  
Auth.js v5 requires server-side session handling and JWT signing. Next.js App Router provides API routes, RSC, and edge runtime in one framework without a separate backend.

**Why inline CSS + CSS variables instead of Tailwind?**  
CSS custom properties allow runtime theme switching and token inheritance that Tailwind's static classes cannot express. No purging issues with dynamic `rgba()` values computed at runtime.

**Why Gemini instead of OpenAI?**  
Generous free tier (1M tokens/day on Flash) sufficient for portfolio analysis. 3-model fallback chain guarantees availability. `temperature: 0` enables deterministic, cacheable responses.

**Why mock data first?**  
Allows complete UI development without mainnet gas costs or testnet unreliability. Single env variable switches to real data. Same API interface — zero component changes needed.

**Why Prisma 7?**  
Breaking changes from v6 required schema migration. v7 brings improved TypeScript inference and better relation handling for AI analysis history.

---

## License

MIT © 2024 [Anton1636](https://github.com/Anton1636)
