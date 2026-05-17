# 🚀 Jooblie Backend API

REST API for Jooblie Job Portal built with Node.js, Express, and Supabase.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account with database setup

## 🔧 Installation

```bash
cd backend
npm install
```

## ⚙️ Configuration

Create `.env` file (already created):

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

## 🗄️ Database Setup

Run these SQL commands in Supabase SQL Editor:

### 1. Create Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('job_seeker', 'recruiter')),
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  skills TEXT[],
  experience TEXT,
  education TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  industry TEXT,
  location TEXT,
  website TEXT,
  employee_count TEXT,
  recruiter_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  company TEXT NOT NULL,
  company_logo TEXT,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  experience TEXT NOT NULL,
  salary_min TEXT,
  salary_max TEXT,
  salary_currency TEXT DEFAULT 'USD',
  applicants_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  posted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  resume_url TEXT,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'under_review', 'interview', 'rejected', 'offer')),
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);
```

### 2. Create Functions

```sql
-- Increment job views
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs SET views_count = views_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Increment applicants count
CREATE OR REPLACE FUNCTION increment_applicants(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;
```

### 3. Insert Sample Data

```sql
-- Sample job
INSERT INTO jobs (title, company, location, job_type, description, requirements, skills, experience, salary_min, salary_max)
VALUES (
  'Senior Flutter Developer',
  'TechCorp',
  'Remote',
  'full-time',
  'We are looking for an experienced Flutter developer...',
  'Bachelor degree in CS, 5+ years experience...',
  ARRAY['Flutter', 'Dart', 'Firebase', 'REST APIs'],
  'senior',
  '120000',
  '160000'
);
```

## 🚀 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will run on: `http://localhost:3000`

## 📚 API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Jobs

- `GET /jobs` - Get all jobs (with filters)
- `GET /jobs/:jobId` - Get job by ID
- `GET /jobs/:jobId/similar` - Get similar jobs

### Applications (Protected)

- `POST /applications/jobs/:jobId/apply` - Apply for job
- `GET /applications` - Get my applications
- `GET /applications/:applicationId` - Get application details
- `DELETE /applications/:applicationId` - Withdraw application

### Health Check

- `GET /health` - API health status

## 🧪 Testing with Postman

Import the `POSTMAN_COLLECTION.json` file into Postman.

### Quick Test Flow:

1. **Register User**
   - POST `/api/v1/auth/register`
   - Body: `{ "email": "test@example.com", "password": "password123", "full_name": "Test User", "user_type": "job_seeker" }`

2. **Login**
   - POST `/api/v1/auth/login`
   - Body: `{ "email": "test@example.com", "password": "password123" }`
   - Copy the `access_token` from response

3. **Get Jobs**
   - GET `/api/v1/jobs?search=Flutter&limit=10`

4. **Apply for Job** (Protected)
   - POST `/api/v1/applications/jobs/{jobId}/apply`
   - Header: `Authorization: Bearer {access_token}`
   - Body: `{ "cover_letter": "I am interested..." }`

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── applications.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## 🔒 Security Notes

- All protected routes require `Authorization: Bearer {token}` header
- Tokens are managed by Supabase Auth
- CORS is enabled for all origins (configure for production)

## 📝 Environment Variables

- `PORT` - Server port (default: 3000)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `NODE_ENV` - Environment (development/production)

## 🐛 Troubleshooting

### Database Connection Issues

- Verify Supabase credentials in `.env`
- Check if tables are created in Supabase dashboard

### Authentication Errors

- Ensure user is registered in Supabase Auth
- Check if token is valid and not expired

### CORS Errors

- CORS is enabled for all origins by default
- Configure specific origins in production

## 📞 Support

For issues, contact: Ahmad Iqbal

---

**Made with ❤️ for Jooblie**
