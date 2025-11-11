
// Recruiter Dashboard JavaScript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : window.location.origin + '/api';
let currentUser = null;
let authToken = null;

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user || user.role !== 'employer') {
        alert('Please login as a recruiter/employer first');
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
});

// Load user data
function loadUserData() {
    if (currentUser) {
        document.getElementById('companyName').textContent = currentUser.companyName || currentUser.name;
        document.querySelector('.user-menu img').src = 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.companyName || currentUser.name)}&background=f59e0b&color=fff`;
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
    
    // Company profile form
    document.getElementById('companyProfileForm').addEventListener('submit', handleCompanyProfileUpdate);
    
    // Post job form
    document.getElementById('postJobForm').addEventListener('submit', handlePostJob);
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load company's jobs
        const jobsResponse = await fetch(`${API_URL}/jobs/my-jobs`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (jobsResponse.ok) {
            const result = await jobsResponse.json();
            const jobs = result.data || result;
            document.getElementById('activeJobsCount').textContent = jobs.length;
            
            // Calculate total applicants
            let totalApplicants = 0;
            jobs.forEach(job => {
                totalApplicants += job.Applications?.length || 0;
            });
            document.getElementById('totalApplicantsCount').textContent = totalApplicants;
            
            // Load recent applicants
            loadRecentApplicants();
        }
        
        // Update other stats (these would come from real APIs)
        document.getElementById('shortlistedCount').textContent = '0';
        document.getElementById('jobViewsCount').textContent = '0';
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load recent applicants
async function loadRecentApplicants() {
    try {
        const response = await fetch(`${API_URL}/applications/employer-applications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const applications = await response.json();
            const container = document.getElementById('recentApplicants');
            
            if (!applications || applications.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666;">No applications yet</p>';
                return;
            }
            
            container.innerHTML = applications.slice(0, 5).map(app => `
                <div class="applicant-item">
                    <div class="applicant-info">
                        <h4>${app.applicant?.name || 'Applicant'}</h4>
                        <p><i class="fas fa-briefcase"></i> Applied for: ${app.job?.title || 'Job'}</p>
                        <p><i class="fas fa-calendar"></i> ${new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span class="status-badge ${app.status}">${app.status.replace('_', ' ')}</span>
                    <button class="btn-primary btn-sm" onclick="viewApplicant(${app.id})">View</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading applicants:', error);
    }
}

// Load page specific data
async function loadPageData(pageId) {
    switch(pageId) {
        case 'company-profile':
            loadCompanyProfile();
            break;
        case 'my-jobs':
            loadMyJobs();
            break;
        case 'applicants':
            loadAllApplicants();
            break;
        case 'shortlisted':
            loadShortlisted();
            break;
        case 'interviews':
            loadInterviews();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// Load company profile
function loadCompanyProfile() {
    if (currentUser) {
        document.getElementById('company-name').value = currentUser.companyName || '';
        document.getElementById('company-industry').value = currentUser.industry || 'IT';
        document.getElementById('company-email').value = currentUser.email || '';
        document.getElementById('company-phone').value = currentUser.phone || '';
        document.getElementById('company-location').value = currentUser.location || 'Amritsar, Punjab';
        document.getElementById('company-size').value = currentUser.companySize || '1-10';
        document.getElementById('company-about').value = currentUser.about || '';
        document.getElementById('company-website').value = currentUser.website || '';
    }
}

// Handle company profile update
async function handleCompanyProfileUpdate(e) {
    e.preventDefault();
    
    const formData = {
        companyName: document.getElementById('company-name').value,
        industry: document.getElementById('company-industry').value,
        phone: document.getElementById('company-phone').value,
        location: document.getElementById('company-location').value,
        companySize: document.getElementById('company-size').value,
        about: document.getElementById('company-about').value,
        website: document.getElementById('company-website').value
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
            alert('Company profile updated successfully!');
            loadUserData();
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
}

// Handle post job
async function handlePostJob(e) {
    e.preventDefault();
    
    // Parse location
    const locationText = document.getElementById('job-location').value;
    const locationParts = locationText.split(',').map(s => s.trim());
    
    // Parse requirements from textarea
    const requirementsText = document.getElementById('job-requirements').value;
    const requirementsArray = requirementsText 
        ? requirementsText.split('\n').filter(r => r.trim()).map(r => r.trim())
        : [];
    
    const formData = {
        title: document.getElementById('job-title').value,
        jobType: document.getElementById('job-type').value, // Changed from 'type' to 'jobType'
        category: document.getElementById('job-category').value,
        location: {
            city: locationParts[0] || 'Amritsar',
            state: locationParts[1] || 'Punjab',
            country: 'India'
        },
        workMode: 'office', // Default work mode
        salary: {
            type: document.getElementById('salary-type').value,
            min: parseInt(document.getElementById('salary-min').value),
            max: parseInt(document.getElementById('salary-max').value),
            currency: 'INR'
        },
        experienceRequired: document.getElementById('job-experience').value, // Changed from 'experience'
        educationRequired: '12th Pass', // Default education
        vacancies: parseInt(document.getElementById('job-vacancies').value),
        skills: document.getElementById('job-skills').value.split(',').map(s => s.trim()).filter(s => s),
        description: document.getElementById('job-description').value,
        requirements: requirementsArray, // Changed to array
        companyId: currentUser.id // Add company ID
    };
    
    // Add expiry date if deadline is set
    const deadline = document.getElementById('job-deadline').value;
    if (deadline) {
        formData.expiryDate = deadline; // Changed from 'deadline' to 'expiryDate'
    }
    
    try {
        const response = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Job posted successfully!');
            e.target.reset();
            loadDashboardData();
            // Switch to my-jobs page
            document.querySelector('[data-page="my-jobs"]').click();
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'Failed to post job'));
            console.error('Server error:', error);
        }
    } catch (error) {
        console.error('Error posting job:', error);
        alert('Error posting job: ' + error.message);
    }
}

// Load my jobs
async function loadMyJobs() {
    try {
        console.log('Loading my jobs...');
        const response = await fetch(`${API_URL}/jobs/my-jobs`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('API Response:', result);
            const jobs = result.data || result;
            console.log('Jobs array:', jobs);
            const container = document.getElementById('myJobsList');
            console.log('Container element:', container);
            
            if (!jobs || jobs.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No jobs posted yet</p>';
                return;
            }
            
            const tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Type</th>
                            <th>Applications</th>
                            <th>Posted Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${jobs.map(job => `
                            <tr>
                                <td><strong>${job.title}</strong></td>
                                <td>${job.jobType || 'Full-time'}</td>
                                <td>${job.applications?.length || job.applicationCount || 0}</td>
                                <td>${new Date(job.createdAt).toLocaleDateString()}</td>
                                <td><span class="status-badge ${job.status || 'active'}">${job.status || 'active'}</span></td>
                                <td>
                                    <button class="btn-secondary btn-sm" onclick="editJob(${job.id})">Edit</button>
                                    <button class="btn-danger btn-sm" onclick="deleteJob(${job.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            console.log('Setting table HTML, length:', tableHTML.length);
            container.innerHTML = tableHTML;
            console.log('Table set successfully');
        } else {
            console.error('Failed to load jobs:', response.status);
            document.getElementById('myJobsList').innerHTML = '<p style="text-align: center; color: #f44336; padding: 40px;">Error loading jobs</p>';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('myJobsList').innerHTML = '<p style="text-align: center; color: #f44336; padding: 40px;">Error loading jobs</p>';
    }
}

// Load all applicants
async function loadAllApplicants() {
    try {
        const response = await fetch(`${API_URL}/applications/employer-applications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const applications = await response.json();
            const container = document.getElementById('applicantsList');
            
            if (!applications || applications.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No applications yet</p>';
                return;
            }
            
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Applicant ID</th>
                            <th>Job Title</th>
                            <th>Experience</th>
                            <th>Skills</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${applications.map(app => `
                            <tr>
                                <td><strong>${app.applicant?.anonymousName || 'Applicant ' + app.applicantId}</strong></td>
                                <td>${app.job?.title || 'N/A'}</td>
                                <td>${app.applicant?.experience || 'N/A'}</td>
                                <td>${app.applicant?.skills ? (app.applicant.skills.length > 30 ? app.applicant.skills.substring(0, 30) + '...' : app.applicant.skills) : 'N/A'}</td>
                                <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                                <td><span class="status-badge ${app.status}">${app.status.replace('_', ' ')}</span></td>
                                <td>
                                    <button class="btn-primary btn-sm" onclick="viewApplicant(${app.id})">View Details</button>
                                    <button class="btn-secondary btn-sm" onclick="updateStatus(${app.id}, 'shortlisted')">Shortlist</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error('Error loading applicants:', error);
    }
}

// Load shortlisted
function loadShortlisted() {
    const container = document.getElementById('shortlistedList');
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No shortlisted candidates yet</p>';
}

// Load interviews
function loadInterviews() {
    const container = document.getElementById('interviewsCalendar');
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No interviews scheduled</p>';
}

// Load analytics
function loadAnalytics() {
    console.log('Loading analytics...');
}

// View applicant
async function viewApplicant(appId) {
    try {
        const response = await fetch(`${API_URL}/applications/${appId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (!response.ok) {
            alert('Error loading applicant details');
            return;
        }
        
        const result = await response.json();
        const app = result.data || result;
        
        // Parse additional data
        let additionalData = {};
        try {
            if (app.employerNotes) {
                additionalData = JSON.parse(app.employerNotes);
            }
        } catch (e) {
            console.log('Error parsing data:', e);
        }
        
        // Determine display name and contact info based on access
        const displayName = app.accessGranted ? app.applicant.name : (additionalData.anonymousName || 'Applicant ' + app.applicantId);
        const hasAccess = app.accessGranted === true;
        const accessRequested = app.accessRequested === true;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto; width: 90%;">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                        margin: 0 auto 20px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);">
                        <i class="fas fa-user-tie" style="color: white; font-size: 32px;"></i>
                    </div>
                    <h2 style="margin: 0; font-size: 28px; color: #fff;">
                        ${displayName}
                    </h2>
                    <p style="color: #999; margin-top: 8px;">Applied for: ${app.job?.title || 'N/A'}</p>
                    <span class="status-badge ${app.status}" style="font-size: 14px; margin-top: 10px; display: inline-block;">
                        ${app.status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
                
                <!-- Access Status Notice -->
                ${!hasAccess ? `
                <div style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%); 
                    padding: 15px 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
                        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                            <i class="fas fa-shield-alt" style="color: #ffc107; font-size: 20px;"></i>
                            <div>
                                <strong style="color: #fff; display: block;">
                                    ${accessRequested ? 'Access Request Pending' : 'Anonymous Application'}
                                </strong>
                                <small style="color: #ccc;">
                                    ${accessRequested ? 'Waiting for admin approval to view contact details' : 'Contact information is hidden. Request access to view real details.'}
                                </small>
                            </div>
                        </div>
                        ${!accessRequested ? `
                        <button onclick="requestDetailsAccess(${app.id}); this.parentElement.parentElement.parentElement.remove();" 
                            style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; 
                            white-space: nowrap; font-size: 14px;">
                            <i class="fas fa-unlock"></i> Request Access
                        </button>
                        ` : ''}
                    </div>
                </div>
                ` : `
                <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%); 
                    padding: 15px 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #10b981;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-check-circle" style="color: #10b981; font-size: 20px;"></i>
                        <div>
                            <strong style="color: #fff; display: block;">Full Access Granted</strong>
                            <small style="color: #ccc;">You have permission to view all applicant details including contact information.</small>
                        </div>
                    </div>
                </div>
                `}
                
                <!-- Contact Information (Only if access granted) -->
                ${hasAccess ? `
                <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <i class="fas fa-address-card" style="color: #667eea;"></i>
                        <strong style="color: #fff;">Contact Information</strong>
                    </div>
                    <div style="display: grid; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-envelope" style="color: #999; width: 20px;"></i>
                            <span style="color: #ccc;">${app.applicant.email}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-phone" style="color: #999; width: 20px;"></i>
                            <span style="color: #ccc;">${app.applicant.phone || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Application Details Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-briefcase" style="color: #667eea;"></i>
                            <strong style="color: #fff;">Experience</strong>
                        </div>
                        <p style="color: #ccc; margin: 0;">${additionalData.experience || 'Not specified'}</p>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-graduation-cap" style="color: #667eea;"></i>
                            <strong style="color: #fff;">Education</strong>
                        </div>
                        <p style="color: #ccc; margin: 0;">${additionalData.education || 'Not specified'}</p>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-map-marker-alt" style="color: #667eea;"></i>
                            <strong style="color: #fff;">Location</strong>
                        </div>
                        <p style="color: #ccc; margin: 0;">${additionalData.currentLocation || 'Not specified'}</p>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-id-badge" style="color: #667eea;"></i>
                            <strong style="color: #fff;">Current Role</strong>
                        </div>
                        <p style="color: #ccc; margin: 0;">${additionalData.currentJobTitle || 'Not specified'}</p>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-money-bill-wave" style="color: #667eea;"></i>
                            <strong style="color: #fff;">Expected Salary</strong>
                        </div>
                        <p style="color: #ccc; margin: 0;">${additionalData.expectedSalary ? '₹' + additionalData.expectedSalary + '/month' : 'Not specified'}</p>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-calendar-alt" style="color: #667eea;"></i>
                            <strong style="color: #fff;">Notice Period</strong>
                        </div>
                        <p style="color: #ccc; margin: 0;">${additionalData.noticePeriod || 'Not specified'}</p>
                    </div>
                </div>
                
                <!-- Skills Section -->
                ${additionalData.skills ? `
                <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <i class="fas fa-code" style="color: #667eea;"></i>
                        <strong style="color: #fff;">Skills</strong>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${additionalData.skills.split(',').map(skill => 
                            `<span style="background: rgba(102, 126, 234, 0.2); color: #667eea; padding: 6px 12px; 
                                border-radius: 20px; font-size: 13px; border: 1px solid rgba(102, 126, 234, 0.3);">
                                ${skill.trim()}
                            </span>`
                        ).join('')}
                    </div>
                </div>` : ''}
                
                <!-- Cover Letter -->
                ${app.coverLetter ? `
                <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <i class="fas fa-pen" style="color: #667eea;"></i>
                        <strong style="color: #fff;">Cover Letter</strong>
                    </div>
                    <p style="color: #ccc; line-height: 1.6; margin: 0; white-space: pre-wrap;">${app.coverLetter}</p>
                </div>` : ''}
                
                <!-- Resume/CV -->
                ${app.resume && app.resume !== 'No resume provided' ? `
                <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-file-pdf" style="color: #ef4444; font-size: 24px;"></i>
                            <div>
                                <strong style="color: #fff; display: block;">Resume/CV</strong>
                                <small style="color: #999;">Uploaded document</small>
                            </div>
                        </div>
                        <a href="/${app.resume}" target="_blank" download
                            style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; 
                            text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="fas fa-download"></i> Download Resume
                        </a>
                    </div>
                </div>` : ''}
                
                <!-- Application Info -->
                <div style="background: rgba(255, 255, 255, 0.03); padding: 15px 20px; border-radius: 12px; margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <i class="fas fa-calendar" style="color: #667eea;"></i>
                            <span style="color: #ccc; margin-left: 8px;">Applied on: ${new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 15px; margin-top: 25px;">
                    <button onclick="updateStatus(${app.id}, 'shortlisted'); this.parentElement.parentElement.parentElement.remove();" 
                        style="flex: 1; padding: 14px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 15px;">
                        <i class="fas fa-check-circle"></i> Shortlist
                    </button>
                    <button onclick="updateStatus(${app.id}, 'rejected'); this.parentElement.parentElement.parentElement.remove();" 
                        style="flex: 1; padding: 14px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                        color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 15px;">
                        <i class="fas fa-times-circle"></i> Reject
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
    } catch (error) {
        console.error('Error viewing applicant:', error);
        alert('Error loading applicant details');
    }
}

// Request access to applicant details
async function requestDetailsAccess(appId) {
    try {
        const response = await fetch(`${API_URL}/applications/${appId}/request-details`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            alert('Access request submitted! You will be notified when admin approves.');
            loadAllApplicants();
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error requesting access:', error);
        alert('Error requesting access');
    }
}

// Update application status
async function updateStatus(appId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/applications/${appId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            alert('Status updated successfully!');
            loadAllApplicants();
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
    }
}

// Edit job
function editJob(jobId) {
    alert('Edit job ID: ' + jobId);
}

// Delete job
async function deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
        const response = await fetch(`${API_URL}/jobs/${jobId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            alert('Job deleted successfully!');
            loadMyJobs();
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job');
    }
}
