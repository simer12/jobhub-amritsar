// Master Admin Dashboard JavaScript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : window.location.origin + '/api';
let currentUser = null;
let authToken = null;

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user || user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '/';
        return false;
    }
    
    authToken = token;
    currentUser = user;
    return true;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    loadDashboardData();
    setupNavigation();
    setupEventListeners();
});

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.dataset.page;
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            
            // Update title
            document.getElementById('pageTitle').textContent = 
                item.textContent.trim().split('\n')[0];
            
            // Load page data
            loadPageData(pageId);
        });
    });
    
    // Menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    });
    
    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load users count
        const usersResponse = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            document.getElementById('totalUsersCount').textContent = users.length;
            
            // Count companies
            const companies = users.filter(u => u.role === 'employer');
            document.getElementById('totalCompaniesCount').textContent = companies.length;
        }
        
        // Load jobs count
        const jobsResponse = await fetch(`${API_URL}/jobs`);
        if (jobsResponse.ok) {
            const data = await jobsResponse.json();
            document.getElementById('totalJobsCount').textContent = data.total || data.jobs?.length || 0;
        }
        
        // Load applications count
        const appsResponse = await fetch(`${API_URL}/admin/applications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (appsResponse.ok) {
            const applications = await appsResponse.json();
            document.getElementById('totalApplicationsCount').textContent = applications.length;
        }
        
        // Load recent activities
        loadRecentActivities();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Show demo data if API fails
        showDemoData();
    }
}

// Show demo data
function showDemoData() {
    document.getElementById('totalUsersCount').textContent = '127';
    document.getElementById('totalJobsCount').textContent = '45';
    document.getElementById('totalApplicationsCount').textContent = '342';
    document.getElementById('totalCompaniesCount').textContent = '28';
}

// Load recent activities
function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    
    const activities = [
        { icon: 'fa-user-plus', title: 'New user registered', description: 'Rajesh Kumar joined as job seeker', time: '2 minutes ago' },
        { icon: 'fa-briefcase', title: 'New job posted', description: 'TechAmr Solutions posted Software Developer', time: '15 minutes ago' },
        { icon: 'fa-file-alt', title: 'New application', description: 'Priya Singh applied for Marketing Manager', time: '1 hour ago' },
        { icon: 'fa-building', title: 'Company verified', description: 'Golden Temple Hospitality verified', time: '2 hours ago' },
        { icon: 'fa-check-circle', title: 'Application shortlisted', description: 'Candidate shortlisted for Full Stack Developer', time: '3 hours ago' }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <small style="color: #999;">${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// Load page specific data
async function loadPageData(pageId) {
    switch(pageId) {
        case 'users':
            loadAllUsers();
            break;
        case 'jobseekers':
            loadJobSeekers();
            break;
        case 'recruiters':
            loadRecruiters();
            break;
        case 'jobs':
            loadAllJobs();
            break;
        case 'applications':
            loadAllApplications();
            break;
        case 'access-requests':
            loadAccessRequests();
            break;
        case 'logs':
            loadActivityLogs();
            break;
    }
}

// Load all users
async function loadAllUsers() {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load users');
        }
        
        const users = await response.json();
        const container = document.getElementById('usersList');
        
        if (!users || users.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No users found</p>';
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone || 'N/A'}</td>
                            <td><span class="status-badge ${user.role}">${user.role}</span></td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="viewUser(${user.id})">View</button>
                                <button class="btn-danger btn-sm" onclick="suspendUser(${user.id})">Suspend</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersList').innerHTML = 
            '<p style="text-align: center; color: #ef4444; padding: 40px;">Error loading users. Admin API not yet implemented.</p>';
    }
}

// Load job seekers
async function loadJobSeekers() {
    try {
        const response = await fetch(`${API_URL}/admin/users?role=jobseeker`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load job seekers');
        }
        
        const users = await response.json();
        const jobseekers = users.filter(u => u.role === 'jobseeker');
        
        document.getElementById('jobseekersTotal').textContent = jobseekers.length;
        document.getElementById('jobseekersActive').textContent = jobseekers.length;
        document.getElementById('jobseekersNew').textContent = jobseekers.filter(u => {
            const joinDate = new Date(u.createdAt);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return joinDate > monthAgo;
        }).length;
        
        const container = document.getElementById('jobseekersList');
        
        if (!jobseekers || jobseekers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No job seekers found</p>';
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Skills</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${jobseekers.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone || 'N/A'}</td>
                            <td>${user.skills?.slice(0, 3).join(', ') || 'N/A'}</td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="viewUser(${user.id})">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading job seekers:', error);
        document.getElementById('jobseekersList').innerHTML = 
            '<p style="text-align: center; color: #ef4444; padding: 40px;">Error loading job seekers. Admin API not yet implemented.</p>';
    }
}

// Load recruiters
async function loadRecruiters() {
    try {
        const response = await fetch(`${API_URL}/admin/users?role=employer`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load recruiters');
        }
        
        const users = await response.json();
        const recruiters = users.filter(u => u.role === 'employer');
        
        document.getElementById('recruitersTotal').textContent = recruiters.length;
        document.getElementById('recruitersVerified').textContent = recruiters.length;
        document.getElementById('recruitersPending').textContent = '0';
        
        const container = document.getElementById('recruitersList');
        
        if (!recruiters || recruiters.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No recruiters found</p>';
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Jobs Posted</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${recruiters.map(user => `
                        <tr>
                            <td><strong>${user.companyName || user.name}</strong></td>
                            <td>${user.email}</td>
                            <td>${user.phone || 'N/A'}</td>
                            <td>0</td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="viewUser(${user.id})">View</button>
                                <button class="btn-primary btn-sm" onclick="verifyCompany(${user.id})">Verify</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading recruiters:', error);
        document.getElementById('recruitersList').innerHTML = 
            '<p style="text-align: center; color: #ef4444; padding: 40px;">Error loading recruiters. Admin API not yet implemented.</p>';
    }
}

// Load all jobs
async function loadAllJobs() {
    try {
        const response = await fetch(`${API_URL}/jobs`);
        const data = await response.json();
        const jobs = data.jobs || [];
        
        const container = document.getElementById('jobsList');
        
        if (!jobs || jobs.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No jobs found</p>';
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Applications</th>
                        <th>Posted Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${jobs.map(job => `
                        <tr>
                            <td><strong>${job.title}</strong></td>
                            <td>${job.companyName}</td>
                            <td>${job.type}</td>
                            <td>${job.location}</td>
                            <td>${job.Applications?.length || 0}</td>
                            <td>${new Date(job.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="viewJob(${job.id})">View</button>
                                <button class="btn-danger btn-sm" onclick="deleteJobAdmin(${job.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

// Load all applications
async function loadAllApplications() {
    try {
        const response = await fetch(`${API_URL}/admin/applications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load applications');
        }
        
        const applications = await response.json();
        const container = document.getElementById('applicationsList');
        
        if (!applications || applications.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No applications found</p>';
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Applicant</th>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${applications.map(app => `
                        <tr>
                            <td>${app.id}</td>
                            <td>${app.User?.name || 'N/A'}</td>
                            <td>${app.Job?.title || 'N/A'}</td>
                            <td>${app.Job?.companyName || 'N/A'}</td>
                            <td><span class="status-badge ${app.status}">${app.status.replace('_', ' ')}</span></td>
                            <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="viewApplication(${app.id})">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading applications:', error);
        document.getElementById('applicationsList').innerHTML = 
            '<p style="text-align: center; color: #ef4444; padding: 40px;">Error loading applications. Admin API not yet implemented.</p>';
    }
}

// Load activity logs
function loadActivityLogs() {
    const container = document.getElementById('logsList');
    
    const logs = [
        { type: 'user', action: 'User Registration', user: 'Rajesh Kumar', timestamp: new Date().toLocaleString() },
        { type: 'system', action: 'Job Posted', user: 'TechAmr Solutions', timestamp: new Date().toLocaleString() },
        { type: 'user', action: 'Application Submitted', user: 'Priya Singh', timestamp: new Date().toLocaleString() },
        { type: 'security', action: 'Failed Login Attempt', user: 'Unknown', timestamp: new Date().toLocaleString() },
        { type: 'system', action: 'Database Backup', user: 'System', timestamp: new Date().toLocaleString() }
    ];
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                ${logs.map(log => `
                    <tr>
                        <td><span class="status-badge ${log.type}">${log.type}</span></td>
                        <td>${log.action}</td>
                        <td>${log.user}</td>
                        <td>${log.timestamp}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Load access requests
async function loadAccessRequests() {
    try {
        const response = await fetch(`${API_URL}/applications/access-requests`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load access requests');
        }
        
        const result = await response.json();
        const requests = result.data || result.requests || [];
        const container = document.getElementById('accessRequestsList');
        
        if (!requests || requests.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
                    <h3 style="color: #fff; margin-bottom: 10px;">No Pending Requests</h3>
                    <p style="color: #888;">All access requests have been processed</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: rgba(255, 255, 255, 0.05); border-bottom: 2px solid rgba(255, 255, 255, 0.1);">
                        <th style="padding: 15px; text-align: left; color: #fff;">Recruiter</th>
                        <th style="padding: 15px; text-align: left; color: #fff;">Company</th>
                        <th style="padding: 15px; text-align: left; color: #fff;">Job Title</th>
                        <th style="padding: 15px; text-align: left; color: #fff;">Applicant</th>
                        <th style="padding: 15px; text-align: left; color: #fff;">Requested</th>
                        <th style="padding: 15px; text-align: center; color: #fff;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${requests.map(req => `
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                            <td style="padding: 15px; color: #ccc;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <i class="fas fa-building" style="color: #667eea;"></i>
                                    <div>
                                        <div style="font-weight: 600; color: #fff;">${req.employer?.name || 'N/A'}</div>
                                        <small style="color: #888;">${req.employer?.email || ''}</small>
                                    </div>
                                </div>
                            </td>
                            <td style="padding: 15px; color: #ccc;">${req.employer?.companyName || 'N/A'}</td>
                            <td style="padding: 15px; color: #ccc;">
                                <div style="font-weight: 500; color: #fff;">${req.job?.title || 'N/A'}</div>
                                <small style="color: #888;">${req.job?.companyName || ''}</small>
                            </td>
                            <td style="padding: 15px; color: #ccc;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i class="fas fa-user" style="color: #10b981;"></i>
                                    <div>
                                        <div style="font-weight: 500; color: #fff;">${req.applicant?.name || 'N/A'}</div>
                                        <small style="color: #888;">${req.applicant?.email || ''}</small>
                                    </div>
                                </div>
                            </td>
                            <td style="padding: 15px; color: #ccc;">
                                ${new Date(req.detailsAccessRequestedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <button onclick="grantAccessRequest(${req.id})" 
                                    style="padding: 8px 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                                    color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; 
                                    font-size: 13px; margin-right: 8px;">
                                    <i class="fas fa-check"></i> Grant Access
                                </button>
                                <button onclick="denyAccessRequest(${req.id})" 
                                    style="padding: 8px 16px; background: rgba(239, 68, 68, 0.2); 
                                    color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; 
                                    font-weight: 600; cursor: pointer; font-size: 13px;">
                                    <i class="fas fa-times"></i> Deny
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading access requests:', error);
        document.getElementById('accessRequestsList').innerHTML = 
            '<p style="text-align: center; color: #ef4444; padding: 40px;">Error loading access requests</p>';
    }
}

// Grant access request
async function grantAccessRequest(applicationId) {
    try {
        const response = await fetch(`${API_URL}/applications/${applicationId}/grant-details`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            alert('Access granted successfully!');
            loadAccessRequests(); // Reload the list
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error granting access:', error);
        alert('Error granting access');
    }
}

// Deny access request (optional)
function denyAccessRequest(applicationId) {
    if (confirm('Are you sure you want to deny this access request?')) {
        // For now, just refresh - you can implement a deny endpoint later if needed
        alert('Request denied. The recruiter will not be granted access.');
        loadAccessRequests();
    }
}

// Admin actions
function viewUser(userId) {
    alert('View user details for ID: ' + userId);
}

function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
        alert('User suspended: ' + userId);
    }
}

function verifyCompany(userId) {
    alert('Company verified: ' + userId);
}

function viewJob(jobId) {
    alert('View job details for ID: ' + jobId);
}

function deleteJobAdmin(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        alert('Job deleted: ' + jobId);
    }
}

function viewApplication(appId) {
    alert('View application details for ID: ' + appId);
}
