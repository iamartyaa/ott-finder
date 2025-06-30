# 🎬 Where Can I Watch?

A simple, fast and beautiful web app to search for movies or shows and see where they're streaming in India — Netflix, Prime Video, Disney+ Hotstar, and more.

Built with **Next.js + Tailwind CSS + Watchmode API**.

---

## 🔍 Features

- 🎞️ Search movies and TV shows in real time
- 🇮🇳 Shows only Indian availability
- 🛠️ Shows platforms with tag (SUB / RENT / BUY / FREE)
- ⚡ In-memory caching to save API calls
- 🌀 Loading spinners for smooth UX
- 📱 Mobile-first responsive UI

---

## 📸 Preview

<img src="public/screenshot.png" alt="App screenshot" width="100%">

---

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend (API Routes):** Serverless API using `/pages/api`
- **API:** [Watchmode API](https://www.watchmode.com/api/)
- **Deployment:** Vercel

---

## ⚙️ Setup & Run Locally

```bash
git clone https://github.com/yourusername/ott-finder.git
cd ott-finder
npm install

1. Add your Watchmode API key:
Create a .env.local file:

ini
Copy
Edit
WATCHMODE_API_KEY=your_api_key_here
2. Start development server:
npm run dev
Then open http://localhost:3000

🧠 API Limits
Free tier on Watchmode: ~500 requests/day

In-memory cache avoids unnecessary calls

Poster fetching disabled (to reduce usage)

💡 Future Ideas
Add poster images

Group platforms by access type

Add trending section

Add genre filters

Deploy PWA / mobile app

📦 License
MIT – Free to use & share

🙌 Acknowledgements
Watchmode API

Tailwind CSS

Built as a hobby by Amartya Yadav
