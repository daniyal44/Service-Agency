Account routes

Endpoints (protected):

GET /api/account/:id
  - Get public profile for user :id. Requires Authorization: Bearer <token> or Bearer dev-token with X-User-Id header.

PUT /api/account/:id
  - Update profile fields (firstName, lastName, email, phone, bio, profileVisibility, shareAnalytics, shareThirdParty, notifications).

POST /api/account/:id/photo
  - Upload profile photo (multipart/form-data, field name `photo`). Max 5MB. Returns `url` that points to /uploads/filename.

POST /api/account/:id/password
  - Change password. Body: { currentPassword, newPassword }

PUT /api/account/:id/twofactor
  - Toggle two-factor. Body: { enabled: true }

GET /api/account/:id/connected
  - List connected accounts.
POST /api/account/:id/connected
  - Add connected account. Body: { provider, providerId, info }
DELETE /api/account/:id/connected/:index
  - Remove connected account by index.

GET /api/account/:id/export
  - Download user data as JSON.

DELETE /api/account/:id
  - Delete account and related orders.

Dev usage example (no JWT configured):

curl -X GET "http://localhost:4000/api/account/USER_ID" -H "Authorization: Bearer dev-token" -H "X-User-Id: USER_ID"

To use JWT: set JWT_SECRET in backend .env and send Authorization: Bearer <token> where token contains { id: <userId> } signed with JWT_SECRET.
