# Permission System Implementation Guide

## 🎯 Overview
The permission system allows recruiters to request admin approval before viewing real applicant contact information. This ensures privacy compliance and reduces bias in the hiring process.

## 🔄 Workflow

### Step 1: Job Seeker Applies
- User fills out comprehensive application form (11 fields)
- All data is stored, including contact information
- Application appears anonymously to recruiter as "Applicant X"

### Step 2: Recruiter Views Anonymous Profile
- Recruiter sees:
  ✅ Experience, education, skills
  ✅ Cover letter and qualifications
  ✅ Location and job preferences
  ❌ Real name (shows "Applicant 8")
  ❌ Email address
  ❌ Phone number
  ❌ Resume download

### Step 3: Recruiter Requests Access
- Recruiter clicks "Request Access" button
- Request is sent to admin with timestamp
- Status changes to "Access Requested"
- Recruiter sees "Access Request Pending" message

### Step 4: Admin Reviews Request
- Admin navigates to "Access Requests" tab
- Sees all pending requests with:
  - Recruiter name and company
  - Job title
  - Applicant details (admin can see everything)
  - Request timestamp
- Admin can:
  - **Grant Access**: Recruiter gets full details
  - **Deny**: Request is rejected (optional feature)

### Step 5: Access Granted
- Admin clicks "Grant Access"
- System records:
  - `detailsAccessGranted = true`
  - `detailsAccessGrantedAt = current timestamp`
  - `detailsAccessGrantedBy = admin user ID`
- Recruiter can now see:
  ✅ Real applicant name
  ✅ Email address
  ✅ Phone number
  ✅ Download resume (if implemented)

## 📋 API Endpoints

### 1. Request Details Access (Employer Only)
```http
POST /api/applications/:id/request-details
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Access request submitted. Waiting for admin approval."
}
```

### 2. Grant Details Access (Admin Only)
```http
POST /api/applications/:id/grant-details
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Access granted successfully"
}
```

### 3. Get Pending Access Requests (Admin Only)
```http
GET /api/applications/access-requests
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 15,
      "detailsAccessRequested": true,
      "detailsAccessGranted": false,
      "detailsAccessRequestedAt": "2024-01-15T10:30:00Z",
      "job": {
        "id": 5,
        "title": "Senior Developer",
        "companyName": "Tech Corp"
      },
      "employer": {
        "id": 3,
        "name": "Rajesh Kumar",
        "email": "rajesh@example.com",
        "companyName": "Tech Corp"
      },
      "applicant": {
        "id": 8,
        "name": "Priya Sharma",
        "email": "priya@example.com",
        "phone": "+91 9876543210"
      }
    }
  ]
}
```

## 🗄️ Database Schema Changes

### New Fields in `applications` Table:
```sql
detailsAccessRequested BOOLEAN DEFAULT false
detailsAccessGranted BOOLEAN DEFAULT false
detailsAccessRequestedAt DATETIME
detailsAccessGrantedAt DATETIME
detailsAccessGrantedBy INTEGER (references users.id)
```

## 🎨 Frontend Changes

### Recruiter Dashboard (`recruiter-dashboard.js`)
**Changes:**
- Modified `viewApplicant()` function to check permissions
- Added conditional display of contact information
- Added "Request Access" button when access not granted
- Added "Access Request Pending" message when requested
- Added `requestDetailsAccess()` function

**UI States:**
1. **No Access Requested**: Shows "Request Access" button
2. **Access Pending**: Shows "Waiting for admin approval" message
3. **Access Granted**: Shows real name, email, phone

### Admin Dashboard (`admin-dashboard.html` + `admin-dashboard.js`)
**Changes:**
- Added new navigation item: "Access Requests"
- Created new page section with ID `access-requests`
- Added `loadAccessRequests()` function
- Added `grantAccessRequest()` function
- Added `denyAccessRequest()` function (stub)
- Displays table with recruiter, job, applicant, and action buttons

## 🧪 Testing the System

### Test Accounts:
```
Job Seeker:
Email: amit@example.com
Password: password123

Recruiter:
Email: rajesh@amritsar.com
Password: recruiter123

Admin:
Email: admin@jobhub.com
Password: admin123
```

### Test Scenario:
1. **Login as Job Seeker** (amit@example.com)
   - Go to main website
   - Find a job posted by recruiter
   - Click "Apply Now"
   - Fill out all 11 fields in application form
   - Submit application

2. **Login as Recruiter** (rajesh@amritsar.com)
   - Go to recruiter dashboard
   - Navigate to "Applications" section
   - Click "View" on the new application
   - Verify you see "Applicant X" (anonymous)
   - Verify contact info is hidden
   - Click "Request Access" button
   - Verify success message

3. **Login as Admin** (admin@jobhub.com)
   - Go to admin dashboard
   - Click "Access Requests" in sidebar
   - Verify you see the pending request
   - Verify all details are visible (recruiter, job, applicant)
   - Click "Grant Access" button
   - Verify success message

4. **Login as Recruiter Again**
   - Go to recruiter dashboard
   - Navigate to "Applications" section
   - Click "View" on the same application
   - Verify you now see:
     ✅ Real name instead of "Applicant X"
     ✅ Email address
     ✅ Phone number
   - Verify "Access Granted" badge is shown

## 🔒 Security Features

1. **Role-Based Access Control**:
   - Only employers can request access
   - Only admins can grant access
   - Job seekers cannot see who requested access

2. **Audit Trail**:
   - System tracks who requested access and when
   - System tracks who granted access and when
   - All actions are timestamped and recorded

3. **Privacy by Default**:
   - All applications start as anonymous
   - Contact info is hidden until explicitly granted
   - No automatic access to sensitive data

4. **Request Validation**:
   - Cannot request access twice
   - Cannot request if already granted
   - Must be the employer of the job

## 🚀 Live Deployment

**URL**: https://simer12s-projects-production.up.railway.app

**Status**: ✅ Deployed successfully

**Database**: SQLite (auto-syncs new schema on deployment)

## 📝 Future Enhancements

1. **Notifications**:
   - Email recruiter when access is granted
   - Notify admin when new request comes in

2. **Access Revocation**:
   - Admin can revoke access after granting
   - Add `detailsAccessRevokedAt` field

3. **Access Expiry**:
   - Set time limit for access (e.g., 30 days)
   - Auto-revoke after expiry

4. **Bulk Actions**:
   - Admin can grant/deny multiple requests at once
   - Filter requests by recruiter or job

5. **Deny Functionality**:
   - Currently just a placeholder
   - Can add `detailsAccessDenied` field
   - Track denial reasons

6. **Analytics**:
   - Track request-to-grant ratio
   - Monitor which recruiters request most access
   - Identify potential misuse

## ✅ Checklist

- [x] Database schema updated with 5 new fields
- [x] Backend API routes added (3 endpoints)
- [x] Controller functions implemented
- [x] View logic updated to check permissions
- [x] Recruiter dashboard updated with request button
- [x] Admin dashboard updated with access requests page
- [x] Deployed to Railway
- [x] Tested locally
- [ ] Tested on production (pending user test)
- [ ] Email notifications (future)
- [ ] Access revocation (future)

## 🎉 Conclusion

The permission system is now fully implemented and deployed! Recruiters can no longer see applicant contact information without admin approval. This creates a fair, bias-free hiring process while maintaining privacy compliance.

**Next Steps:**
1. Test the complete workflow on production
2. Create test accounts and submit sample applications
3. Request access as recruiter
4. Grant access as admin
5. Verify real details are visible after approval

**Support:**
If you encounter any issues, check:
- Browser console for errors
- Network tab for API responses
- Railway logs for server errors
