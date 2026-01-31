# DECISIONS LOG 📝

This document tracks all decisions made during development, including assumptions that require validation.

---

## Initial Assumptions (MARKED - Require Validation)

| ID | Assumption | Status | Validated By |
|----|------------|--------|--------------|
| A1 | SQLite is only for development | ⏳ PENDING | - |
| A2 | PayTabs integration is incomplete | ⏳ PENDING | - |
| A3 | `.env` files are NOT committed to git | ⏳ PENDING | Check .gitignore |
| A4 | No production deployment exists yet | ⏳ PENDING | - |
| A5 | Arabic is the primary UI language | ⏳ PENDING | Code inspection |

---

## Decisions Made (None Yet)

| ID | Decision | Date | Rationale | Approved By |
|----|----------|------|-----------|-------------|
| D1 | (Awaiting first decision) | - | - | - |

---

## Irreversible Actions (NONE TAKEN)

> ⚠️ No irreversible actions have been taken.
> Any schema changes, data migrations, or auth modifications require explicit approval.

---

## Questions for Project Director

1. **Database**: Is SQLite intended for production, or should we plan for PostgreSQL/MySQL migration?
2. **Secrets**: Should we implement a secrets management solution (e.g., dotenv-vault)?
3. **Testing**: What level of test coverage is expected?
4. **Deployment**: What is the target deployment environment (Vercel, VPS, Docker)?

---

*Last Updated: 2026-01-28 15:46*
