# Nuha Web

A web app built with Nuxt 3 for analyzing text and files for hate-speech detection in Arabic dialects.

## Features

- **Multilingual**: English, Arabic, French, and Central Kurdish with automatic direction detection
- **Authentication**: Magic link (passwordless), GitHub OAuth, and Google OAuth are set up
- **Data Analysis**: File upload and text analysis capabilities with AI integration
- **Modern UI**: Built with Tailwind CSS
- **Docker Ready**: Full Docker setup for development and production
- **Responsive Design**: Works on all device sizes
- **Geolocation**: Automatic region detection using IP address with manual fallback and optional URL routing (e.g., `/en/egy`)

## Prerequisites

- Node.js 22+
- Yarn package manager
- Docker & Docker Compose (optional)
- Strapi CMS (see CMS Setup section)

## Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/jordanopensrouce/nuha-web.git
   cd nuha-web
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section below)
   ```

4. **Start development server**

   ```bash
   yarn dev
   ```

   Visit `http://localhost:3000`

### Docker Development

1. **Environment setup**

   ```bash
   cp .env.example .env
   # Configure your .env file
   ```

2. **Start with Docker Compose**

   ```bash
   docker compose --profile dev up --build
   ```

   This starts both the Nuxt app and Redis server.

## Environment Variables

### Required Variables

```bash
# Session Security (REQUIRED - must be 32+ characters)
NUXT_SESSION_PASSWORD=your-secure-session-password-with-at-least-32-characters

# Strapi CMS (REQUIRED for content)
NUXT_API_PARTY_ENDPOINTS_CMS_URL=http://localhost:1337

# Optional if your CMS content is public
NUXT_API_PARTY_ENDPOINTS_CMS_TOKEN=your-strapi-token

# Optional - default is /api
NUXT_PUBLIC_CMS_PREFIX=/api

# Base URL
NUXT_PUBLIC_BASE_URL=http://localhost:3000 # (default value)
```

### OAuth Configuration (Optional)

This is important for oAuth to work.

```bash
# GitHub OAuth
NUXT_OAUTH_GITHUB_CLIENT_ID=your-github-client-id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth
NUXT_OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Login Options Configuration (Optional)

Control which authentication methods are available to users. All methods are enabled by default.

```bash
# Login Options Visibility (set to 'false' to hide, enabled by default)
NUXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NUXT_PUBLIC_AUTH_GITHUB_ENABLED=true
NUXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
```

### Additional Services (Optional)

```bash
# Redis (automatically configured in docker-compose.yml)
# This is important to store the login tokens.
# If not configured, it'll fallback to in-server memory (use only for local dev)
NUXT_REDIS_HOST=localhost
NUXT_REDIS_PORT=6379
NUXT_REDIS_PASSWORD=
NUXT_REDIS_DB=0

# Email Service (Listmonk)
# Important to send the magic login link email.
NUXT_LISTMONK_URL=http://localhost:9000 # without /api/
NUXT_LISTMONK_USER=username
NUXT_LISTMONK_TOKEN=token
NUXT_LISTMONK_LIST_ID=
NUXT_LISTMONK_EN_TEMPLATE_ID=
NUXT_LISTMONK_AR_TEMPLATE_ID=
NUXT_LISTMONK_FR_TEMPLATE_ID=
NUXT_LISTMONK_CKB_TEMPLATE_ID=

# AI Analysis
# AI Model URL: important to analyze the text and files.
NUXT_AI_MODEL_URL=your-ai-endpoint

# Default AI Model/Region for initial selection (optional)
# Sets the default AI model dialect
# Must match a supported region code from your the CMS (e.g., 'egy' for Egyptian model)
NUXT_PUBLIC_AI_MODEL_DEFAULT_REGION=egy
```

## CMS Setup

This application requires **Strapi CMS** for content management:

1. **Clone and setup Strapi CMS**

   ```bash
   git clone https://github.com/jordanopensource/nuha-cms.git
   cd nuha-cms
   # Follow the setup instructions in the CMS repository
   ```

2. **Configure Strapi connection**
   - Set `NUXT_API_PARTY_ENDPOINTS_CMS_URL` in your `.env` file (e.g., `http://localhost:1337`)
   - Either set `NUXT_API_PARTY_ENDPOINTS_CMS_TOKEN` with your API token **OR** make content publicly accessible in Strapi admin panel

3. **Content types required**
   - Publications
   - Categories
   - Regions
   - Authors
   - about-page
   - privacy-policy
   - terms-of-service
   - Other content as defined in the CMS

## OAuth Setup

### GitHub OAuth

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - **Homepage URL**: `http://localhost:3000` (or your domain)
   - **Callback URL**: `http://localhost:3000/auth/github`
3. Add credentials (client ID and client secret) to `.env`

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project and enable Google+ API
3. Create OAuth 2.0 credentials:
   - **Authorized origins**: `http://localhost:3000` (or your domain)
   - **Redirect URIs**: `http://localhost:3000/auth/google`
4. Add credentials (client ID and client secret) to `.env`

## Docker Deployment

### Development Environment

```bash
# Start development with hot reload
docker compose --profile dev up --build

# View logs
docker compose logs -f nuha-web-dev
```

### Production Environment

```bash
# Build and start production
docker compose --profile prod up --build -d

# View logs
docker compose logs -f nuha-web-prod
```

### Services Included

- **Nuxt App**: Main application (port 3000)
- **Redis**: Session storage and caching (port 6379)
- **Health Checks**: Automatic service monitoring

## Available Scripts

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build

# Docker
docker compose --profile dev up     # Development environment
docker compose --profile prod up    # Production environment
docker compose down                 # Stop all services
```

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [PrimeVue](https://primevue.org/datatable) (for the DataTable Component)
- **Authentication**: [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils/)
- **Caching**: [Redis](https://hub.docker.com/_/redis/)
- **Internationalization**: [@nuxtjs/i18n](https://i18n.nuxtjs.org/)
- **Charts**: [Chart.js](https://www.chartjs.org/) + [vue-chartjs](https://vue-chartjs.org/)
- **File Processing**: [xlsx](https://git.sheetjs.com/sheetjs/sheetjs)
- **Icons**: [Nuxt Icon](https://nuxt.com/modules/icon) (MDI, Circle Flags)

## Project Structure

```text
├── components/          # Vue components
├── pages/              # Application pages with i18n routing
├── server/             # API routes and server-side logic
├── middleware/         # Route middleware (auth, geolocation)
├── composables/        # Vue composables
├── i18n/              # Translation files
├── assets/            # Static assets (CSS, fonts, images)
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Troubleshooting

### Common Issues

1. **CORS Errors with Avatars**: The app includes an avatar proxy solution
2. **Strapi Connection**: Ensure Strapi is running, URL is correct, and token is correct (or content is public)
3. **Redis Connection**: Redis is auto-configured in Docker Compose
4. **OAuth Redirect**: Verify callback URLs match your domain

### Getting Help

Check the application logs:

```bash
# Local development
yarn dev

# Docker development
docker compose logs nuha-web-dev

# Docker production
docker compose logs nuha-web-prod
```
