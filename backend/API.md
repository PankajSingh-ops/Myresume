# MyResume API Documentation

Base URL: `http://localhost:4000/api` (or `process.env.NEXT_PUBLIC_API_URL` in production)

All authenticated endpoints require an Authorization header or an `access_token` cookie.
`Authorization: Bearer <token>`

## Rate Limits
| Limiter Type | Cost | Limit | Reset Window | Applied To |
|--------------|------|-------|--------------|------------|
| `generalLimiter` | N/A | 100 reqs | 15 mins | `/export` (PDF) |
| `authLimiter` | N/A | 10 reqs | 15 mins | Login, Registration, Forgot Password |
| `resetPasswordLimiter` | N/A | 5 reqs | 1 hour | Password Reset |
| `aiLimiter` | credits | 20 reqs | 1 hour | All `/ai` endpoints |
| `uploadLimiter` | N/A | 10 reqs | 1 hour | All `/upload` endpoints |
| `creditCheckLimiter` | N/A | 50 reqs | 15 mins | `/credits` endpoints |

---

## Credit Costs
| Action | Credits Deducted | Endpoint |
|--------|------------------|----------|
| Signup Bonus | `+100` (granted) | `POST /auth/register` |
| Create Resume | `-20` | `POST /resumes` |
| Duplicate Resume | `-20` | `POST /resumes/:id/duplicate` |
| Export PDF | `-5` | `POST /export/pdf/:id` |
| AI Operations | `-2` per call | `POST /ai/*` |

---

## 1. Authentication (`/auth`)

### `POST /auth/register`
- **Auth:** None
- **Rate Limit:** `authLimiter`
- **Body:** `{ email, password, firstName, lastName }`
- **Success (201):** `{ status: 'success', data: UserObject }`
- **Errors:** 409 (EMAIL_TAKEN), 422 (Validation)

### `POST /auth/login`
- **Auth:** None
- **Rate Limit:** `authLimiter`
- **Body:** `{ email, password }`
- **Success (200):** `{ status: 'success', data: { user, accessToken, refreshToken, credits: { balance } } }`
- **Errors:** 401 (INVALID_CREDENTIALS)

### `POST /auth/refresh`
- **Auth:** None (Cookie/Body expected)
- **Body:** `{ refreshToken? }` (Or sent via `refresh_token` httpOnly cookie)
- **Success (200):** `{ status: 'success', data: { accessToken, refreshToken } }`
- **Errors:** 401 (TOKEN_EXPIRED, TOKEN_REUSE)

### `GET /auth/verify-email`
- **Auth:** None
- **Query:** `?token=XYZ`
- **Success (200):** `{ status: 'success' }`

---

## 2. Resumes (`/resumes`)

### `GET /resumes`
- **Auth:** Required
- **Query:** `?page=1&limit=12&search=Text`
- **Success (200):** `{ success: true, data: [Resume], meta: { page, totalPages, ... } }`

### `POST /resumes`
- **Auth:** Required
- **Cost:** 20 credits
- **Body:** `{ title, templateId?, content?, settings? }`
- **Success (201):** `{ success: true, data: Resume, credits: { deducted, newBalance } }`

### `PATCH /resumes/:id`
- **Auth:** Required
- **Body:** `{ title?, content?, settings?, isPublic? }`
- **Success (200):** `{ success: true, data: Resume }`

### `GET /resumes/r/:slug`
- **Auth:** None (Public)
- **Success (200):** `{ success: true, data: Resume }`
- **Errors:** 404 (Not Found or Not Public)

### `POST /resumes/:id/duplicate`
- **Auth:** Required
- **Cost:** 20 credits
- **Success (201):** `{ success: true, data: Resume, credits: { deducted, newBalance } }`

---

## 3. Credits (`/credits`)

### `GET /credits/balance`
- **Auth:** Required
- **Rate Limit:** `creditCheckLimiter`
- **Success (200):** `{ success: true, data: { balance } }`

### `GET /credits/history`
- **Auth:** Required
- **Rate Limit:** `creditCheckLimiter`
- **Query:** `?page=1&limit=20`
- **Success (200):** `{ success: true, data: [Transaction], meta: { ... } }`

---

## 4. Export (`/export`)

### `GET /export/token/:resumeId`
- **Auth:** Required
- **Success (200):** `{ success: true, data: { token } }` (Returns short-lived token for Puppeteer)

### `POST /export/pdf/:resumeId`
- **Auth:** Required
- **Cost:** 5 credits
- **Rate Limit:** `generalLimiter`
- **Success (200):** Raw PDF Buffer. Headers include `X-Credits-Deducted` and `X-Credits-Balance`.
- **Errors:** 402 (Insufficient Credits)

---

## 5. AI Assistant (`/ai`)

*Note: All `/ai` endpoints cost 2 credits and use `aiLimiter`.*

### `POST /ai/improve-bullets`
- **Body:** `{ bullets: string[], role: string, industry?: string }`
- **Success (200):** `{ success: true, data: { suggestions: string[] }, credits: { deducted, newBalance } }`

### `POST /ai/suggest-skills`
- **Body:** `{ role: string, currentSkills: string[] }`
- **Success (200):** `{ success: true, data: { suggestions: string[] }, credits: { deducted, newBalance } }`

---

## 6. Upload (`/upload`)

*Note: All `/upload` endpoints use `uploadLimiter`.*

### `POST /upload/avatar`
- **Auth:** Required
- **Form-Data:** `avatar` (File)
- **Success (200):** `{ success: true, data: { url } }`

### `POST /upload/photo/:resumeId`
- **Auth:** Required
- **Form-Data:** `photo` (File)
- **Success (200):** `{ success: true, data: { url } }`
