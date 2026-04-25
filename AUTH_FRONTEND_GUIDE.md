# Auth Module Integration Guide for Frontend Developers

This document explains how to integrate the frontend with the backend authentication module, including OAuth (Google, GitHub), registration, login, token refresh, and password reset.

---

## Endpoints Overview

### OAuth

- **Google Login:**
  - Start: `GET /api/v1/auth/google`
  - Callback: `GET /api/v1/auth/google/callback`
- **GitHub Login:**
  - Start: `GET /api/v1/auth/github`
  - Callback: `GET /api/v1/auth/github/callback`

### Local Auth

- **Register:**
  - `POST /api/v1/auth/register`
  - Body: `{ email, password, firstName, lastName }`
- **Login:**
  - `POST /api/v1/auth/login`
  - Body: `{ email, password }`
- **Refresh Token:**
  - `POST /api/v1/auth/refresh`
  - Body: `{ refreshToken }`

### Password Reset

- **Send Reset Link:**
  - `POST /api/v1/auth/send-reset-link`
  - Body: `{ email }`
- **Verify Reset Token:**
  - `POST /api/v1/auth/verify-reset-token`
  - Body: `{ token }`
- **Reset Password:**
  - `POST /api/v1/auth/reset-password`
  - Body: `{ token, newPassword }`

---

## Expected Responses

### Auth Success (Register, Login, OAuth, Refresh)

```
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "email": "...",
    "firstName": "...",
    "lastName": "..."
  }
}
```

### Password Reset Success

- Send/verify/reset endpoints return status and message.

---

## Frontend Requirements

- Implement forms for registration, login, and password reset.
- Implement buttons/links for Google and GitHub login.
- Redirect users to `/api/v1/auth/google` or `/api/v1/auth/github` for OAuth.
- Store tokens securely (e.g., HTTP-only cookies, secure storage).
- Use the access token for authenticated API requests.
- Handle and display error messages from the backend.

---

## Error Handling

- Display validation errors, authentication failures, and rate limit messages to users.
- Handle missing email or invalid token errors for OAuth and password reset.

---

## Notes

- All endpoints are prefixed with `/api/v1/auth`.
- Ensure callback URLs for OAuth are registered with the providers.
- For local development, use the callback URLs as configured in the backend (e.g., `http://localhost:3002/api/v1/auth/google/callback`).

---

For any questions, contact the backend team.
