# Warranti Backend

The backend for the [**Warranti**](https://github.com/preetiGusain/warranti_app) Flutter app, built with Node.js, Express, MongoDB, and Supabase. It handles user authentication, warranty management, and file uploads. This service connects with the frontend via RESTful APIs and is designed for scalability and security.

[![Google Play Store](https://img.shields.io/badge/Download%20on%20Google%20Play-FFD700?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=com.preeti.warranti_app&pcampaignid=web_share)



## Features
- JWT-based and Google OAuth user authentication
- Warranty CRUD operations
- File uploads (receipts, warranty cards, product images) stored on Supabase
- Middleware for route protection
- CORS and cookie handling for frontend communication
- `.env` variable validation with [`dotenv-verifier`](https://github.com/preetiGusain/dotenv-verifier)

---

## Tech Stack
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** Passport.js, JWT, Google OAuth2
- **File Storage:** Supabase Storage
- **Utilities:** Multer, Dotenv, Cookie-Parser, Express-UserAgent

---

## API Endpoints

### Keep-alive
```http
GET /keep-alive
```
To confirm that the backend is running and receiving periodic pings with [Script Runner](https://shorturl.at/aszVH)

### Auth Routes (`/auth`)
- `POST /signup` – Register a new user
- `POST /login` – Login user and set cookie
- `POST /refresh` – Refresh JWT token
- `GET /check` – Check user authentication status
- `POST /logout` – Logout user

### OAuth Routes (`/oauth`)
- `GET /google` – Redirect to Google for login
- `GET /google/callback` – Handle Google login callback
- `POST /google/app` – Handle Flutter app Google login

### User Routes (`/user`)
- `GET /profile` – Fetch logged-in user profile

### Warranty Routes (`/warranty`)
- `GET /` – Get all warranties
- `GET /:id` – Get single warranty
- `POST /create` – Create new warranty with file upload
- `PUT /:id` – Update warranty and files
- `DELETE /:id` – Delete warranty

---

## Environment Variables
The following environment variables are required:
```
PORT
MONGO_URI
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
FRONTEND_URI
JWT_SECRET
JWT_COOKIE_EXPIRE
SUPABASE_URL
SUPABASE_KEY
```

Use `.env` file to manage these.

---

## File Uploads to Supabase
Files like receipts, warranty cards, and product images are uploaded to a `warranty-files` bucket on Supabase. Files are structured as:
```
/userId/warrantyId/filename.ext
```
Uploads are done using `uploadFileToSupabase()` in `services/uploadFileToSupabase.js`.

---

## Setup Instructions
1. Clone the repo:
```bash
git clone https://github.com/preetiGusain/warranti-backend.git
```
2. Install dependencies:
```bash
npm install
```
3. Add `.env` file with required variables
4. Run the server:
```bash
npm start
```

---

## License
MIT

---

## Author
**Preeti Gusain**
