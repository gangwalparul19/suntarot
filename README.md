# ☀️ Sun Tarot

A mystical tarot reading website with beautiful dark theme and interactive features.

## 🌟 Features

- **Daily Reading** - Interactive 3-card Past/Present/Future spread
- **Learn Tarot** - Browse all 22 Major Arcana cards
- **Spreads Guide** - Visual guide to popular tarot layouts
- **FAQ** - Common questions about tarot
- **Book a Reading** - Pricing with WhatsApp booking

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Click "Deploy" - No build settings needed!

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (run from project folder)
vercel

# Follow the prompts
```

### Option 3: Drag & Drop

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag and drop this entire folder
3. Done!

## 📁 Project Structure

```
suntarot/
├── index.html      # Home page
├── reading.html    # Interactive 3-card spread
├── learn.html      # Card gallery
├── spreads.html    # Spreads guide
├── faq.html        # FAQ
├── booking.html    # Pricing
├── privacy.html    # Privacy policy
├── terms.html      # Terms of service
├── 404.html        # Error page
├── css/
│   └── style.css   # All styles
└── js/
    ├── cards.js    # Card data
    └── main.js     # Interactivity
```

## 🔧 Local Development

Just open `index.html` in your browser - no build step required!

Or use a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

## 📝 License

© 2025 Sun Tarot. All rights reserved.
