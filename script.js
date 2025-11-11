// ==================== API CONFIGURATION ====================
const API_URL = window.location.hostname === 'localhost' ? 
    'http://localhost:5000/api' : 
    window.location.origin + '/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Set auth token
const setAuthToken = (token) => localStorage.setItem('token', token);

// Remove auth token
const removeAuthToken = () => localStorage.removeItem('token');

// Fetch with auth
const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    return response;
};

// ==================== SAMPLE JOB DATA (Fallback) ====================
// Removed mock data - using real jobs from database
const jobsData = [];

// ==================== DOM ELEMENTS ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLogin = document.getElementById('closeLogin');
const closeSignup = document.getElementById('closeSignup');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const jobsGrid = document.getElementById('jobsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const experienceFilter = document.getElementById('experienceFilter');
const salaryFilter = document.getElementById('salaryFilter');
const companyFilter = document.getElementById('companyFilter');
const searchInput = document.getElementById('searchInput');
const locationInput = document.getElementById('locationInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// ==================== MOBILE MENU TOGGLE ====================
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== MODAL FUNCTIONALITY ====================
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

signupBtn.addEventListener('click', () => {
    signupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeLogin.addEventListener('click', () => {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

closeSignup.addEventListener('click', () => {
    signupModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    signupModal.classList.add('active');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.remove('active');
    loginModal.classList.add('active');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    if (e.target === signupModal) {
        signupModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== NAVBAR SCROLL EFFECT ====================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ==================== ACTIVE NAV LINK ON SCROLL ====================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== USER APPLICATIONS TRACKING ====================
let userAppliedJobIds = new Set();

// Fetch user's applications
async function fetchUserApplications() {
    const token = getAuthToken();
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/applications/my-applications`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const applications = result.data || [];
            userAppliedJobIds = new Set(applications.map(app => app.jobId));
            console.log('User applied job IDs:', Array.from(userAppliedJobIds));
        }
    } catch (error) {
        console.error('Error fetching user applications:', error);
    }
}

// ==================== CREATE JOB CARD ====================
function createJobCard(job) {
    const isApplied = userAppliedJobIds.has(job.id);
    const applyButtonHtml = isApplied 
        ? `<button class="apply-btn" style="background: #10b981;" disabled>Applied ✓</button>`
        : `<button class="apply-btn" onclick="applyJob(${job.id})">Apply Now</button>`;
    
    return `
        <div class="job-card" data-type="${job.type}" data-experience="${job.experience}" data-company="${job.companyType}">
            <div class="job-header">
                <div class="company-logo">
                    <i class="${job.icon}"></i>
                </div>
                <div class="job-info">
                    <h3 class="job-title">${job.title}</h3>
                    <p class="company-name">
                        ${job.company}
                        ${job.verified ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
                    </p>
                </div>
                <button class="bookmark-btn" onclick="toggleBookmark(event)">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
            <div class="job-details">
                <span class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    ${job.location}
                </span>
                <span class="detail-item">
                    <i class="fas fa-briefcase"></i>
                    ${job.experience} Years
                </span>
                <span class="detail-item">
                    <i class="${job.remote ? 'fas fa-home' : 'fas fa-building'}"></i>
                    ${job.remote ? 'Remote' : 'Office'}
                </span>
            </div>
            <div class="job-tags">
                ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
            </div>
            <div class="job-footer">
                <div>
                    <div class="salary">${job.salary}</div>
                    <div class="posted-time">${job.posted}</div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-secondary btn-sm" onclick="viewJobDetails(${job.id})" style="padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                        View Details
                    </button>
                    ${applyButtonHtml}
                </div>
            </div>
        </div>
    `;
}

// View Job Details Modal
async function viewJobDetails(jobId) {
    try {
        const response = await fetch(`${API_URL}/jobs/${jobId}`);
        const result = await response.json();
        const job = result.data || result;
        
        const isApplied = userAppliedJobIds.has(job.id);
        const applyButtonHtml = isApplied 
            ? `<button class="apply-btn" style="white-space: nowrap; background: #10b981;" disabled>Applied ✓</button>`
            : `<button class="apply-btn" onclick="applyJob(${job.id})" style="white-space: nowrap;">Apply Now</button>`;
        
        const modal = document.createElement('div');
        modal.id = 'jobDetailsModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <span class="close" onclick="closeJobDetailsModal()">&times;</span>
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h2 style="margin-bottom: 10px;">${job.title}</h2>
                        <p style="color: var(--text-secondary); font-size: 18px; margin-bottom: 10px;">
                            <i class="fas fa-building"></i> ${job.companyName}
                        </p>
                        <p style="color: var(--text-secondary);">
                            <i class="fas fa-map-marker-alt"></i> ${job.location}
                        </p>
                    </div>
                    ${applyButtonHtml}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: rgba(99, 102, 241, 0.1); padding: 15px; border-radius: 10px;">
                        <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">Job Type</p>
                        <p style="font-weight: 600;">${job.jobType || 'Full-time'}</p>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 10px;">
                        <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">Work Mode</p>
                        <p style="font-weight: 600;">${job.workMode || 'Office'}</p>
                    </div>
                    <div style="background: rgba(245, 158, 11, 0.1); padding: 15px; border-radius: 10px;">
                        <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">Experience</p>
                        <p style="font-weight: 600;">${job.experienceRequired || 'Any'}</p>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 10px;">
                        <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 5px;">Salary</p>
                        <p style="font-weight: 600;">₹${(job.salary?.min || 0).toLocaleString()} - ₹${(job.salary?.max || 0).toLocaleString()}</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h3 style="margin-bottom: 15px;">Job Description</h3>
                    <p style="color: var(--text-secondary); line-height: 1.8;">${job.description || 'No description available.'}</p>
                </div>
                
                ${job.requirements ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="margin-bottom: 15px;">Requirements</h3>
                    <p style="color: var(--text-secondary); line-height: 1.8;">${job.requirements}</p>
                </div>
                ` : ''}
                
                ${job.responsibilities ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="margin-bottom: 15px;">Responsibilities</h3>
                    <p style="color: var(--text-secondary); line-height: 1.8;">${job.responsibilities}</p>
                </div>
                ` : ''}
                
                ${job.skills && job.skills.length > 0 ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="margin-bottom: 15px;">Required Skills</h3>
                    <div class="job-tags">
                        ${job.skills.map(skill => `<span class="job-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${job.benefits ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="margin-bottom: 15px;">Benefits</h3>
                    <p style="color: var(--text-secondary); line-height: 1.8;">${job.benefits}</p>
                </div>
                ` : ''}
                
                <div style="background: rgba(99, 102, 241, 0.05); padding: 20px; border-radius: 10px; margin-top: 30px;">
                    <p style="color: var(--text-secondary); margin-bottom: 10px;">
                        <i class="fas fa-users"></i> ${job.vacancies || 1} Position(s) Available
                    </p>
                    <p style="color: var(--text-secondary); margin-bottom: 10px;">
                        <i class="fas fa-calendar"></i> Posted ${new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <p style="color: var(--text-secondary);">
                        <i class="fas fa-graduation-cap"></i> ${job.educationRequired || 'Any Degree'}
                    </p>
                </div>
                
                <button class="apply-btn" onclick="applyJob(${job.id})" style="width: 100%; margin-top: 20px;">
                    Apply for this position
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('Error loading job details:', error);
        showNotification('Error loading job details', 'error');
    }
}

function closeJobDetailsModal() {
    const modal = document.getElementById('jobDetailsModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// ==================== FETCH JOBS FROM API ====================
let currentJobs = [];
let displayedJobs = 6;
let isLoading = false;

async function fetchJobs(filters = {}) {
    try {
        isLoading = true;
        
        // Fetch user applications first if logged in
        await fetchUserApplications();
        
        const queryParams = new URLSearchParams(filters).toString();
        const url = `${API_URL}/jobs?${queryParams}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('API Response:', data);
        console.log('Data.success:', data.success);
        console.log('Data.data:', data.data);
        console.log('Data.data.length:', data.data ? data.data.length : 'undefined');
        
        if (data.success && data.data && data.data.length > 0) {
            currentJobs = data.data.map(job => {
                // Parse skills if it's a string
                let skillsList = [];
                if (typeof job.skills === 'string') {
                    skillsList = job.skills.split(',').map(s => s.trim()).slice(0, 4);
                } else if (Array.isArray(job.skills)) {
                    skillsList = job.skills.slice(0, 4);
                }
                
                return {
                    id: job.id,
                    title: job.title,
                    company: job.companyName,
                    location: job.location,
                    type: job.jobType,
                    remote: job.workMode === 'remote',
                    experience: job.experienceRequired,
                    salary: job.salaryRange || `₹${(job.salary / 100000).toFixed(1)} LPA`,
                    posted: getTimeAgo(job.createdAt),
                    tags: skillsList,
                    companyType: 'corporate',
                    verified: job.isVerified || false,
                    icon: "fas fa-building",
                    urgent: job.isUrgent || false
                };
            });
            console.log('Mapped jobs:', currentJobs);
            renderJobs();
        } else {
            // No jobs found - show empty state
            console.log('No jobs found from API');
            currentJobs = [];
            renderJobs();
        }
        isLoading = false;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        isLoading = false;
        // Show error state
        currentJobs = [];
        renderJobs();
    }
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

function renderJobs(jobs = currentJobs.slice(0, displayedJobs)) {
    if (jobs.length === 0 && !isLoading) {
        jobsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h3 style="font-size: 24px; margin-bottom: 10px;">No Jobs Found</h3>
                <p style="color: var(--text-secondary);">Try adjusting your filters to see more results</p>
            </div>
        `;
        return;
    }
    
    jobsGrid.innerHTML = jobs.map(job => createJobCard(job)).join('');
    
    if (displayedJobs >= currentJobs.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Initial load from API
fetchJobs();

// ==================== LOAD MORE FUNCTIONALITY ====================
loadMoreBtn.addEventListener('click', () => {
    displayedJobs += 6;
    renderJobs(currentJobs.slice(0, displayedJobs));
    
    // Scroll to newly loaded jobs
    setTimeout(() => {
        const newJob = document.querySelectorAll('.job-card')[displayedJobs - 6];
        if (newJob) {
            newJob.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
});

// ==================== FILTER FUNCTIONALITY ====================
let currentFilter = {
    type: 'all',
    experience: 'all',
    salary: 'all',
    company: 'all',
    search: '',
    location: ''
};

function filterJobs() {
    currentJobs = jobsData.filter(job => {
        // Type filter
        if (currentFilter.type !== 'all' && job.type !== currentFilter.type) {
            return false;
        }
        
        // Experience filter
        if (currentFilter.experience !== 'all' && job.experience !== currentFilter.experience) {
            return false;
        }
        
        // Company filter
        if (currentFilter.company !== 'all' && job.companyType !== currentFilter.company) {
            return false;
        }
        
        // Search filter
        if (currentFilter.search && !job.title.toLowerCase().includes(currentFilter.search.toLowerCase()) 
            && !job.company.toLowerCase().includes(currentFilter.search.toLowerCase())
            && !job.tags.some(tag => tag.toLowerCase().includes(currentFilter.search.toLowerCase()))) {
            return false;
        }
        
        // Location filter
        if (currentFilter.location && !job.location.toLowerCase().includes(currentFilter.location.toLowerCase())) {
            return false;
        }
        
        return true;
    });
    
    displayedJobs = 6;
    renderJobs();
    
    // Show message if no jobs found
    if (currentJobs.length === 0) {
        jobsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h3 style="font-size: 24px; margin-bottom: 10px;">No Jobs Found</h3>
                <p style="color: var(--text-secondary);">Try adjusting your filters to see more results</p>
            </div>
        `;
    }
}

// Filter button listeners
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter.type = btn.dataset.filter;
        filterJobs();
    });
});

// Advanced filter listeners
experienceFilter.addEventListener('change', (e) => {
    currentFilter.experience = e.target.value;
    filterJobs();
});

salaryFilter.addEventListener('change', (e) => {
    currentFilter.salary = e.target.value;
    filterJobs();
});

companyFilter.addEventListener('change', (e) => {
    currentFilter.company = e.target.value;
    filterJobs();
});

// Search functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentFilter.search = e.target.value;
        filterJobs();
    }, 500);
});

locationInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentFilter.location = e.target.value;
        filterJobs();
    }, 500);
});

// ==================== BOOKMARK FUNCTIONALITY ====================
function toggleBookmark(event) {
    event.stopPropagation();
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.background = 'rgba(99, 102, 241, 0.2)';
        btn.style.borderColor = 'var(--primary-color)';
        btn.style.color = 'var(--primary-color)';
        showNotification('Job bookmarked successfully!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.background = 'transparent';
        btn.style.borderColor = 'var(--border-color)';
        btn.style.color = 'var(--text-secondary)';
        showNotification('Bookmark removed', 'info');
    }
}

// ==================== APPLY JOB FUNCTIONALITY ====================
function applyJob(jobId, event) {
    // Check if user is logged in
    const token = getAuthToken();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user || !user.name) {
        showNotification('Please login to apply for jobs', 'error');
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }
    
    if (user.role !== 'jobseeker') {
        showNotification('Only job seekers can apply for jobs', 'error');
        return;
    }
    
    // Open application form modal
    openApplicationModal(jobId);
}

// Open Application Form Modal
function openApplicationModal(jobId) {
    const modal = document.createElement('div');
    modal.id = 'applicationModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeApplicationModal()">&times;</span>
            
            <!-- Header with Icon -->
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                    border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                    margin: 0 auto 20px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);">
                    <i class="fas fa-file-alt" style="color: white; font-size: 32px;"></i>
                </div>
                <h2 style="margin: 0; font-size: 28px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Submit Your Application
                </h2>
                <p style="color: #999; margin-top: 8px; font-size: 14px;">Fill in your details to apply for this position</p>
            </div>
            
            <form id="applicationForm" data-job-id="${jobId}">
                <!-- Full Name -->
                <div class="input-group" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-user" style="color: #10b981;"></i>
                        Full Name *
                    </label>
                    <input type="text" id="app-name" required placeholder="Your full name"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box;"
                        onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                </div>
                
                <!-- Email & Phone -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-envelope" style="color: #10b981;"></i>
                            Email *
                        </label>
                        <input type="email" id="app-email" required placeholder="your@email.com"
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box;"
                            onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    </div>
                    
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-phone" style="color: #10b981;"></i>
                            Phone *
                        </label>
                        <input type="tel" id="app-phone" required placeholder="+91 XXXXX XXXXX"
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box;"
                            onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    </div>
                </div>
                
                <!-- Experience & Current Location -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-briefcase" style="color: #10b981;"></i>
                            Years of Experience *
                        </label>
                        <select id="app-experience" required
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box; cursor: pointer;"
                            onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                            <option value="">Select experience</option>
                            <option value="fresher">Fresher</option>
                            <option value="0-1">0-1 Years</option>
                            <option value="1-3">1-3 Years</option>
                            <option value="3-5">3-5 Years</option>
                            <option value="5-10">5-10 Years</option>
                            <option value="10+">10+ Years</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-map-marker-alt" style="color: #10b981;"></i>
                            Current Location *
                        </label>
                        <input type="text" id="app-location" required placeholder="City, State"
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box;"
                            onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    </div>
                </div>
                
                <!-- Current/Last Job Title -->
                <div class="input-group" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-id-badge" style="color: #10b981;"></i>
                        Current/Last Job Title
                    </label>
                    <input type="text" id="app-job-title" placeholder="e.g. Software Developer"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box;"
                        onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                </div>
                
                <!-- Skills -->
                <div class="input-group" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-code" style="color: #10b981;"></i>
                        Key Skills *
                    </label>
                    <input type="text" id="app-skills" required placeholder="e.g. JavaScript, React, Node.js"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box;"
                        onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    <small style="color: #999; font-size: 12px; display: block; margin-top: 6px;">
                        <i class="fas fa-info-circle"></i> Separate multiple skills with commas
                    </small>
                </div>
                
                <!-- Education -->
                <div class="input-group" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-graduation-cap" style="color: #10b981;"></i>
                        Highest Education *
                    </label>
                    <select id="app-education" required
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box; cursor: pointer;"
                        onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                        <option value="">Select education</option>
                        <option value="10th">10th Pass</option>
                        <option value="12th">12th Pass</option>
                        <option value="diploma">Diploma</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="phd">PhD</option>
                    </select>
                </div>
                
                <!-- Resume Upload -->
                <div class="input-group" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-file-upload" style="color: #10b981;"></i>
                        Upload Resume/CV
                    </label>
                    <input type="file" id="app-resume" accept=".pdf,.doc,.docx"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box; background: white;"
                        onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    <small style="color: #999; font-size: 12px; display: block; margin-top: 6px;">
                        <i class="fas fa-info-circle"></i> PDF, DOC, or DOCX (Max 100MB)
                    </small>
                </div>
                
                <!-- Cover Letter -->
                <div class="input-group" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-pen" style="color: #10b981;"></i>
                        Cover Letter / Why should we hire you? *
                    </label>
                    <textarea id="app-cover-letter" required placeholder="Tell us why you're a great fit for this position..." rows="5"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box; font-family: inherit; resize: vertical;"
                        onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'"></textarea>
                </div>
                
                <!-- Expected Salary -->
                <div class="input-group" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-money-bill-wave" style="color: #10b981;"></i>
                        Expected Salary (₹ per month)
                    </label>
                    <input type="number" id="app-salary" placeholder="e.g. 30000"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box;"
                        onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                </div>
                
                <!-- Notice Period -->
                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-calendar-alt" style="color: #10b981;"></i>
                        Notice Period *
                    </label>
                    <select id="app-notice-period" required
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box; cursor: pointer;"
                        onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                        <option value="">Select notice period</option>
                        <option value="immediate">Immediate</option>
                        <option value="15-days">15 Days</option>
                        <option value="30-days">30 Days</option>
                        <option value="45-days">45 Days</option>
                        <option value="60-days">60 Days</option>
                        <option value="90-days">90 Days</option>
                    </select>
                </div>
                
                <!-- Submit Button -->
                <button type="submit" class="btn-primary" 
                    style="width: 100%; padding: 16px; font-size: 16px; font-weight: 600; 
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                    border: none; border-radius: 12px; color: white; cursor: pointer; 
                    transition: all 0.3s; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
                    display: flex; align-items: center; justify-content: center; gap: 10px;"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 30px rgba(16, 185, 129, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(16, 185, 129, 0.3)'">
                    <i class="fas fa-paper-plane"></i>
                    Submit Application
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Handle form submission
    document.getElementById('applicationForm').addEventListener('submit', handleApplicationSubmit);
}

// Close Application Modal
function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Handle Application Form Submission
async function handleApplicationSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const jobId = form.dataset.jobId;
    const token = getAuthToken();
    
    console.log('Form submit - Job ID:', jobId);
    console.log('Form dataset:', form.dataset);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    if (!jobId) {
        showNotification('Error: Job ID is missing', 'error');
        return;
    }
    
    // Use FormData for file upload
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
        console.log('Submitting application with FormData (with resume)');
        const response = await fetch(`${API_URL}/applications/${jobId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Don't set Content-Type - browser will set it with boundary for FormData
            },
            body: formData
        });
        
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);
        
        if (response.ok) {
            showNotification('✅ Application submitted successfully!', 'success');
            closeApplicationModal();
            closeJobDetailsModal();
            
            // Add job to applied set
            userAppliedJobIds.add(jobId);
            
            // Re-render all jobs to update buttons
            renderJobs();
            
            // Also update any buttons in modals
            document.querySelectorAll(`button[onclick*="applyJob(${jobId})"]`).forEach(btn => {
                btn.textContent = 'Applied ✓';
                btn.style.background = '#10b981';
                btn.disabled = true;
            });
        } else {
            console.error('Application error response:', result);
            showNotification('❌ ' + (result.message || 'Failed to submit application'), 'error');
        }
    } catch (error) {
        console.error('Application submit error:', error);
        showNotification('❌ Error submitting application: ' + error.message, 'error');
    }
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(99, 102, 241, 0.9)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== POPULAR SEARCH TAGS ====================
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.value = tag.textContent;
        currentFilter.search = tag.textContent;
        filterJobs();
        
        // Scroll to jobs section
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    });
});

// ==================== NEWSLETTER SUBSCRIPTION ====================
document.querySelector('.newsletter-form button').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    
    if (email && email.includes('@')) {
        showNotification('Successfully subscribed to newsletter!', 'success');
        document.getElementById('newsletterEmail').value = '';
    } else {
        showNotification('Please enter a valid email address', 'error');
    }
});

// ==================== FORM SUBMISSIONS ====================
// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            setAuthToken(result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            showNotification('Login successful! Welcome back!', 'success');
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            updateUIForLoggedInUser(result.user);
            
            // Only admins get redirected, job seekers and recruiters stay on homepage
            if (result.user.role === 'admin') {
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            }
        } else {
            showNotification(result.message || 'Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Connection error. Please try again.', 'error');
    }
});

// Signup Form
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const role = document.querySelector('input[name="userType"]:checked').value;
    const companyName = document.getElementById('signup-company').value;
    
    const data = { name, email, phone, password, role };
    if (role === 'employer' && companyName) {
        data.companyName = companyName;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            setAuthToken(result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            showNotification('Account created successfully! Welcome!', 'success');
            signupModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            updateUIForLoggedInUser(result.user);
            
            // Only admins get redirected, job seekers and recruiters stay on homepage
            if (result.user.role === 'admin') {
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            }
        } else {
            if (result.errors && result.errors.length > 0) {
                const errorMsg = result.errors.map(e => e.msg).join(', ');
                showNotification(errorMsg, 'error');
            } else {
                showNotification(result.message || 'Registration failed', 'error');
            }
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Connection error. Please try again.', 'error');
    }
});

// Show/hide company name field based on role
document.querySelectorAll('input[name="userType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const companyNameGroup = document.getElementById('companyNameGroup');
        if (e.target.value === 'employer') {
            companyNameGroup.style.display = 'block';
        } else {
            companyNameGroup.style.display = 'none';
        }
    });
});

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const navActions = document.querySelector('.nav-actions');
    
    // Determine dashboard URL based on role
    let dashboardUrl = '';
    let extraButton = '';
    
    if (user.role === 'jobseeker') {
        dashboardUrl = 'jobseeker-dashboard.html';
    } else if (user.role === 'employer') {
        dashboardUrl = 'recruiter-dashboard.html';
        extraButton = `<button class="btn-primary" onclick="openPostJobModal()" style="margin-right: 10px;">Post Job</button>`;
    } else if (user.role === 'admin') {
        dashboardUrl = 'admin-dashboard.html';
    }
    
    navActions.innerHTML = `
        <span style="color: var(--text-secondary); margin-right: 10px;">Hi, ${user.name}</span>
        ${extraButton}
        ${dashboardUrl ? `<button class="btn-secondary" onclick="window.location.href='${dashboardUrl}'" style="margin-right: 10px;">Dashboard</button>` : ''}
        <button class="btn-secondary" onclick="logout()">Logout</button>
    `;
}

// Post Job Modal
function openPostJobModal() {
    const modal = document.createElement('div');
    modal.id = 'postJobModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 850px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closePostJobModal()">&times;</span>
            
            <!-- Header with Icon -->
            <div style="text-align: center; margin-bottom: 35px;">
                <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                    margin: 0 auto 20px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);">
                    <i class="fas fa-briefcase" style="color: white; font-size: 32px;"></i>
                </div>
                <h2 style="margin: 0; font-size: 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Post a New Job Opening
                </h2>
                <p style="color: #666; margin-top: 8px; font-size: 14px;">Fill in the details to attract top talent</p>
            </div>
            
            <form id="postJobForm">
                <!-- Job Title -->
                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-heading" style="color: #667eea;"></i>
                        Job Title *
                    </label>
                    <input type="text" id="job-title" required placeholder="e.g. Full Stack Developer" 
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box;"
                        onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                </div>
                
                <!-- Job Description -->
                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-align-left" style="color: #667eea;"></i>
                        Job Description *
                    </label>
                    <textarea id="job-description" required placeholder="Describe the role, responsibilities, and requirements..." rows="5"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box; font-family: inherit; resize: vertical;"
                        onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'"></textarea>
                </div>
                
                <!-- Job Type & Work Mode -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-clock" style="color: #667eea;"></i>
                            Job Type *
                        </label>
                        <select id="job-type" required
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box; cursor: pointer;"
                            onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-laptop-house" style="color: #667eea;"></i>
                            Work Mode *
                        </label>
                        <select id="work-mode" required
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box; cursor: pointer;"
                            onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                            <option value="office">Office</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>
                
                <!-- Location & Category -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-map-marker-alt" style="color: #667eea;"></i>
                            Location *
                        </label>
                        <input type="text" id="job-location" required value="Amritsar" placeholder="City"
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box;"
                            onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    </div>
                    
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-tag" style="color: #667eea;"></i>
                            Category *
                        </label>
                        <input type="text" id="job-category" required placeholder="e.g. IT, Sales, Marketing"
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box;"
                            onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    </div>
                </div>
                
                <!-- Experience & Education -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-user-tie" style="color: #667eea;"></i>
                            Experience Required *
                        </label>
                        <select id="job-experience" required
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box; cursor: pointer;"
                            onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                            <option value="fresher">Fresher</option>
                            <option value="1-3">1-3 Years</option>
                            <option value="3-5">3-5 Years</option>
                            <option value="5+">5+ Years</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                            <i class="fas fa-graduation-cap" style="color: #667eea;"></i>
                            Education *
                        </label>
                        <input type="text" id="job-education" required placeholder="e.g. Bachelor's Degree"
                            style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                            transition: all 0.3s; width: 100%; box-sizing: border-box;"
                            onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                            onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    </div>
                </div>
                
                <!-- Salary Section -->
                <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); 
                    padding: 20px; border-radius: 15px; margin-bottom: 25px; border: 2px dashed rgba(102, 126, 234, 0.3);">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 15px;">
                        <i class="fas fa-money-bill-wave" style="color: #667eea; font-size: 18px;"></i>
                        Salary Range *
                    </label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                        <div class="input-group">
                            <label style="font-size: 13px; color: #666; margin-bottom: 8px; display: block;">Min Salary (₹)</label>
                            <input type="number" id="job-salary-min" required placeholder="15000"
                                style="padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; 
                                transition: all 0.3s; width: 100%; box-sizing: border-box;"
                                onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                                onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                        </div>
                        
                        <div class="input-group">
                            <label style="font-size: 13px; color: #666; margin-bottom: 8px; display: block;">Max Salary (₹)</label>
                            <input type="number" id="job-salary-max" required placeholder="25000"
                                style="padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; 
                                transition: all 0.3s; width: 100%; box-sizing: border-box;"
                                onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                                onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                        </div>
                        
                        <div class="input-group">
                            <label style="font-size: 13px; color: #666; margin-bottom: 8px; display: block;">Period</label>
                            <select id="job-salary-period" required
                                style="padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; 
                                transition: all 0.3s; width: 100%; box-sizing: border-box; cursor: pointer;"
                                onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                                onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                                <option value="month">Per Month</option>
                                <option value="year">Per Year</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Skills -->
                <div class="input-group" style="margin-bottom: 25px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-code" style="color: #667eea;"></i>
                        Required Skills *
                    </label>
                    <input type="text" id="job-skills" required placeholder="JavaScript, React, Node.js, MongoDB"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 100%; box-sizing: border-box;"
                        onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                    <small style="color: #666; font-size: 12px; display: block; margin-top: 6px;">
                        <i class="fas fa-info-circle"></i> Separate multiple skills with commas
                    </small>
                </div>
                
                <!-- Vacancies -->
                <div class="input-group" style="margin-bottom: 30px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #fff; margin-bottom: 10px;">
                        <i class="fas fa-users" style="color: #667eea;"></i>
                        Number of Vacancies *
                    </label>
                    <input type="number" id="job-vacancies" required value="1" min="1" max="100"
                        style="padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; 
                        transition: all 0.3s; width: 200px;"
                        onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'"
                        onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'">
                </div>
                
                <!-- Submit Button -->
                <button type="submit" class="btn-primary" 
                    style="width: 100%; padding: 16px; font-size: 16px; font-weight: 600; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    border: none; border-radius: 12px; color: white; cursor: pointer; 
                    transition: all 0.3s; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                    display: flex; align-items: center; justify-content: center; gap: 10px;"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 30px rgba(102, 126, 234, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(102, 126, 234, 0.3)'">
                    <i class="fas fa-paper-plane"></i>
                    Post Job Opening
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Handle form submission
    document.getElementById('postJobForm').addEventListener('submit', handlePostJob);
}

function closePostJobModal() {
    const modal = document.getElementById('postJobModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

async function handlePostJob(e) {
    e.preventDefault();
    
    const token = getAuthToken();
    if (!token) {
        showNotification('Please login first', 'error');
        return;
    }
    
    const jobData = {
        title: document.getElementById('job-title').value,
        description: document.getElementById('job-description').value,
        jobType: document.getElementById('job-type').value,
        workMode: document.getElementById('work-mode').value,
        location: document.getElementById('job-location').value,
        category: document.getElementById('job-category').value,
        experienceRequired: document.getElementById('job-experience').value,
        educationRequired: document.getElementById('job-education').value,
        salary: {
            min: parseInt(document.getElementById('job-salary-min').value),
            max: parseInt(document.getElementById('job-salary-max').value),
            period: document.getElementById('job-salary-period').value
        },
        skills: document.getElementById('job-skills').value.split(',').map(s => s.trim()),
        vacancies: parseInt(document.getElementById('job-vacancies').value)
    };
    
    try {
        const response = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Job posted successfully!', 'success');
            closePostJobModal();
            
            // Refresh jobs list
            setTimeout(() => {
                fetchJobs();
            }, 1000);
        } else {
            showNotification(result.message || 'Failed to post job', 'error');
        }
    } catch (error) {
        console.error('Post job error:', error);
        showNotification('Error posting job', 'error');
    }
}

// Logout function
async function logout() {
    try {
        await fetchWithAuth(`${API_URL}/auth/logout`, { method: 'POST' });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        removeAuthToken();
        localStorage.removeItem('user');
        location.reload();
    }
}

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    const token = getAuthToken();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user && user.name) {
        updateUIForLoggedInUser(user);
    }
});

// Re-fetch applications when page becomes visible (user returns from another page)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && getAuthToken()) {
        fetchUserApplications().then(() => {
            // Re-render jobs with updated applied status
            if (currentJobs.length > 0) {
                renderJobs();
            }
        });
    }
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .job-card, .company-card, .service-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ==================== TYPING EFFECT FOR HERO TITLE ====================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString() + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + '+';
        }
    }
    
    updateCounter();
}

// Animate stat counters when they come into view
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const h3 = entry.target.querySelector('h3');
            const value = h3.textContent.replace(/[^0-9]/g, '');
            animateCounter(h3, parseInt(value));
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statObserver.observe(stat);
});

// ==================== LAZY LOADING IMAGES ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Escape key to close modals
    if (e.key === 'Escape') {
        if (loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (signupModal.classList.contains('active')) {
            signupModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ==================== LOCAL STORAGE FOR BOOKMARKS ====================
function saveBookmarks() {
    const bookmarkedJobs = [];
    document.querySelectorAll('.bookmark-btn .fas.fa-bookmark').forEach(btn => {
        const jobCard = btn.closest('.job-card');
        const jobTitle = jobCard.querySelector('.job-title').textContent;
        bookmarkedJobs.push(jobTitle);
    });
    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
}

function loadBookmarks() {
    const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    document.querySelectorAll('.job-card').forEach(card => {
        const jobTitle = card.querySelector('.job-title').textContent;
        if (bookmarkedJobs.includes(jobTitle)) {
            const btn = card.querySelector('.bookmark-btn');
            const icon = btn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.background = 'rgba(99, 102, 241, 0.2)';
            btn.style.borderColor = 'var(--primary-color)';
            btn.style.color = 'var(--primary-color)';
        }
    });
}

// Load bookmarks on page load
window.addEventListener('load', () => {
    setTimeout(loadBookmarks, 500);
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c🚀 JobHub - Your Dream Job Awaits!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'color: #94a3b8; font-size: 14px;');
console.log('%c⚡ Features: AI Matching, Smart Search, Real-time Alerts', 'color: #10b981; font-size: 12px;');

// ==================== SERVICE WORKER (Optional for PWA) ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment below to register service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(err => console.log('SW registration failed'));
    });
}

// ==================== ANALYTICS TRACKING (Placeholder) ====================
function trackEvent(category, action, label) {
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    // Integrate with Google Analytics or other analytics service
    // Example: gtag('event', action, { 'event_category': category, 'event_label': label });
}

// Track job applications
document.querySelectorAll('.apply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('Jobs', 'Apply', 'Job Application');
    });
});

// ==================== PERFORMANCE MONITORING ====================
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    }
});

// ==================== ACCESSIBILITY IMPROVEMENTS ====================
// Add aria-labels dynamically
document.querySelectorAll('button').forEach(btn => {
    if (!btn.getAttribute('aria-label') && btn.textContent.trim()) {
        btn.setAttribute('aria-label', btn.textContent.trim());
    }
});

// Focus trap in modals
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap to modals
[loginModal, signupModal].forEach(modal => trapFocus(modal));

console.log('✅ JobHub initialized successfully!');
