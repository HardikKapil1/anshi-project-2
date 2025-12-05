// app.js - Frontend JavaScript
// Point API to the same origin as the served frontend (works locally and after deploy)
const API_URL = `${window.location.origin}/api`;
let authToken = null;
let currentRole = 'admin';

// Utility Functions
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    alertBox.classList.remove('hidden');
    
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 5000);
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    // Reset forms
    if (modalId === 'registerModal') {
        document.getElementById('registerForm').reset();
    } else if (modalId === 'forgotModal') {
        document.getElementById('otpStep1').classList.remove('hidden');
        document.getElementById('otpStep2').classList.add('hidden');
        document.getElementById('forgotEmail').value = '';
        document.getElementById('otpCode').value = '';
        document.getElementById('newPassword').value = '';
    }
}

// Tab Switching for Login
document.querySelectorAll('.tab[data-role]').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentRole = tab.dataset.role;
    });
});

// Login Form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const endpoint = currentRole === 'admin' ? '/admin/login' : '/student/login';
    
    try {
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.token;
            showAlert('Login successful!', 'success');
            
            // Hide login, show appropriate dashboard
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('logoutBtn').classList.remove('hidden');
            
            if (currentRole === 'admin') {
                document.getElementById('adminDashboard').classList.remove('hidden');
                loadPendingStudents();
                loadEventsForAdmin();
            } else {
                document.getElementById('studentDashboard').classList.remove('hidden');
                loadEvents();
                loadItems();
            }
        } else {
            showAlert(data.message);
        }
    } catch (error) {
        showAlert('Login failed: ' + error.message);
    }
});

// Register Button
document.getElementById('registerBtn').addEventListener('click', () => {
    showModal('registerModal');
});

// Register Form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch(API_URL + '/student/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message, 'success');
            closeModal('registerModal');
        } else {
            showAlert(data.message);
        }
    } catch (error) {
        showAlert('Registration failed: ' + error.message);
    }
});

// Forgot Password
document.getElementById('forgotBtn').addEventListener('click', () => {
    showModal('forgotModal');
});

let otpEmail = '';

async function sendOTP() {
    const email = document.getElementById('forgotEmail').value;
    
    if (!email) {
        showAlert('Please enter your email');
        return;
    }
    
    try {
        const response = await fetch(API_URL + '/forgot-password/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            otpEmail = email;
            showAlert(`OTP sent! (Check console: ${data.otp})`, 'success');
            document.getElementById('otpStep1').classList.add('hidden');
            document.getElementById('otpStep2').classList.remove('hidden');
        } else {
            showAlert(data.message);
        }
    } catch (error) {
        showAlert('Failed to send OTP: ' + error.message);
    }
}

async function resetPassword() {
    const otp = document.getElementById('otpCode').value;
    const newPassword = document.getElementById('newPassword').value;
    
    if (!otp || !newPassword) {
        showAlert('Please fill all fields');
        return;
    }
    
    try {
        const response = await fetch(API_URL + '/forgot-password/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: otpEmail, otp, newPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Password reset successfully!', 'success');
            closeModal('forgotModal');
        } else {
            showAlert(data.message);
        }
    } catch (error) {
        showAlert('Password reset failed: ' + error.message);
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    authToken = null;
    location.reload();
});

// Admin Dashboard Tabs
document.querySelectorAll('.dashboard-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show appropriate section
        if (currentRole === 'admin') {
            document.getElementById('pendingSection').classList.add('hidden');
            document.getElementById('uploadEventSection').classList.add('hidden');
            document.getElementById('adminEventsSection').classList.add('hidden');
            
            if (targetTab === 'pending') {
                document.getElementById('pendingSection').classList.remove('hidden');
                loadPendingStudents();
            } else if (targetTab === 'upload') {
                document.getElementById('uploadEventSection').classList.remove('hidden');
            } else if (targetTab === 'events') {
                document.getElementById('adminEventsSection').classList.remove('hidden');
                loadEventsForAdmin();
            }
        } else {
            document.getElementById('eventsSection').classList.add('hidden');
            document.getElementById('lostItemsSection').classList.add('hidden');
            document.getElementById('foundItemsSection').classList.add('hidden');
            document.getElementById('uploadItemSection').classList.add('hidden');
            
            if (targetTab === 'events') {
                document.getElementById('eventsSection').classList.remove('hidden');
            } else if (targetTab === 'lost') {
                document.getElementById('lostItemsSection').classList.remove('hidden');
                displayItems('lost');
            } else if (targetTab === 'found') {
                document.getElementById('foundItemsSection').classList.remove('hidden');
                displayItems('found');
            } else if (targetTab === 'upload') {
                document.getElementById('uploadItemSection').classList.remove('hidden');
            }
        }
    });
});

// Load Pending Students (Admin)
async function loadPendingStudents() {
    try {
        const response = await fetch(API_URL + '/admin/pending', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        const list = document.getElementById('pendingList');
        
        if (data.pending && data.pending.length > 0) {
            list.innerHTML = data.pending.map(student => `
                <li class="pending-item">
                    <div>
                        <strong>${student.email}</strong>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">
                            Registered: ${new Date(student.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    <button class="btn btn-success" onclick="approveStudent('${student.email}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                </li>
            `).join('');
        } else {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No pending approvals</p></div>';
        }
    } catch (error) {
        showAlert('Failed to load pending students: ' + error.message);
    }
}

// Approve Student
async function approveStudent(email) {
    try {
        const response = await fetch(API_URL + '/admin/approve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Student approved successfully!', 'success');
            loadPendingStudents();
        } else {
            showAlert(data.message);
        }
    } catch (error) {
        showAlert('Failed to approve student: ' + error.message);
    }
}

// Upload Event (Admin)
document.getElementById('eventUploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('eventTitle').value);
    formData.append('description', document.getElementById('eventDescription').value);
    
    const photoFile = document.getElementById('eventPhoto').files[0];
    if (photoFile) {
        formData.append('photo', photoFile);
    }
    
    try {
        const response = await fetch(API_URL + '/event/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Event uploaded successfully!', 'success');
            document.getElementById('eventUploadForm').reset();
            loadEventsForAdmin();
        } else {
            showAlert(data.message);
        }
    } catch (error) {
        showAlert('Failed to upload event: ' + error.message);
    }
});

// Load Events
let allEvents = [];

async function loadEvents() {
    try {
        const response = await fetch(API_URL + '/events/all');
        const data = await response.json();
        
        if (data.success) {
            allEvents = data.events;
            displayEvents(data.events, 'eventsList');
        }
    } catch (error) {
        showAlert('Failed to load events: ' + error.message);
    }
}

async function loadEventsForAdmin() {
    try {
        const response = await fetch(API_URL + '/events/all');
        const data = await response.json();
        
        if (data.success) {
            displayEvents(data.events, 'adminEventsList');
        }
    } catch (error) {
        showAlert('Failed to load events: ' + error.message);
    }
}

function displayEvents(events, containerId) {
    const container = document.getElementById(containerId);
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No events available</p></div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-card">
            ${event.photo ? `<img src="${event.photo}" alt="${event.title}" class="event-image">` : '<div class="event-image"></div>'}
            <div class="event-content">
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description}</div>
                <div class="event-meta">
                    <span><i class="fas fa-user"></i> ${event.posted_by}</span>
                    <span><i class="fas fa-clock"></i> ${new Date(event.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Items (Lost & Found)
let allItems = [];

async function loadItems() {
    try {
        const response = await fetch(API_URL + '/items/all');
        const data = await response.json();
        
        if (data.success) {
            allItems = data.items;
        }
    } catch (error) {
        showAlert('Failed to load items: ' + error.message);
    }
}

function displayItems(type) {
    const filteredItems = allItems.filter(item => item.type === type);
    const containerId = type === 'lost' ? 'lostItemsList' : 'foundItemsList';
    const container = document.getElementById(containerId);
    
    if (filteredItems.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>No ${type} items reported</p></div>`;
        return;
    }
    
    container.innerHTML = filteredItems.map(item => `
        <div class="event-card">
            ${item.photo ? `<img src="${item.photo}" alt="${item.name}" class="event-image">` : '<div class="event-image"></div>'}
            <div class="event-content">
                <div class="event-title">${item.name}</div>
                <div class="event-description">${item.description}</div>
                <div class="event-meta">
                    <span><i class="fas fa-user"></i> ${item.posted_by}</span>
                    <span><i class="fas fa-clock"></i> ${new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <span class="badge badge-${type === 'lost' ? 'warning' : 'success'}">${type.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

// Upload Item (Student)
document.getElementById('itemUploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('itemType').value;
    const formData = new FormData();
    formData.append('name', document.getElementById('itemName').value);
    formData.append('description', document.getElementById('itemDescription').value);
    
    const photoFile = document.getElementById('itemPhoto').files[0];
    if (photoFile) {
        formData.append('photo', photoFile);
    }
    
    const endpoint = type === 'lost' ? '/upload/lost' : '/upload/found';
    
    try {
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(`${type} item reported successfully!`, 'success');
            document.getElementById('itemUploadForm').reset();
            loadItems();
        } else {
            showAlert(data.message);
        }
    } catch (error) {
        showAlert('Failed to upload item: ' + error.message);
    }
});

// File input label update
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        const label = this.nextElementSibling;
        const fileName = this.files[0]?.name || 'Choose an image';
        label.querySelector('span').textContent = fileName;
    });
});
