# 📱 Share This With Your Flutter Developer

## 🔗 GitHub Repository

```
https://github.com/iahmadiqbal/jooblie
```

---

## 📋 Quick Instructions for Flutter Developer

### Step 1: Clone Repository

```bash
git clone https://github.com/iahmadiqbal/jooblie.git
cd jooblie/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add Supabase credentials:
# SUPABASE_URL=https://uxfkeavwxpbijffevkvj.supabase.co
# SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Setup Database

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Open SQL Editor
3. Copy SQL from `backend/QUICK_START.md` (Step 2)
4. Run the SQL to create tables and sample data

### Step 5: Start Server

```bash
npm run dev
```

Server will run at: **http://localhost:3000**

---

## 🧪 Test in Postman

### Import Collection

1. Open Postman
2. Click Import
3. Select file: `backend/POSTMAN_COLLECTION.json`
4. Set base_url variable: `http://localhost:3000/api/v1`

### Test Flow

1. **Register User** → Get `access_token`
2. **Get Jobs** → Get job list
3. **Apply for Job** → Use token + job_id
4. **Get Applications** → See your applications

---

## 📚 Important Files

| File                               | Purpose                     |
| ---------------------------------- | --------------------------- |
| `backend/FOR_FLUTTER_DEVELOPER.md` | Complete integration guide  |
| `backend/POSTMAN_COLLECTION.json`  | API testing collection      |
| `backend/QUICK_START.md`           | 5-minute setup guide        |
| `backend/README.md`                | Full documentation          |
| `DEPLOYMENT_GUIDE.md`              | Production deployment guide |

---

## 🔗 API Base URL

**Local Development:**

```
http://localhost:3000/api/v1
```

**Production (Coming Soon):**

```
Will be provided after deployment
```

---

## 📱 Flutter Integration Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiClient {
  static const String baseUrl = 'http://localhost:3000/api/v1';

  // Login
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    return jsonDecode(response.body);
  }

  // Get Jobs
  static Future<List<dynamic>> getJobs() async {
    final response = await http.get(
      Uri.parse('$baseUrl/jobs'),
      headers: {'Content-Type': 'application/json'},
    );
    final data = jsonDecode(response.body);
    return data['jobs'];
  }

  // Apply for Job
  static Future<Map<String, dynamic>> applyForJob(
    String jobId,
    String coverLetter,
    String token
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/applications/jobs/$jobId/apply'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'cover_letter': coverLetter,
      }),
    );
    return jsonDecode(response.body);
  }
}
```

---

## ✅ Available Endpoints

### Public (No Auth)

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get job details

### Protected (Requires Token)

- `POST /applications/jobs/:id/apply` - Apply for job
- `GET /applications` - Get my applications
- `DELETE /applications/:id` - Withdraw application

---

## 🔑 Authentication

All protected endpoints require this header:

```
Authorization: Bearer {access_token}
```

Get token from login/register response:

```json
{
  "access_token": "eyJhbGc...",
  "user": { ... }
}
```

---

## 📞 Support

**For Backend Issues:**

- Check: `backend/README.md`
- Check: `backend/QUICK_START.md`
- Contact: Ahmad Iqbal

**For API Questions:**

- Read: `backend/FOR_FLUTTER_DEVELOPER.md`
- Test: Use Postman collection first

---

## 🎯 Next Steps

1. ✅ Clone repository
2. ✅ Setup backend locally
3. ✅ Test in Postman
4. ✅ Integrate in Flutter app
5. ✅ Test on emulator
6. ✅ Test on physical device

---

**Everything is ready! Start building your Flutter app! 🚀**

**GitHub:** https://github.com/iahmadiqbal/jooblie
