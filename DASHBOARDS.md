# JobHub Amritsar - Admin Panels Documentation

## 🎯 Overview

JobHub Amritsar features **3 comprehensive admin panels** designed for different user roles:

1. **Job Seeker Dashboard** - For candidates looking for jobs
2. **Recruiter Dashboard** - For employers posting jobs and managing applications
3. **Master Admin Dashboard** - For platform administrators with full control

---

## 📋 Dashboard Access

### Automatic Redirection
After successful login or signup, users are automatically redirected to their respective dashboard:
- Job Seekers → `jobseeker-dashboard.html`
- Employers/Recruiters → `recruiter-dashboard.html`
- Admins → `admin-dashboard.html`

### Manual Access
Users can also access dashboards by clicking the "Dashboard" button in the navigation bar after logging in.

---

## 👤 1. Job Seeker Dashboard

**Access URL:** `http://localhost:5000/jobseeker-dashboard.html`

**Required Role:** `jobseeker`

### Features:

#### 📊 Dashboard Overview
- **Statistics Cards:**
  - Applied Jobs count
  - Saved Jobs count
  - Scheduled Interviews count
  - Profile Views count
- Recent Applications list
- Recommended Jobs based on profile
- Application Status chart

#### 👨‍💼 My Profile
- Personal Information management
- Skills and Experience editing
- Education details
- Bio and location
- Profile picture upload

#### 🔍 Browse Jobs
- View all available jobs in Amritsar
- Filter by:
  - Job Type (Full-time, Part-time, Contract)
  - Experience Level
  - Location
- Quick Apply button

#### 📝 Applied Jobs
- View all applications submitted
- Application status tracking:
  - Pending
  - Reviewing
  - Shortlisted
  - Rejected
  - Interview Scheduled
- Application timeline

#### 🔖 Saved Jobs
- Bookmark favorite jobs
- Quick access to saved positions
- Apply directly from saved list

#### 📄 My Resume
- Upload resume (PDF, DOC, DOCX)
- Drag and drop functionality
- Resume preview
- Delete/Update resume

#### 📅 Interviews
- Upcoming interview schedule
- Interview details and location
- Calendar view

#### 💬 Messages
- Communication with recruiters (Coming Soon)

#### ⚙️ Settings
- Email notifications toggle
- Job alerts preferences
- Profile visibility settings

---

## 🏢 2. Recruiter Dashboard

**Access URL:** `http://localhost:5000/recruiter-dashboard.html`

**Required Role:** `employer`

### Features:

#### 📊 Dashboard Overview
- **Statistics Cards:**
  - Active Jobs count
  - Total Applicants count
  - Shortlisted Candidates count
  - Job Views count
- Recent Applicants list
- Job Performance metrics
- Application Trends chart

#### 🏢 Company Profile
- Company Information management
- Industry selection
- Company size
- Location (Amritsar focused)
- About Company description
- Website URL

#### ➕ Post New Job
- **Job Details:**
  - Job Title
  - Job Type (Full-time, Part-time, Contract, Internship)
  - Category
  - Location
- **Salary Configuration:**
  - Monthly or Yearly
  - Salary Range (Min-Max)
- **Requirements:**
  - Experience Level
  - Number of Vacancies
  - Required Skills (comma-separated)
- **Description:**
  - Detailed job description
  - Job requirements
  - Application deadline

#### 💼 My Job Posts
- View all posted jobs
- Track applications per job
- Edit job details
- Delete job postings
- Job status (Active, Closed, Draft)

#### 👥 All Applicants
- View all applications received
- **Filter by:**
  - Application Status
  - Specific Job
- **Applicant Details:**
  - Name, Email, Phone
  - Applied job
  - Application date
- **Actions:**
  - View applicant profile
  - Shortlist candidate
  - Schedule interview
  - Reject application

#### ✅ Shortlisted Candidates
- View all shortlisted applicants
- Candidate comparison
- Move to interview stage

#### 📅 Interviews
- Schedule interview calendar
- View upcoming interviews
- Interview details management
- Send interview invitations

#### 💬 Messages
- Communication with candidates (Coming Soon)

#### 📈 Analytics
- Application trends over time
- Conversion rates
- Job performance metrics
- Recruitment funnel analysis

#### ⚙️ Settings
- Email notifications
- Application alerts
- Auto-publish jobs toggle

---

## 🛡️ 3. Master Admin Dashboard

**Access URL:** `http://localhost:5000/admin-dashboard.html`

**Required Role:** `admin`

**Note:** This is the most powerful dashboard with complete platform control.

### Features:

#### 📊 Master Dashboard
- **Platform Statistics:**
  - Total Users (with growth %)
  - Total Jobs (with growth %)
  - Total Applications (with growth %)
  - Total Companies (with growth %)
- Platform Overview chart
- Recent Activities feed
- User Distribution chart
- Top Performing Jobs

#### 👥 Users Management
- View all users (Job Seekers + Recruiters)
- **Filter by:**
  - Role (Job Seeker, Employer, Admin)
  - Status (Active, Suspended, Deleted)
- **User Details:**
  - ID, Name, Email, Phone
  - Role and Join Date
- **Actions:**
  - View user profile
  - Suspend/Activate user
  - Delete user account
  - Edit user details

#### 👨‍💼 Job Seekers Section
- **Statistics:**
  - Total Job Seekers
  - Active Users
  - New Users This Month
- Detailed job seeker list
- View skills and experience
- Track application history

#### 🏢 Recruiters Section
- **Statistics:**
  - Total Recruiters
  - Verified Companies
  - Pending Verifications
- Company verification system
- Monitor job posting activity
- Company performance tracking

#### 💼 Jobs Management
- View all jobs on platform
- **Filter by:**
  - Status (Active, Closed, Pending Approval)
  - Job Type
  - Category
- **Job Actions:**
  - View job details
  - Edit job information
  - Delete/Close jobs
  - Approve pending jobs

#### 📝 Applications Overview
- View all applications across platform
- **Filter by Status:**
  - Pending, Reviewing
  - Shortlisted, Rejected
  - Interview Scheduled
- Application analytics
- Track success rates

#### 📊 Reports
- **Generate Reports:**
  - User Growth Report
  - Jobs Report
  - Application Analytics
  - Company Performance Report
  - Revenue Report
  - Platform Overview Report
- Download reports (PDF/Excel)

#### 📈 Advanced Analytics
- **Multiple Charts:**
  - User Acquisition trends
  - Job Success Rate
  - Application Funnel
  - Revenue Growth
- Custom timeframe selection (7/30/90/365 days)

#### 📰 Content Management
- **Manage Platform Content:**
  - Job Categories
  - Skills Database
  - Locations
  - FAQs
- Add/Edit/Delete content items

#### ⚙️ System Settings
- **General Settings:**
  - Site Name, Email, Contact
- **Platform Controls:**
  - User Registration toggle
  - Job Posting Approval toggle
  - Maintenance Mode
- **Email Configuration:**
  - SMTP settings
- **Security Settings:**
  - Two-Factor Authentication
  - Session Timeout
  - Max Login Attempts

#### 📋 Activity Logs
- Complete platform activity history
- **Filter by:**
  - Log Type (User, System, Security, Error)
  - Date Range
- Export logs
- Security audit trail

---

## 🎨 Design Features

All three dashboards share:

### Modern UI/UX
- **Glassmorphism Design** - Translucent cards with blur effects
- **Gradient Backgrounds** - Beautiful purple-blue gradients
- **Smooth Animations** - Fade-in effects and transitions
- **Responsive Layout** - Works on desktop, tablet, and mobile

### Common Components
- **Sidebar Navigation** - Easy access to all sections
- **Statistics Cards** - Visual data representation
- **Data Tables** - Sortable and filterable
- **Status Badges** - Color-coded status indicators
- **Action Buttons** - Primary, Secondary, Danger styles
- **Search Functionality** - Quick search across sections
- **Notification System** - Real-time alerts

### Color Coding
- **Blue** - Information, Jobs
- **Green** - Success, Approvals, Active
- **Orange** - Warnings, Pending
- **Purple** - Analytics, Views
- **Red** - Errors, Rejections, Danger

---

## 🔐 Authentication & Security

### Role-Based Access Control (RBAC)
Each dashboard checks user role before allowing access:
```javascript
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user || user.role !== 'expected_role') {
        alert('Access denied');
        window.location.href = '/';
        return false;
    }
    return true;
}
```

### Protected Routes
- Job Seeker Dashboard: Requires `role: 'jobseeker'`
- Recruiter Dashboard: Requires `role: 'employer'`
- Admin Dashboard: Requires `role: 'admin'`

### Token Management
- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Token expiration handling
- Secure logout functionality

---

## 📱 Responsive Design

All dashboards are fully responsive:

### Desktop (1200px+)
- Full sidebar visible
- Multi-column layouts
- All features accessible

### Tablet (768px - 1199px)
- Collapsible sidebar
- Adapted grid layouts
- Touch-friendly buttons

### Mobile (< 768px)
- Hidden sidebar with toggle menu
- Single column layout
- Optimized for small screens

---

## 🔧 Technical Implementation

### File Structure
```
├── jobseeker-dashboard.html      # Job Seeker UI
├── jobseeker-dashboard.js        # Job Seeker Logic
├── recruiter-dashboard.html      # Recruiter UI
├── recruiter-dashboard.js        # Recruiter Logic
├── admin-dashboard.html          # Admin UI
├── admin-dashboard.js            # Admin Logic
├── dashboard-styles.css          # Shared Styles
└── script.js                     # Updated with redirects
```

### API Integration
All dashboards connect to the backend API at `http://localhost:5000/api`:

**Common Endpoints:**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/jobs` - Get all jobs
- `POST /api/applications/:jobId` - Apply to job

**Job Seeker Specific:**
- `GET /api/applications/my-applications` - Get user's applications

**Recruiter Specific:**
- `POST /api/jobs` - Create new job
- `GET /api/jobs/my-jobs` - Get company's jobs
- `GET /api/applications/employer-applications` - Get applications for company
- `PUT /api/applications/:id/status` - Update application status
- `DELETE /api/jobs/:id` - Delete job

**Admin Specific:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

---

## 🚀 Getting Started

### For Job Seekers:
1. Sign up with role: "Job Seeker"
2. Automatic redirect to Job Seeker Dashboard
3. Complete your profile
4. Browse and apply to jobs

### For Recruiters:
1. Sign up with role: "Employer"
2. Provide company name
3. Automatic redirect to Recruiter Dashboard
4. Complete company profile
5. Post your first job

### For Admins:
1. Admin accounts created by database seeding
2. Login with admin credentials
3. Access Master Admin Dashboard
4. Full platform control

---

## 📝 Future Enhancements

### Planned Features:
- [ ] Real-time messaging system
- [ ] Video interview scheduling
- [ ] Resume parsing with AI
- [ ] Salary comparison tools
- [ ] Company reviews and ratings
- [ ] Job recommendations with ML
- [ ] Mobile app integration
- [ ] Payment gateway for premium features
- [ ] Multi-language support
- [ ] Advanced analytics with charts

---

## 💡 Tips for Users

### Job Seekers:
- Keep your profile updated
- Upload a professional resume
- Apply early to new job postings
- Check application status regularly
- Respond quickly to interview invitations

### Recruiters:
- Write clear job descriptions
- Specify accurate salary ranges
- Review applications promptly
- Provide feedback to candidates
- Keep job postings updated

### Admins:
- Monitor platform activity daily
- Verify companies before approval
- Review reported content
- Generate regular reports
- Keep system settings optimized

---

## 🆘 Support

For any issues or questions:
- Email: admin@jobhub-amritsar.com
- Phone: +91-183-XXXXXXX
- Location: Amritsar, Punjab, India

---

**Built with ❤️ for Amritsar's job market**
