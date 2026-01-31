# PROJECT PLAN 📋

## Current State Summary

### Technology Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Vite + React 18 + TypeScript | ^18.3.1 |
| Styling | TailwindCSS | ^3.4.1 |
| Maps | Leaflet | ^1.9.4 |
| Backend | Express + TypeScript | ^4.19.2 |
| ORM | Prisma | ^5.11.0 |
| Database | SQLite | file:./dev.db |
| Auth | JWT + bcryptjs | ^9.0.3 / ^3.0.3 |
| Payment | PayTabs (not configured) | - |

### Database Models (8 total)
1. `Hotel` - Main hotel entity with rooms relation
2. `Room` - Hotel rooms with pricing and availability
3. `User` - Authentication with roles (USER, ADMIN, SUPER_ADMIN)
4. `Booking` - Reservations with payment status
5. `Review` - Guest reviews per hotel
6. `Coupon` - Discount codes with usage limits
7. `Notification` - Admin notification system
8. `ContactMessage` - Contact form submissions

### How to Run
```bash
# Frontend (root)
npm install && npm run dev  # Vite dev server

# Backend (/server)
npm install
npx prisma generate && npx prisma db push
npm run dev  # nodemon on port 3001
```

---

## Known Risks ⚠️

| Risk | Severity | Description |
|------|----------|-------------|
| Hardcoded JWT Secret | HIGH | Secret exposed in `.env` - should use env var |
| Default Admin Creds | HIGH | `Admin@123` is weak and exposed in `.env` |
| SQLite in Production | MEDIUM | Not suitable for production workloads |
| No Tests | MEDIUM | No test files found in repository |
| PayTabs Not Configured | LOW | Placeholders in env files |

---

## Constraints

1. **No major refactors** without approval
2. **No dependency upgrades** without approval
3. **No schema changes** without approval
4. **Small, verifiable steps only**
5. **All actions must be logged** in CURSOR-ACTIONS-LOG.md

---

## Step-by-Step Plan (Pending Approval)

### Phase 1: Documentation & Analysis (Complete)
- [x] Repository inspection
- [x] Create tracking documents
- [x] Complete security audit
- [x] Document API endpoints (Basic mapping complete)

### Phase 2: Security Implementation (In Progress)
- [x] Create .gitignore file (First Safe Step) ✅
- [x] Fix Vite build error (Duplicate export in MapPicker.tsx) ✅
- [ ] Add `.env.example` files (no secrets)
- [ ] Document missing README in root
- [x] Fix MapPicker Search Robustness (Fallbacks & Timeouts) ✅
- [x] Optimize MapPicker Speed & UI Alignment (Parallel/Z-index) ✅
- [x] Google Maps Premium Experience (Complete Redesign) ✅

### Phase 3: Security Hardening (After Approval)
- [ ] Migrate secrets to proper env management
- [ ] Strengthen default admin password policy
- [ ] Add rate limiting audit

---

*Last Updated: 2026-01-28 15:46*
