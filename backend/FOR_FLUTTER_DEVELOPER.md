# 📱 For Flutter Developer - API Integration Guide

## 🔗 API Base URL

**Local Development:**

```
http://localhost:3000/api/v1
```

**Production (After deployment):**

```
https://your-deployed-api.com/api/v1
```

---

## 📦 What You Need

1. ✅ **Postman Collection** - `POSTMAN_COLLECTION.json` (Import this in Postman)
2. ✅ **API Documentation** - This file
3. ✅ **Base URL** - Will be provided after deployment

---

## 🚀 Quick Integration Steps

### 1. Add HTTP Package

```yaml
dependencies:
  http: ^1.1.0
  # OR
  dio: ^5.4.0
```

### 2. API Client Setup

```dart
class ApiClient {
  static const String baseUrl = 'http://localhost:3000/api/v1';

  static Map<String, String> headers({String? token}) => {
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };
}
```

### 3. Authentication Example

```dart
// Register
Future<Map<String, dynamic>> register({
  required String email,
  required String password,
  required String fullName,
  required String userType,
}) async {
  final response = await http.post(
    Uri.parse('${ApiClient.baseUrl}/auth/register'),
    headers: ApiClient.headers(),
    body: jsonEncode({
      'email': email,
      'password': password,
      'full_name': fullName,
      'user_type': userType,
    }),
  );

  return jsonDecode(response.body);
}

// Login
Future<Map<String, dynamic>> login({
  required String email,
  required String password,
}) async {
  final response = await http.post(
    Uri.parse('${ApiClient.baseUrl}/auth/login'),
    headers: ApiClient.headers(),
    body: jsonEncode({
      'email': email,
      'password': password,
    }),
  );

  return jsonDecode(response.body);
}
```

### 4. Get Jobs Example

```dart
Future<List<dynamic>> getJobs({
  String? search,
  String? location,
  int page = 1,
  int limit = 20,
}) async {
  final queryParams = {
    'page': page.toString(),
    'limit': limit.toString(),
    if (search != null) 'search': search,
    if (location != null) 'location': location,
  };

  final uri = Uri.parse('${ApiClient.baseUrl}/jobs')
      .replace(queryParameters: queryParams);

  final response = await http.get(uri, headers: ApiClient.headers());
  final data = jsonDecode(response.body);

  return data['jobs'];
}
```

### 5. Apply for Job Example (Protected)

```dart
Future<Map<String, dynamic>> applyForJob({
  required String jobId,
  required String coverLetter,
  required String token,
}) async {
  final response = await http.post(
    Uri.parse('${ApiClient.baseUrl}/applications/jobs/$jobId/apply'),
    headers: ApiClient.headers(token: token),
    body: jsonEncode({
      'cover_letter': coverLetter,
    }),
  );

  return jsonDecode(response.body);
}
```

---

## 📋 All Available Endpoints

### Authentication (No token required)

```
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Jobs (No token required)

```
GET  /jobs                    - Get all jobs with filters
GET  /jobs/:jobId             - Get job details
GET  /jobs/:jobId/similar     - Get similar jobs
```

### Applications (Token required)

```
POST   /applications/jobs/:jobId/apply  - Apply for job
GET    /applications                     - Get my applications
GET    /applications/:applicationId     - Get application details
DELETE /applications/:applicationId     - Withdraw application
```

### Health Check

```
GET /health
```

---

## 🔑 Authentication Flow

1. **Register/Login** → Get `access_token`
2. **Store token** securely (SharedPreferences/SecureStorage)
3. **Use token** in Authorization header for protected routes:
   ```
   Authorization: Bearer {access_token}
   ```

---

## 📊 Response Format

### Success Response

```json
{
  "status_code": 200,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response

```json
{
  "status_code": 400,
  "message": "Error message",
  "error": "Error type"
}
```

---

## 🧪 Testing in Postman

### Step 1: Import Collection

- Open Postman
- Click Import
- Select `POSTMAN_COLLECTION.json`

### Step 2: Set Base URL

- Click on collection
- Variables tab
- Set `base_url` to `http://localhost:3000/api/v1`

### Step 3: Test Flow

1. Register User → Copy `access_token`
2. Set `access_token` variable in Postman
3. Get Jobs → Copy a `job id`
4. Apply for Job (use token + job id)
5. Get My Applications (use token)

---

## 📝 Query Parameters Examples

### Get Jobs with Filters

```
GET /jobs?search=Flutter&location=Remote&job_type=full-time&page=1&limit=10
```

### Get Applications with Status

```
GET /applications?status=applied&page=1&limit=20
```

---

## 🔒 Important Notes

1. **Token Storage**: Store `access_token` securely
2. **Token Expiry**: Token may expire, handle 401 errors
3. **Error Handling**: Always check `status_code` in response
4. **Pagination**: Use `page` and `limit` parameters for lists
5. **CORS**: Already enabled on backend

---

## 📱 Sample Flutter Models

### User Model

```dart
class User {
  final String id;
  final String email;
  final String fullName;
  final String userType;

  User.fromJson(Map<String, dynamic> json)
    : id = json['id'],
      email = json['email'],
      fullName = json['full_name'],
      userType = json['user_type'];
}
```

### Job Model

```dart
class Job {
  final String id;
  final String title;
  final String company;
  final String location;
  final String jobType;
  final List<String> skills;
  final String? salaryMin;
  final String? salaryMax;

  Job.fromJson(Map<String, dynamic> json)
    : id = json['id'],
      title = json['title'],
      company = json['company'],
      location = json['location'],
      jobType = json['job_type'],
      skills = List<String>.from(json['skills']),
      salaryMin = json['salary_min'],
      salaryMax = json['salary_max'];
}
```

### Application Model

```dart
class Application {
  final String id;
  final String jobId;
  final String status;
  final String coverLetter;
  final DateTime appliedAt;

  Application.fromJson(Map<String, dynamic> json)
    : id = json['id'],
      jobId = json['job_id'],
      status = json['status'],
      coverLetter = json['cover_letter'],
      appliedAt = DateTime.parse(json['applied_at']);
}
```

---

## ❓ Common Issues & Solutions

### Issue: "Network Error"

**Solution:** Check if backend server is running on `http://localhost:3000`

### Issue: "401 Unauthorized"

**Solution:** Token expired or invalid. Login again to get new token.

### Issue: "CORS Error"

**Solution:** CORS is already enabled. If still facing issues, contact backend developer.

### Issue: "Cannot connect from physical device"

**Solution:** Use your computer's IP address instead of localhost:

```
http://192.168.1.X:3000/api/v1
```

---

## 📞 Support

For any API issues or questions:

- Contact: Backend Developer (Ahmad Iqbal)
- Check: `QUICK_START.md` for backend setup
- Test: Use Postman collection first

---

## ✅ Integration Checklist

- [ ] Import Postman collection
- [ ] Test all endpoints in Postman
- [ ] Setup HTTP client in Flutter
- [ ] Implement authentication flow
- [ ] Store token securely
- [ ] Create API service classes
- [ ] Create data models
- [ ] Handle errors properly
- [ ] Test on emulator
- [ ] Test on physical device

---

**Happy Coding! 🚀**

**API is ready to use. Start building your Flutter app!**
