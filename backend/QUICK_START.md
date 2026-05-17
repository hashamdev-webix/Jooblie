# ⚡ Quick Start Guide - Jooblie Backend API

## 🚀 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Setup Database (Supabase)

Go to [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor

**Copy-paste this entire SQL:**

```sql
-- 1. Create tables
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

-- 2. Create functions
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs SET views_count = views_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_applicants(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Insert sample data
INSERT INTO jobs (title, company, location, job_type, description, requirements, skills, experience, salary_min, salary_max)
VALUES
(
  'Senior Flutter Developer',
  'TechCorp',
  'Remote',
  'full-time',
  'We are looking for an experienced Flutter developer to join our team and build amazing mobile applications.',
  'Bachelor degree in Computer Science, 5+ years of experience with Flutter and Dart, Strong understanding of mobile app architecture.',
  ARRAY['Flutter', 'Dart', 'Firebase', 'REST APIs', 'Git'],
  'senior',
  '120000',
  '160000'
),
(
  'React Native Developer',
  'StartupHub',
  'New York, NY',
  'full-time',
  'Join our fast-growing startup to build cross-platform mobile applications.',
  '3+ years experience with React Native, JavaScript/TypeScript expertise, Experience with Redux.',
  ARRAY['React Native', 'JavaScript', 'TypeScript', 'Redux'],
  'mid',
  '90000',
  '130000'
),
(
  'Backend Engineer',
  'DataFlow Inc',
  'San Francisco, CA',
  'full-time',
  'Build scalable backend systems and APIs for our data platform.',
  '4+ years backend development, Node.js or Python, Database design experience.',
  ARRAY['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  'mid',
  '110000',
  '150000'
);
```

### Step 3: Start Server

```bash
npm run dev
```

Server will start at: **http://localhost:3000**

---

## 🧪 Test in Postman

### 1. Import Collection

- Open Postman
- Import → Upload `POSTMAN_COLLECTION.json`

### 2. Test Flow

#### A. Register User

```
POST http://localhost:3000/api/v1/auth/register

Body (JSON):
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User",
  "user_type": "job_seeker"
}
```

**Response:**

```json
{
  "status_code": 201,
  "message": "User registered successfully",
  "access_token": "eyJhbGc...",
  "refresh_token": "...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "full_name": "Test User",
    "user_type": "job_seeker"
  }
}
```

**Copy the `access_token`!**

#### B. Get Jobs

```
GET http://localhost:3000/api/v1/jobs?limit=10
```

**Response:**

```json
{
  "status_code": 200,
  "jobs": [
    {
      "id": "...",
      "title": "Senior Flutter Developer",
      "company": "TechCorp",
      "location": "Remote",
      "job_type": "full-time",
      "skills": ["Flutter", "Dart", "Firebase"],
      "salary_min": "120000",
      "salary_max": "160000"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 3
  }
}
```

**Copy a `job id`!**

#### C. Apply for Job (Protected)

```
POST http://localhost:3000/api/v1/applications/jobs/{job-id}/apply

Headers:
Authorization: Bearer {your-access-token}

Body (JSON):
{
  "cover_letter": "I am very interested in this Flutter position..."
}
```

**Response:**

```json
{
  "status_code": 201,
  "message": "Application submitted successfully",
  "application_id": "...",
  "applied_at": "2026-03-20T..."
}
```

#### D. Get My Applications

```
GET http://localhost:3000/api/v1/applications

Headers:
Authorization: Bearer {your-access-token}
```

**Response:**

```json
{
  "status_code": 200,
  "applications": [
    {
      "id": "...",
      "job_id": "...",
      "status": "applied",
      "cover_letter": "...",
      "applied_at": "...",
      "jobs": {
        "title": "Senior Flutter Developer",
        "company": "TechCorp",
        "location": "Remote"
      }
    }
  ]
}
```

---

## ✅ All Working Endpoints

### Public (No Auth)

- ✅ `POST /api/v1/auth/register`
- ✅ `POST /api/v1/auth/login`
- ✅ `GET /api/v1/jobs`
- ✅ `GET /api/v1/jobs/:jobId`
- ✅ `GET /api/v1/jobs/:jobId/similar`
- ✅ `GET /api/v1/health`

### Protected (Requires Token)

- ✅ `POST /api/v1/applications/jobs/:jobId/apply`
- ✅ `GET /api/v1/applications`
- ✅ `GET /api/v1/applications/:applicationId`
- ✅ `DELETE /api/v1/applications/:applicationId`

---

## 🎯 For Flutter Developer

**Share these:**

1. API Base URL: `http://localhost:3000/api/v1`
2. Postman Collection: `POSTMAN_COLLECTION.json`
3. This guide: `QUICK_START.md`

**Tell them:**

- Register first to get `access_token`
- Use token in `Authorization: Bearer {token}` header for protected routes
- All responses are in JSON format
- Pagination is supported on list endpoints

---

## 🐛 Common Issues

### "Cannot connect to server"

- Check if server is running: `npm run dev`
- Verify port 3000 is not in use

### "Database error"

- Verify Supabase credentials in `.env`
- Check if tables are created in Supabase

### "Invalid token"

- Token expires after some time
- Login again to get new token

---

## 📞 Need Help?

Contact: Ahmad Iqbal

---

**That's it! API is ready for testing! 🎉**
