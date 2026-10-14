<div align="center">

# Automation Builder

**Workflow automation SaaS that connects Discord, Slack, Notion and Google Drive through a visual drag-and-drop editor.**

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#features) · [Architecture](#architecture) · [Getting Started](#getting-started) · [Integrations](#integrations) · [Roadmap](#roadmap) · [Author](#author)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Local Webhook Tunneling](#local-webhook-tunneling)
  - [Running the App](#running-the-app)
- [Integrations](#integrations)
- [Billing and Credits](#billing-and-credits)
- [Key Design Decisions](#key-design-decisions)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

Saas Automation is a full stack automation platform in the spirit of Zapier. Users connect their productivity apps, build workflows on a node-based canvas, and let Saas Automation run them automatically when something changes, for example posting a Slack or Discord message when a file is updated in Google Drive.

The project is built end to end without third-party integration SDKs. Every OAuth flow, scope, endpoint and webhook is implemented directly against each provider's REST API, which keeps full control over integration behavior.

---

## Features

**Workflow Editor**
- Drag-and-drop canvas built on React Flow with zoom, pan and custom connection handles
- Trigger and action nodes with validated connections
- Save, publish and disable workflows
- Resizable panels, modals and drawers for node configuration

**Integrations**
- Google Drive: change notifications through the Drive watch API
- Slack: message sending and channel selection
- Discord: webhook-based message sending
- Notion: OAuth connection and page updates
- Dynamic message templates with data "chips" pulled from connected apps

**Authentication and Accounts**
- Google sign-in and session management through Clerk
- Clerk webhooks keep the database in sync with user lifecycle events
- Protected routes and per-user connection management

**Billing**
- Stripe subscriptions with Free, Pro and Unlimited tiers
- Credit-based usage: each workflow run consumes credits
- Workflows are blocked when credits run out, with an upgrade prompt

**Interface**
- Responsive layout with dark and light mode
- Animated landing page, sidebar navigation, carousels and 3D pricing cards
- Built with ShadCN UI, Aceternity UI and Tailwind CSS

---

## Tech Stack

| Layer              | Technology                                   |
|--------------------|----------------------------------------------|
| Framework          | Next.js 14 (App Router)                      |
| Styling            | Tailwind CSS, ShadCN UI, Aceternity UI       |
| Workflow Canvas    | React Flow                                   |
| State Management   | React Context with reducers, Zustand         |
| Database           | PostgreSQL (Neon) with Prisma ORM            |
| Authentication     | Clerk                                        |
| Payments           | Stripe                                       |
| File Uploads       | Uploadcare                                   |
| HTTP Client        | Axios                                        |
| Runtime            | Bun                                          |
| Dev Tunneling      | ngrok                                        |

---

## Architecture

```mermaid
flowchart LR
    User[User] --> UI[Next.js Frontend]
    UI --> Editor[React Flow Editor]
    UI --> API[Next.js API Routes]
    API --> Clerk[Clerk Auth]
    API --> DB[(PostgreSQL / Prisma)]
    API --> Stripe[Stripe Billing]
    Clerk -->|webhook| API
    Stripe -->|webhook| API
    Drive[Google Drive] -->|change notification| API
    API --> Engine[Workflow Runner]
    Engine --> Slack[Slack API]
    Engine --> Discord[Discord Webhooks]
    Engine --> Notion[Notion API]
    Engine -->|deduct credits| DB
```

### Execution Flow

1. A user connects an app through OAuth, and the token is stored against their account.
2. The user builds a workflow on the canvas and publishes it.
3. Publishing registers a listener (for example a Google Drive watch channel).
4. When the provider detects a change, it sends a notification to the public webhook URL.
5. The backend finds the matching published workflows, checks the user's credits, and runs each action in order.
6. Credits are deducted and the result is recorded.

---

## Project Structure

The layout below is indicative and uses Next.js route groups to separate concerns.

```text
Saas Automation/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/              # Sign-in and sign-up pages
│   │   ├── (main)/
│   │   │   ├── (pages)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── connections/
│   │   │   │   ├── workflows/
│   │   │   │   │   └── editor/[...editorId]/
│   │   │   │   ├── billing/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx
│   │   ├── (landing)/           # Marketing pages
│   │   └── api/
│   │       ├── auth/            # Clerk webhook
│   │       ├── drive/           # Drive watch and notifications
│   │       ├── payment/         # Stripe checkout and webhook
│   │       └── oauth/           # Slack, Discord, Notion callbacks
│   ├── components/
│   │   ├── ui/                  # ShadCN components
│   │   └── global/
│   ├── providers/               # Context providers and reducers
│   ├── store/                   # Zustand stores
│   └── lib/
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0 or later (Node.js 18+ also works)
- PostgreSQL database (a free [Neon](https://neon.tech) project is sufficient)
- [Clerk](https://clerk.com) application
- [Stripe](https://stripe.com) account in test mode
- Developer apps for Google Cloud, Slack, Discord and Notion
- [Uploadcare](https://uploadcare.com) project
- [ngrok](https://ngrok.com) account for local webhooks

### Installation

```bash
git clone https://github.com/your-username/Saas Automation.git
cd Saas Automation
bun install
cp .env.example .env
```

### Environment Variables

Fill in `.env` with your own credentials. The names below are examples; keep them consistent with your code.

```bash
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Stripe
STRIPE_SECRET=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Google OAuth and Drive
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Slack
NEXT_PUBLIC_SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_REDIRECT_URI=

# Discord
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=

# Notion
NOTION_CLIENT_ID=
NOTION_API_SECRET=
NOTION_REDIRECT_URI=

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=

# Public URL used for webhooks (ngrok in development)
NGROK_URI=
NEXT_PUBLIC_URL=
```

> **Security:** Never commit `.env`. Rotate any key that has been exposed.

### Database Setup

```bash
bunx prisma generate
bunx prisma db push
```

Use `bunx prisma studio` to inspect data locally.

### Local Webhook Tunneling

Google Drive, Clerk and Stripe need a public HTTPS URL to deliver webhooks. Expose your local server with ngrok:

```bash
ngrok http 3000
```

Copy the generated HTTPS URL into `NGROK_URI` and into the webhook settings of Clerk, Stripe and your OAuth redirect URIs.

### Running the App

```bash
bun dev
```

The app is available at `http://localhost:3000`.

---

## Integrations

| Provider     | Auth Method               | Capability                                  |
|--------------|---------------------------|---------------------------------------------|
| Google Drive | OAuth 2.0 via Clerk       | Watch API for file change notifications     |
| Slack        | OAuth 2.0                 | List channels, post messages                |
| Discord      | OAuth 2.0 and webhooks    | Post messages to selected channels          |
| Notion       | OAuth 2.0                 | Connect workspace, write to pages           |

### OAuth Checklist

For each provider, make sure that:

- The redirect URI in the provider dashboard exactly matches your environment variable
- All required scopes are requested
- The app is installed or authorized in the target workspace or server
- The token is stored against the correct user record

---

## Billing and Credits

| Plan      | Description                                  |
|-----------|----------------------------------------------|
| Free      | Limited credits for trying the platform      |
| Pro       | Larger credit allowance, billed recurring    |
| Unlimited | Highest allowance, billed recurring          |

How it works:

1. The user selects a plan, and a Stripe Checkout session is created.
2. Stripe confirms payment through a webhook, and credits are granted.
3. Each workflow execution deducts credits.
4. When credits reach zero, execution is blocked and an upgrade prompt is shown.

Use Stripe test cards and the Stripe CLI to forward webhooks during development.

---

## Key Design Decisions

- **Direct REST integrations instead of SDKs.** Gives full control over OAuth flows, scopes, tokens and webhook registration, and avoids abstraction limits when debugging.
- **Context with reducers for editor state.** Keeps node, edge and selection updates granular and predictable, with Zustand used for smaller independent slices.
- **Clerk for identity.** Offloads session handling and multi-provider login, with webhooks keeping the local database consistent.
- **Credit-based metering.** Ties usage directly to cost and gives a clear upgrade path.
- **Route groups in the App Router.** Separates auth, marketing and dashboard layouts without affecting URLs.

---

## Troubleshooting

| Problem                          | Likely Cause                                  | Resolution                                              |
|----------------------------------|-----------------------------------------------|---------------------------------------------------------|
| OAuth redirect mismatch          | Redirect URI differs from provider settings   | Match the URI exactly, including protocol and path      |
| Webhooks not received locally    | ngrok URL changed or not registered           | Restart ngrok and update webhook URLs                   |
| Slack message fails              | Bot not in the channel or missing scope       | Invite the bot and re-authorize with required scopes    |
| `429 Too Many Requests`          | Provider rate limit reached                   | Add retry with backoff and reduce polling               |
| Drive notifications stop         | Watch channel expired                         | Renew the watch channel before expiry                   |
| Prisma client errors             | Client out of date                            | Run `bunx prisma generate` and restart the server       |
| UI component bug after install   | Incompatible library version                  | Pin or downgrade the affected package                   |

---

## Roadmap

- [x] Authentication and user sync
- [x] Visual workflow editor
- [x] Google Drive, Slack, Discord and Notion integrations
- [x] Stripe subscriptions and credit system
- [ ] Scheduled workflows using cron triggers through an external scheduler
- [ ] Conditional logic and branching nodes
- [ ] Execution history and run logs
- [ ] Retry policy and error notifications
- [ ] Additional integrations
- [ ] Automated tests and CI pipeline

---

## Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org) (`git commit -m "feat: add your feature"`)
4. Push the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## Author

**Talha Iqbal**
WordPress Developer, SEO Specialist and Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-ItsTalhaIqbal-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ItsTalhaIqbal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-itstalha--iqbal-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/itstalha-iqbal)
[![Portfolio](https://img.shields.io/badge/Portfolio-talha--iqbal.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://talha-iqbal.vercel.app)

<div align="center">

If you find this project useful, consider giving the repository a star.

</div>
