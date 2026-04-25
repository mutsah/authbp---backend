# OAuth Integration Guide for Frontend Developers

This document describes how to integrate the frontend with the backend OAuth endpoints for Google and GitHub authentication.

## OAuth Endpoints

- **Google Login:**
  - Start: `GET /api/v1/auth/google`
  - Callback: `GET /api/v1/auth/google/callback`

- **GitHub Login:**
  - Start: `GET /api/v1/auth/github`
  - Callback: `GET /api/v1/auth/github/callback`

## Flow

1. **User clicks "Login with Google" or "Login with GitHub" button.**
   - Redirect the user to `/api/v1/auth/google` or `/api/v1/auth/github`.

2. **OAuth provider handles authentication.**
   - User logs in and authorizes the app.

3. **Provider redirects back to backend callback URL.**
   - Backend processes the user info and issues tokens.
   - The backend responds with an `AuthResponseDto` (see below).

## Expected Backend Response

After successful OAuth login, the backend returns a JSON object:

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

## Frontend Requirements

- Implement buttons/links for Google and GitHub login.
- Redirect users to the appropriate backend endpoint to start OAuth.
- Handle the backend's callback response:
  - If the backend redirects to the frontend, parse the tokens from the URL or response.
  - Store the tokens securely (e.g., in memory, HTTP-only cookies, or secure storage).
  - Use the access token for authenticated API requests.

## Error Handling

- If the backend returns an error (e.g., missing email), display an appropriate message to the user.

## Notes

- Ensure the frontend callback URL is registered in the OAuth provider settings if needed.
- The backend expects the OAuth flow to be initiated from the endpoints above.
- For local development, use the callback URLs as configured in the backend (e.g., `http://localhost:3002/api/v1/auth/google/callback`).

---

For any questions, contact the backend team.
