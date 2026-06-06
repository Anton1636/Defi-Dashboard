#Screenshots
<img width="1907" height="862" alt="image" src="https://github.com/user-attachments/assets/9a766dc8-df00-4c16-8294-e58bc95ef36a" />
<img width="1918" height="854" alt="image" src="https://github.com/user-attachments/assets/e126a0d0-65c3-4f53-9b57-0c2704c90185" />

##Link
http://defi-dashboard-topaz-phi.vercel.app/

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
