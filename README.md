# Beginner Pantry Recipes

English SEO tool site for beginner cooks. The MVP includes a pantry photo ingredient analyzer, editable ingredient list, recipe generator, 20 long-tail SEO pages, JSON-LD, sitemap, robots, privacy, terms, and llms.txt.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zod
- DashScope OpenAI-compatible Chat Completions
- Vitest

## Local Setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

```powershell
$env:DASHSCOPE_API_KEY="your-key"
$env:DASHSCOPE_BASE_URL="https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
$env:DASHSCOPE_MODEL="qwen3.5-flash"
$env:NEXT_PUBLIC_SITE_URL="https://beginnerpantryrecipes.com"
```

## Checks

```powershell
npm run lint
npm run test
npm run build
```

## Routes

- `/`
- `/api/analyze-ingredients`
- `/api/generate-recipe`
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- `/privacy`
- `/terms`
- 20 static SEO routes under the paths defined in `src/lib/seo-pages.ts`
