# Vision Board

Pin images that show where you are headed. Analyze the board with GPT-4o, then get a short, concrete checklist of what to do next.

Live: [vision-board-ruby.vercel.app](https://vision-board-ruby.vercel.app)

## Local

```bash
npm install
npm run dev -- -p 3100
```

Copy `.env.local` with `OPENAI_API_KEY` for real vision + checklist generation. Without a key, the app still runs using template copy.

There is no auth or persistence yet — the board lives in the browser for the session.
