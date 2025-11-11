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
    loadNotifications(); // Load notifications on page load
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
        // Load stats from admin API
        const statsResponse = await fetch(`${API_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (statsResponse.ok) {
            const result = await statsResponse.json();
            const stats = result.data;
            
            document.getElementById('totalUsersCount').textContent = stats.users.total;
            document.getElementById('totalCompaniesCount').textContent = stats.users.employers;
            document.getElementById('totalJobsCount').textContent = stats.jobs.total;
            document.getElementById('totalApplicationsCount').textContent = stats.applications.total;
        }
        
        // Load recent activities (from recent users/jobs)
        loadRecentActivities();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

// Load recent activities
async function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    
    try {
        // Get recent users
        const usersResponse = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const activities = [];
        
        if (usersResponse.ok) {
            const result = await usersResponse.json();
            const recentUsers = result.data.slice(0, 3);
            
            recentUsers.forEach(user => {
                const timeAgo = getTimeAgo(new Date(user.createdAt));
                activities.push({
                    icon: user.role === 'employer' ? 'fa-building' : 'fa-user-plus',
                    title: `New ${user.role} registered`,
                    description: `${user.name} joined as ${user.role}`,
                    time: timeAgo
                });
            });
        }
        
        // Get recent jobs
        const jobsResponse = await fetch(`${API_URL}/admin/jobs`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (jobsResponse.ok) {
            const result = await jobsResponse.json();
            const recentJobs = result.data.slice(0, 2);
            
            recentJobs.forEach(job => {
                const timeAgo = getTimeAgo(new Date(job.createdAt));
                activities.push({
                    icon: 'fa-briefcase',
                    title: 'New job posted',
                    description: `${job.companyName} posted ${job.title}`,
                    time: timeAgo
                });
            });
        }
        
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
        
    } catch (error) {
        console.error('Error loading activities:', error);
        container.innerHTML = '<p style="color: #666;">No recent activities</p>';
    }
}

// Helper function to get time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
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
        
        const result = await response.json();
        const users = result.data;
        const container = document.getElementById('usersList');
        
        if (!users || users.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No users found</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
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
                            <td><span class="status-badge ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="viewUser(${user.id})">View</button>
                                ${!user.isVerified ? `<button class="btn-primary btn-sm" onclick="verifyUser(${user.id})">Verify</button>` : ''}
                                <button class="btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersList').innerHTML = 
            '<p style="text-align: center; color: #f44336; padding: 40px;">Error loading users. Please try again.</p>';
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
        
        const result = await response.json();
        const jobseekers = result.data;
        
        // Update stats
        document.getElementById('jobseekersTotal').textContent = jobseekers.length;
        document.getElementById('jobseekersActive').textContent = jobseekers.filter(u => u.isActive).length;
        
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        document.getElementById('jobseekersNew').textContent = jobseekers.filter(u => {
            return new Date(u.createdAt) > monthAgo;
        }).length;
        
        const container = document.getElementById('jobseekersList');
        
        if (!jobseekers || jobseekers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No job seekers found</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Skills</th>
                        <th>Experience</th>
                        <th>Status</th>
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
                            <td>${user.skills ? (Array.isArray(user.skills) ? user.skills.slice(0, 2).join(', ') : user.skills) : 'N/A'}</td>
                            <td>${user.experience || 'N/A'}</td>
                            <td><span class="status-badge ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="viewUser(${user.id})">View</button>
                                <button class="btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading job seekers:', error);
        document.getElementById('jobseekersList').innerHTML = 
            '<p style="text-align: center; color: #f44336; padding: 40px;">Error loading job seekers.</p>';
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
        
        const result = await response.json();
        const recruiters = result.data;
        
        document.getElementById('recruitersTotal').textContent = recruiters.length;
        document.getElementById('recruitersVerified').textContent = recruiters.filter(r => r.isVerified).length;
        document.getElementById('recruitersPending').textContent = recruiters.filter(r => !r.isVerified).length;
        
        const container = document.getElementById('recruitersList');
        
        if (!recruiters || recruiters.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No recruiters found</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Contact Person</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${recruiters.map(user => `
                        <tr>
                            <td><strong>${user.companyName || user.name}</strong></td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone || 'N/A'}</td>
                            <td><span class="status-badge ${user.isVerified ? 'verified' : 'pending'}">${user.isVerified ? 'Verified' : 'Pending'}</span></td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="viewUser(${user.id})">View</button>
                                ${!user.isVerified ? `<button class="btn-primary btn-sm" onclick="verifyUser(${user.id})">Verify</button>` : ''}
                                <button class="btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading recruiters:', error);
        document.getElementById('recruitersList').innerHTML = 
            '<p style="text-align: center; color: #f44336; padding: 40px;">Error loading recruiters.</p>';
    }
}

// Load all jobs
async function loadAllJobs() {
    try {
        const response = await fetch(`${API_URL}/admin/jobs`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load jobs');
        }
        
        const result = await response.json();
        const jobs = result.data;
        
        const container = document.getElementById('jobsList');
        
        if (!jobs || jobs.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No jobs found</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Status</th>
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
                            <td>${job.jobType || 'N/A'}</td>
                            <td>${job.location?.city || 'N/A'}</td>
                            <td><span class="status-badge ${job.status}">${job.status}</span></td>
                            <td>${job.applicationCount || 0}</td>
                            <td>${new Date(job.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn-secondary btn-sm" onclick="window.open('/job-details.html?id=${job.id}', '_blank')">View</button>
                                <button class="btn-danger btn-sm" onclick="deleteJobAdmin(${job.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('jobsList').innerHTML = 
            '<p style="text-align: center; color: #f44336; padding: 40px;">Error loading jobs.</p>';
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
        
        const result = await response.json();
        const applications = result.data;
        const container = document.getElementById('applicationsList');
        
        if (!applications || applications.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No applications found</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Job Seeker</th>
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
                            <td>#${app.id}</td>
                            <td>${app.jobSeekerName || 'N/A'}</td>
                            <td>${app.jobTitle || 'N/A'}</td>
                            <td>${app.companyName || 'N/A'}</td>
                            <td><span class="status-badge ${app.status}">${app.status}</span></td>
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
            '<p style="text-align: center; color: #f44336; padding: 40px;">Error loading applications.</p>';
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
async function viewUser(userId) {
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load user details');
        }
        
        const result = await response.json();
        const user = result.data;
        
        alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.isVerified ? 'Verified' : 'Not Verified'}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}`);
    } catch (error) {
        console.error('Error viewing user:', error);
        alert('Error loading user details');
    }
}

async function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ isActive: false })
            });
            
            if (response.ok) {
                alert('User suspended successfully');
                loadAllUsers(); // Reload the list
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error suspending user:', error);
            alert('Error suspending user');
        }
    }
}

async function verifyUser(userId) {
    if (confirm('Verify this user?')) {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ isVerified: true })
            });
            
            if (response.ok) {
                alert('User verified successfully');
                loadAllUsers();
                loadRecruiters(); // Also reload recruiters list if showing
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error verifying user:', error);
            alert('Error verifying user');
        }
    }
}

async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone!')) {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            if (response.ok) {
                alert('User deleted successfully');
                loadAllUsers();
                loadDashboardData(); // Refresh stats
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    }
}

function verifyCompany(userId) {
    verifyUser(userId); // Alias for verifyUser
}

function viewJob(jobId) {
    // Open job details in new tab/window
    window.open(`/job-details.html?id=${jobId}`, '_blank');
}

async function deleteJobAdmin(jobId) {
    if (confirm('Are you sure you want to delete this job? This will also delete all applications!')) {
        try {
            const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            if (response.ok) {
                alert('Job deleted successfully');
                loadAllJobs();
                loadDashboardData(); // Refresh stats
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Error deleting job');
        }
    }
}

function viewApplication(appId) {
    alert('View application details for ID: ' + appId + '\n\n(Application details view coming soon)');
}

// ==================== NOTIFICATION SYSTEM ====================
async function loadNotifications() {
    try {
        const response = await fetch(`${API_URL}/notifications/admin`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const result = await response.json();
            displayNotifications(result.data, result.unreadCount);
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function displayNotifications(notifications, unreadCount) {
    const notificationList = document.querySelector('.notification-list');
    const badge = document.querySelector('.notification-btn .badge');
    
    // Update badge
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
    
    // Display notifications
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div style="padding: 40px 20px; text-align: center; color: #9ca3af;">
                <i class="fas fa-bell-slash" style="font-size: 48px; margin-bottom: 10px;"></i>
                <p>No notifications yet</p>
            </div>
        `;
        return;
    }
    
    notificationList.innerHTML = notifications.map(notif => {
        const timeAgo = getTimeAgo(notif.time);
        return `
            <div class="notification-item ${notif.unread ? 'unread' : ''}">
                <div class="notification-icon ${notif.color}">
                    <i class="fas ${notif.icon}"></i>
                </div>
                <div class="notification-content">
                    <p><strong>${notif.title}</strong></p>
                    <p class="notification-text">${notif.message}</p>
                    <span class="notification-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('active');
    
    // Load notifications when opening
    if (dropdown.classList.contains('active')) {
        loadNotifications();
        setTimeout(() => {
            document.addEventListener('click', closeNotificationsOnClickOutside);
        }, 0);
    }
}

function closeNotificationsOnClickOutside(e) {
    const dropdown = document.getElementById('notificationDropdown');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (!dropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        dropdown.classList.remove('active');
        document.removeEventListener('click', closeNotificationsOnClickOutside);
    }
}

function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    
    // Update badge count
    const badge = document.querySelector('.notification-btn .badge');
    badge.textContent = '0';
    badge.style.display = 'none';
    
    alert('All notifications marked as read!');
}

function viewAllNotifications() {
    alert('View all notifications feature - Coming soon!');
    return false;
}

// ==================== REPORT GENERATION ====================
let currentReportData = null;

async function generateReport(reportType) {
    try {
        const period = document.getElementById('reportPeriod').value;
        const reportDisplay = document.getElementById('reportDisplay');
        const reportTitle = document.getElementById('reportTitle');
        const reportContent = document.getElementById('reportContent');
        
        // Show loading
        reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #6366f1;"></i><p style="margin-top: 20px;">Generating report...</p></div>';
        reportDisplay.style.display = 'block';
        reportDisplay.scrollIntoView({ behavior: 'smooth' });
        
        const response = await fetch(`${API_URL}/reports/${reportType}?period=${period}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate report');
        }
        
        const result = await response.json();
        currentReportData = result.data;
        
        // Update title
        const titles = {
            'user-growth': 'User Growth Report',
            'jobs': 'Jobs Report',
            'applications': 'Application Analytics Report',
            'companies': 'Company Performance Report',
            'platform-overview': 'Platform Overview Report'
        };
        reportTitle.textContent = titles[reportType] || 'Report';
        
        // Display report based on type
        switch(reportType) {
            case 'user-growth':
                displayUserGrowthReport(result.data);
                break;
            case 'jobs':
                displayJobsReport(result.data);
                break;
            case 'applications':
                displayApplicationsReport(result.data);
                break;
            case 'companies':
                displayCompaniesReport(result.data);
                break;
            case 'platform-overview':
                displayPlatformOverviewReport(result.data);
                break;
        }
    } catch (error) {
        console.error('Error generating report:', error);
        document.getElementById('reportContent').innerHTML = 
            '<div style="text-align: center; padding: 40px; color: #ef4444;"><i class="fas fa-exclamation-circle" style="font-size: 48px;"></i><p style="margin-top: 20px;">Error generating report. Please try again.</p></div>';
    }
}

function displayUserGrowthReport(data) {
    const content = `
        <div style="padding: 20px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #1f2937;">Summary (${data.period})</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Total New Users</p>
                        <p style="font-size: 32px; font-weight: bold; color: #6366f1; margin: 5px 0 0 0;">${data.totalUsers}</p>
                    </div>
                    ${data.usersByRole.map(role => `
                        <div style="background: white; padding: 15px; border-radius: 8px;">
                            <p style="color: #6b7280; margin: 0; font-size: 14px;">${role.role}s</p>
                            <p style="font-size: 32px; font-weight: bold; color: #10b981; margin: 5px 0 0 0;">${role.count}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <h4 style="margin: 20px 0 10px 0;">Daily Growth Trend</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Role</th>
                        <th>New Users</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.dailyGrowth.map(day => `
                        <tr>
                            <td>${new Date(day.date).toLocaleDateString()}</td>
                            <td><span class="status-badge ${day.role}">${day.role}</span></td>
                            <td>${day.count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('reportContent').innerHTML = content;
}

function displayJobsReport(data) {
    const content = `
        <div style="padding: 20px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #1f2937;">Summary (${data.period})</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Total Jobs Posted</p>
                        <p style="font-size: 32px; font-weight: bold; color: #6366f1; margin: 5px 0 0 0;">${data.totalJobs}</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Average Salary</p>
                        <p style="font-size: 32px; font-weight: bold; color: #10b981; margin: 5px 0 0 0;">₹${Math.round(data.averageSalary/100000)}L</p>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4 style="margin: 0 0 10px 0;">Jobs by Type</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.jobsByType.map(type => `
                                <tr>
                                    <td>${type.jobType || 'Not specified'}</td>
                                    <td>${type.count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <h4 style="margin: 0 0 10px 0;">Jobs by Work Mode</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Work Mode</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.jobsByWorkMode.map(mode => `
                                <tr>
                                    <td>${mode.workMode || 'Not specified'}</td>
                                    <td>${mode.count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <h4 style="margin: 20px 0 10px 0;">Top 10 Companies</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Company</th>
                        <th>Jobs Posted</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.topCompanies.map((company, index) => `
                        <tr>
                            <td>#${index + 1}</td>
                            <td>${company.companyName || 'Unknown'}</td>
                            <td>${company.jobCount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('reportContent').innerHTML = content;
}

function displayApplicationsReport(data) {
    const content = `
        <div style="padding: 20px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #1f2937;">Summary (${data.period})</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Total Applications</p>
                        <p style="font-size: 32px; font-weight: bold; color: #6366f1; margin: 5px 0 0 0;">${data.totalApplications}</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Hired</p>
                        <p style="font-size: 32px; font-weight: bold; color: #10b981; margin: 5px 0 0 0;">${data.metrics.hired}</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Conversion Rate</p>
                        <p style="font-size: 32px; font-weight: bold; color: #f59e0b; margin: 5px 0 0 0;">${data.metrics.conversionRate}%</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Shortlist Rate</p>
                        <p style="font-size: 32px; font-weight: bold; color: #8b5cf6; margin: 5px 0 0 0;">${data.metrics.shortlistRate}%</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Rejection Rate</p>
                        <p style="font-size: 32px; font-weight: bold; color: #ef4444; margin: 5px 0 0 0;">${data.metrics.rejectionRate}%</p>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4 style="margin: 0 0 10px 0;">Applications by Status</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Count</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.applicationsByStatus.map(status => `
                                <tr>
                                    <td><span class="status-badge ${status.status}">${status.status}</span></td>
                                    <td>${status.count}</td>
                                    <td>${((status.count / data.totalApplications) * 100).toFixed(1)}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <h4 style="margin: 0 0 10px 0;">Daily Applications</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Applications</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.dailyApplications.slice(-10).map(day => `
                                <tr>
                                    <td>${new Date(day.date).toLocaleDateString()}</td>
                                    <td>${day.count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.getElementById('reportContent').innerHTML = content;
}

function displayCompaniesReport(data) {
    const content = `
        <div style="padding: 20px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #1f2937;">Summary (${data.period})</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Total Companies</p>
                        <p style="font-size: 32px; font-weight: bold; color: #6366f1; margin: 5px 0 0 0;">${data.totalCompanies}</p>
                    </div>
                </div>
            </div>
            
            <h4 style="margin: 20px 0 10px 0;">Top Performing Companies</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Company</th>
                        <th>Jobs Posted</th>
                        <th>Total Applications</th>
                        <th>Hired</th>
                        <th>Avg Apps/Job</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.companies.map((company, index) => `
                        <tr>
                            <td>#${index + 1}</td>
                            <td>${company.companyName}</td>
                            <td>${company.totalJobs}</td>
                            <td>${company.totalApplications}</td>
                            <td>${company.hiredCount}</td>
                            <td>${company.avgApplicationsPerJob}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('reportContent').innerHTML = content;
}

function displayPlatformOverviewReport(data) {
    const content = `
        <div style="padding: 20px;">
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #1f2937;">Platform Overview (${data.period})</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Total Users</p>
                        <p style="font-size: 32px; font-weight: bold; color: #6366f1; margin: 5px 0 0 0;">${data.overview.totalUsers}</p>
                        <p style="color: #10b981; font-size: 12px; margin: 5px 0 0 0;">+${data.recentActivity.newUsers} new</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Total Jobs</p>
                        <p style="font-size: 32px; font-weight: bold; color: #10b981; margin: 5px 0 0 0;">${data.overview.totalJobs}</p>
                        <p style="color: #10b981; font-size: 12px; margin: 5px 0 0 0;">+${data.recentActivity.newJobs} new</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Active Jobs</p>
                        <p style="font-size: 32px; font-weight: bold; color: #f59e0b; margin: 5px 0 0 0;">${data.overview.activeJobs}</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Total Applications</p>
                        <p style="font-size: 32px; font-weight: bold; color: #8b5cf6; margin: 5px 0 0 0;">${data.overview.totalApplications}</p>
                        <p style="color: #10b981; font-size: 12px; margin: 5px 0 0 0;">+${data.recentActivity.newApplications} new</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">Success Rate</p>
                        <p style="font-size: 32px; font-weight: bold; color: #ef4444; margin: 5px 0 0 0;">${data.overview.successRate}%</p>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4 style="margin: 0 0 10px 0;">Users by Role</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.usersByRole.map(role => `
                                <tr>
                                    <td><span class="status-badge ${role.role}">${role.role}</span></td>
                                    <td>${role.count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <h4 style="margin: 0 0 10px 0;">Platform Metrics</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Avg Applications per Job</td>
                                <td>${data.metrics.avgApplicationsPerJob}</td>
                            </tr>
                            <tr>
                                <td>Avg Jobs per Company</td>
                                <td>${data.metrics.avgJobsPerCompany}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.getElementById('reportContent').innerHTML = content;
}

function downloadReport() {
    if (!currentReportData) {
        alert('No report data available');
        return;
    }
    
    // Convert report to JSON and download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentReportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    alert('Report downloaded as JSON. For PDF export, you can print this page using your browser.');
}
