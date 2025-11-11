// Job Seeker Dashboard JavaScript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : window.location.origin + '/api';
let currentUser = null;
let authToken = null;

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user || user.role !== 'jobseeker') {
        alert('Please login as a job seeker first');
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
    
    loadUserData();
    loadDashboardData();
    setupNavigation();
    setupEventListeners();
    loadNotifications(); // Load notifications on page load
});

// Load user data
function loadUserData() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.querySelector('.user-menu img').src = 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=fff`;
    }
}

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
    
    // Profile form
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    
    // Resume upload
    const resumeInput = document.getElementById('resumeInput');
    const uploadArea = document.getElementById('resumeUploadArea');
    
    uploadArea.addEventListener('click', () => resumeInput.click());
    resumeInput.addEventListener('change', handleResumeUpload);
    
    document.getElementById('deleteResume')?.addEventListener('click', handleResumeDelete);
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load dashboard stats from API
        const dashboardResponse = await fetch(`${API_URL}/dashboard/jobseeker`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (dashboardResponse.ok) {
            const result = await dashboardResponse.json();
            const stats = result.data.stats;
            
            // Update all stat cards
            document.getElementById('appliedCount').textContent = stats.totalApplications || 0;
            document.getElementById('savedCount').textContent = stats.savedJobs || 0;
            document.getElementById('interviewCount').textContent = stats.interviewed || 0;
            document.getElementById('profileViews').textContent = stats.profileViews || 0;
        }
        
        // Load applications
        const appsResponse = await fetch(`${API_URL}/applications/my-applications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (appsResponse.ok) {
            const applications = await appsResponse.json();
            // Show recent applications
            displayRecentApplications(applications.data?.slice(0, 5) || applications.slice(0, 5));
        }
        
        // Load recommended jobs
        loadRecommendedJobs();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Display recent applications
function displayRecentApplications(applications) {
    const container = document.getElementById('recentApplications');
    
    if (!applications || applications.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No applications yet</p>';
        return;
    }
    
    container.innerHTML = applications.map(app => `
        <div class="application-item">
            <div class="application-info">
                <h4>${app.job?.title || 'Job Title'}</h4>
                <p><i class="fas fa-building"></i> ${app.job?.companyName || 'Company'}</p>
                <p><i class="fas fa-calendar"></i> Applied on ${new Date(app.createdAt).toLocaleDateString()}</p>
            </div>
            <span class="status-badge ${app.status}">${app.status.replace('_', ' ')}</span>
        </div>
    `).join('');
}

// Load recommended jobs
async function loadRecommendedJobs() {
    try {
        const response = await fetch(`${API_URL}/jobs?limit=5`);
        const data = await response.json();
        
        const container = document.getElementById('recommendedJobs');
        
        if (!data.jobs || data.jobs.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No jobs available</p>';
            return;
        }
        
        container.innerHTML = data.jobs.map(job => `
            <div class="job-card">
                <h4>${job.title}</h4>
                <p><i class="fas fa-building"></i> ${job.companyName}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                <p><i class="fas fa-rupee-sign"></i> ${formatSalary(job.salary)}</p>
                <div class="job-meta">
                    <span><i class="fas fa-clock"></i> ${job.type}</span>
                    <span><i class="fas fa-briefcase"></i> ${job.experience}</span>
                </div>
                <button class="btn-primary btn-sm" onclick="applyToJob(${job.id})">Apply Now</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading recommended jobs:', error);
    }
}

// Load page specific data
async function loadPageData(pageId) {
    switch(pageId) {
        case 'profile':
            loadProfileData();
            break;
        case 'browse-jobs':
            loadBrowseJobs();
            break;
        case 'applied-jobs':
            loadAppliedJobs();
            break;
        case 'saved-jobs':
            loadSavedJobs();
            break;
        case 'interviews':
            loadInterviews();
            break;
    }
}

// Load profile data
function loadProfileData() {
    if (currentUser) {
        document.getElementById('profile-name').value = currentUser.name || '';
        document.getElementById('profile-email').value = currentUser.email || '';
        document.getElementById('profile-phone').value = currentUser.phone || '';
        document.getElementById('profile-location').value = currentUser.location || 'Amritsar';
        document.getElementById('profile-bio').value = currentUser.bio || '';
        document.getElementById('profile-experience').value = currentUser.experience || 'fresher';
        document.getElementById('profile-education').value = currentUser.education || 'Graduate';
        document.getElementById('profile-skills').value = currentUser.skills?.join(', ') || '';
    }
}

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('profile-name').value,
        phone: document.getElementById('profile-phone').value,
        location: document.getElementById('profile-location').value,
        bio: document.getElementById('profile-bio').value,
        experience: document.getElementById('profile-experience').value,
        education: document.getElementById('profile-education').value,
        skills: document.getElementById('profile-skills').value.split(',').map(s => s.trim())
    };
    
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Profile updated successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
}

// Load browse jobs
async function loadBrowseJobs() {
    try {
        const response = await fetch(`${API_URL}/jobs`);
        const data = await response.json();
        
        const container = document.getElementById('browseJobsList');
        
        if (!data.data || data.data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No jobs available</p>';
            return;
        }
        
        container.innerHTML = data.data.map(job => `
            <div class="job-card">
                <h4>${job.title}</h4>
                <p><i class="fas fa-building"></i> ${job.companyName}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                <p><i class="fas fa-rupee-sign"></i> ${formatSalary(job.salary)}</p>
                <p><i class="fas fa-briefcase"></i> ${job.experienceRequired || 'Any'}</p>
                <div class="job-meta">
                    <span><i class="fas fa-clock"></i> ${job.jobType || 'Full-time'}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <button class="btn-primary btn-sm" onclick="applyToJob(${job.id})">Apply Now</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

// Load applied jobs
async function loadAppliedJobs() {
    try {
        const response = await fetch(`${API_URL}/applications/my-applications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const applications = await response.json();
            const container = document.getElementById('appliedJobsList');
            
            if (!applications || applications.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No applications yet</p>';
                return;
            }
            
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${applications.map(app => `
                            <tr>
                                <td>${app.job?.title || 'N/A'}</td>
                                <td>${app.job?.companyName || 'N/A'}</td>
                                <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                                <td><span class="status-badge ${app.status}">${app.status.replace('_', ' ')}</span></td>
                                <td>
                                    <button class="btn-secondary btn-sm" onclick="viewApplication(${app.id})">View</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

// Load saved jobs
function loadSavedJobs() {
    const container = document.getElementById('savedJobsList');
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No saved jobs yet</p>';
}

// Load interviews
function loadInterviews() {
    const container = document.getElementById('interviewsList');
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No interviews scheduled</p>';
}

// Apply to job - Open modal
async function applyToJob(jobId) {
    try {
        // Fetch job details
        const response = await fetch(`${API_URL}/jobs/${jobId}`);
        if (!response.ok) {
            alert('Failed to load job details');
            return;
        }
        
        const result = await response.json();
        const job = result.data;
        
        // Populate modal with job details
        document.getElementById('apply-jobId').value = jobId;
        document.getElementById('jobDetailsPreview').innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #333;">${job.title}</h3>
            <p style="margin: 0; color: #666;">
                <i class="fas fa-building"></i> ${job.companyName} &nbsp;|&nbsp;
                <i class="fas fa-map-marker-alt"></i> ${job.location?.city || 'Amritsar'}
            </p>
        `;
        
        // Pre-fill form with user data if available
        if (currentUser) {
            document.getElementById('app-name').value = currentUser.name || '';
            document.getElementById('app-email').value = currentUser.email || '';
            document.getElementById('app-phone').value = currentUser.phone || '';
            document.getElementById('app-experience').value = currentUser.experience || '';
            document.getElementById('app-location').value = currentUser.currentLocation || 'Amritsar';
            document.getElementById('app-skills').value = currentUser.skills?.join(', ') || '';
            document.getElementById('app-education').value = currentUser.education || '';
        }
        
        // Show modal
        document.getElementById('applicationModal').style.display = 'flex';
        
    } catch (error) {
        console.error('Error loading job details:', error);
        alert('Error loading job details');
    }
}

// Close application modal
function closeApplicationModal() {
    document.getElementById('applicationModal').style.display = 'none';
    document.getElementById('applicationForm').reset();
}

// Handle application form submission
document.addEventListener('DOMContentLoaded', () => {
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const jobId = document.getElementById('apply-jobId').value;
            
            // Use FormData for file upload (SAME as home page)
            const formData = new FormData();
            formData.append('name', document.getElementById('app-name').value);
            formData.append('email', document.getElementById('app-email').value);
            formData.append('phone', document.getElementById('app-phone').value);
            formData.append('experience', document.getElementById('app-experience').value);
            formData.append('currentLocation', document.getElementById('app-location').value);
            formData.append('currentJobTitle', document.getElementById('app-job-title').value);
            formData.append('skills', document.getElementById('app-skills').value);
            formData.append('education', document.getElementById('app-education').value);
            formData.append('coverLetter', document.getElementById('app-cover-letter').value);
            formData.append('expectedSalary', document.getElementById('app-salary').value);
            formData.append('noticePeriod', document.getElementById('app-notice-period').value);
            
            // Add resume file if selected
            const resumeFile = document.getElementById('app-resume').files[0];
            if (resumeFile) {
                formData.append('resume', resumeFile);
            }
            
            try {
                const response = await fetch(`${API_URL}/applications/${jobId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                        // Don't set Content-Type - browser will set it with boundary for FormData
                    },
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('✅ Application submitted successfully!');
                    closeApplicationModal();
                    loadDashboardData();
                    loadAppliedJobs();
                } else {
                    alert('❌ Error: ' + (result.message || 'Failed to submit application'));
                }
            } catch (error) {
                console.error('Error submitting application:', error);
                alert('❌ Error submitting application. Please try again.');
            }
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeApplicationModal();
            }
        });
    }
});

// Alias function for compatibility
function loadMyApplications() {
    loadAppliedJobs();
}

// Handle resume upload
function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('resumeUploadArea').style.display = 'none';
        document.getElementById('resumePreview').style.display = 'flex';
        document.getElementById('resumeName').textContent = file.name;
        document.getElementById('resumeSize').textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    }
}

// Handle resume delete
function handleResumeDelete() {
    document.getElementById('resumeUploadArea').style.display = 'block';
    document.getElementById('resumePreview').style.display = 'none';
    document.getElementById('resumeInput').value = '';
}

// View application
function viewApplication(appId) {
    alert('View application details for ID: ' + appId);
}

// Format salary
function formatSalary(salary) {
    if (!salary) return 'Not disclosed';
    if (typeof salary === 'object') {
        if (salary.type === 'yearly') {
            return `₹${salary.min/100000}-${salary.max/100000} LPA`;
        }
        return `₹${salary.min/1000}-${salary.max/1000}k/month`;
    }
    return salary;
}

// ==================== NOTIFICATION SYSTEM ====================
async function loadNotifications() {
    try {
        const response = await fetch(`${API_URL}/notifications/jobseeker`, {
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
