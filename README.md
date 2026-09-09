# 📜 Notary Passport

> **Slogan**: *"Verified once, trusted everywhere."*

**Notary Passport** is a single, verified, portable credential wallet and profile for Notaries Public across the United States and Canada. It enables notaries to upload and verify their credentials once, and share zero-knowledge verification profiles with signing services, title companies, law firms, and RON platforms.

---

## 🎨 Visual Brand Identity
Built 100% in accordance with the official **Notary Passport Brand Guidelines v1.0**:
- **Passport Navy (`#1B2A4A`)**: Primary headers, navigation, modal surfaces.
- **Ink (`#14181F`)**: High-contrast body text.
- **Paper Cream (`#F6F2E9`)**: Authentic document background surface & cards.
- **Foil Gold (`#B8924A`)**: Accents, verified marks, borders, and highlights.
- **Verified Green (`#3F6B4F`)**: Saturated verified status badges.
- **Oxblood (`#7A3B34`)**: Saturated expired status badges & rejection notes.
- **Typography**: Display headlines in `Fraunces` (serif); interface text in `IBM Plex Sans`.
- **Layout Motifs**: Square button edges (`rounded-none`), ledger-style card rules (`border-l-4`), and circular debossed seal mark (`<PassportSeal />`).

---

## 💻 Local Development Quickstart

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production Build & Typecheck**:
   ```bash
   npm run build
   ```

---

## 🚀 Free-Tier Production Deployment ($0/month)

### 1. Deploy Web App to Vercel ($0)
- Push code to GitHub repository.
- Connect repository to [Vercel.com](https://vercel.com).
- Click **Deploy** to get live HTTPS URL (`https://notary-passport.vercel.app`).

### 2. Set Up Supabase Database ($0)
- Create a free project on [Supabase.com](https://supabase.com).
- Go to SQL Editor -> Copy & Paste `supabase_schema.sql` -> Click **Run**.
- Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` into Vercel environment variables.

---

## 📂 Project Structure

```
Notary Passport/
├── index.html                        # HTML5 entrypoint with Google Fonts
├── package.json                      # React 18, TypeScript, Tailwind CSS, Lucide React
├── vite.config.ts                    # Vite config (Port 3000)
├── tailwind.config.js                # Brand color palette & typography
├── supabase_schema.sql               # 1-Click PostgreSQL Schema & Seed Data
├── src/
│   ├── main.tsx                      # App entrypoint
│   ├── App.tsx                       # View router & document preview modal
│   ├── index.css                     # Visa page styles & ledger cards
│   ├── types/index.ts                # TypeScript interfaces
│   ├── data/
│   │   ├── jurisdictions.ts          # Static US & CA rules lookup table
│   │   └── mockData.ts               # Seed data for initial records
│   ├── services/
│   │   ├── storageService.ts         # Reactive store & local storage fallback
│   │   └── verificationEngine.ts     # Expiration & compliance audit engine
│   ├── components/
│   │   ├── Navbar.tsx                # Mode switcher & navigation
│   │   ├── PassportSeal.tsx          # Debossed circular mark concept
│   │   ├── StatusBadge.tsx           # Full-strength saturated status badge
│   │   ├── CredentialCard.tsx        # Ledger-style card
│   │   ├── UploadModal.tsx           # Document upload dialog
│   │   ├── AccessGrantModal.tsx      # Business document access control
│   │   └── ShareLinkModal.tsx        # Share link & QR code view
│   └── views/
│       ├── NotaryDashboard.tsx       # Primary Notary Vault
│       ├── PublicProfileView.tsx     # Zero-Knowledge public profile
│       ├── BusinessLookupView.tsx    # Title company & agency lookup portal
│       └── AdminQueueView.tsx        # Registrar verification queue
```
