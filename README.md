# AstroKnowledge

Full-stack Vedic astrology website for **Seema Lohiya** — founder and chief astrologer.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **Backend:** Next.js API Routes with JSON file store (`data/`)
- **Auth:** JWT cookies

## Project Structure

```
├── data/              # Runtime JSON persistence (bookings, orders, users, …)
├── public/images/     # Static assets (products, courses, branding)
├── scripts/           # Build utilities (image compression)
└── src/
    ├── app/           # Pages & API routes (App Router)
    │   ├── api/       # REST endpoints
    │   ├── admin/     # Admin dashboard
    │   └── dashboard/ # User dashboard
    ├── components/    # UI by feature (home, layout, cart, …)
    └── lib/           # Stores, auth, i18n, static seed data
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Maintenance Scripts

| Script | Purpose |
|--------|---------|
| `npm run clean` | Remove `.next` build cache (~4 GB after long dev sessions) |
| `npm run compress-images` | Optimize images in `public/images/` |
| `npm run slim` | Clean cache + compress images |

## Demo Credentials

| Role  | Email                      | Password  |
|-------|----------------------------|-----------|
| Admin | admin@astroknowledge.com   | admin123  |
| User  | user@demo.com              | user123   |

## Pages

- **Public:** Home, Services, Products, Courses, Pooja, Booking, About, Contact
- **User Dashboard:** Overview, Bookings, Orders, Profile, Purchases
- **Admin:** Stats, Bookings, Orders, Catalog, Content, Users, Payments
- **Policies:** Terms, Privacy, Shipping, Refund

## Disk Usage

| Folder | Typical size | Notes |
|--------|--------------|-------|
| `node_modules/` | ~450 MB | Run `npm install` after clone |
| `public/` | ~15–40 MB | Run `npm run compress-images` to shrink |
| `.next/` | 0–4 GB | Dev cache; gitignored — run `npm run clean` |
| Source + data | ~1 MB | Committed project code |

**Tracked repo size** (without `node_modules` and `.next`) is well under 200 MB.

## Coming Soon

- Database integration (PostgreSQL/MongoDB)
- Payment gateway (Razorpay/Stripe)
- Blog, Rashifal, Reports, Tools pages
