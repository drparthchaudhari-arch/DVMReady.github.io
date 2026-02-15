/**
 * VetLudics Admin Dashboard
 */

(function() {
  'use strict';
  
  const SESSION_KEY = 'vetludics_admin_session';
  const REQUESTS_KEY = 'vetludics_access_requests';
  const APPROVED_KEY = 'vetludics_controlled_access';
  
  // Check admin session
  function checkSession() {
    const session = localStorage.getItem(SESSION_KEY);
    const sessionTime = localStorage.getItem(SESSION_KEY + '_time');
    
    if (!session || session !== 'active') {
      window.location.href = 'index.html';
      return false;
    }
    
    // Session expires after 8 hours
    if (sessionTime && Date.now() - parseInt(sessionTime) > 8 * 60 * 60 * 1000) {
      logout();
      return false;
    }
    
    return true;
  }
  
  function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY + '_time');
    window.location.href = 'index.html';
  }
  
  // Load requests
  function loadRequests() {
    try {
      return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }
  
  // Load approved emails
  function loadApprovedEmails() {
    try {
      const approved = JSON.parse(localStorage.getItem('vetludics_approved_emails') || '[]');
      return approved;
    } catch (e) {
      return [];
    }
  }
  
  // Save approved email
  function approveEmail(email) {
    const approved = loadApprovedEmails();
    if (!approved.includes(email)) {
      approved.push(email);
      localStorage.setItem('vetludics_approved_emails', JSON.stringify(approved));
    }
    
    // Also mark in requests
    const requests = loadRequests();
    const request = requests.find(r => r.email === email);
    if (request) {
      request.status = 'approved';
      request.approvedAt = new Date().toISOString();
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    }
    
    renderDashboard();
  }
  
  // Reject email
  function rejectEmail(email) {
    const requests = loadRequests();
    const request = requests.find(r => r.email === email);
    if (request) {
      request.status = 'rejected';
      request.rejectedAt = new Date().toISOString();
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    }
    
    renderDashboard();
  }
  
  // Remove approved email
  function removeApprovedEmail(email) {
    let approved = loadApprovedEmails();
    approved = approved.filter(e => e !== email);
    localStorage.setItem('vetludics_approved_emails', JSON.stringify(approved));
    renderDashboard();
  }
  
  // Render dashboard
  function renderDashboard() {
    const requests = loadRequests();
    const approved = loadApprovedEmails();
    
    // Update stats
    const pending = requests.filter(r => !r.status || r.status === 'pending');
    const approved_count = requests.filter(r => r.status === 'approved').length;
    const rejected_count = requests.filter(r => r.status === 'rejected').length;
    
    document.getElementById('stat-pending').textContent = pending.length;
    document.getElementById('stat-approved').textContent = approved_count;
    document.getElementById('stat-rejected').textContent = rejected_count;
    document.getElementById('stat-total').textContent = requests.length;
    
    // Render pending requests
    const pendingContainer = document.getElementById('pending-requests');
    if (pending.length === 0) {
      pendingContainer.innerHTML = '<p class="pc-empty-state">No pending requests</p>';
    } else {
      pendingContainer.innerHTML = `
        <table class="pc-requests-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>License</th>
              <th>State</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pending.map(r => `
              <tr data-email="${r.email}">
                <td><strong>${escapeHtml(r.name)}</strong></td>
                <td>${escapeHtml(r.email)}</td>
                <td>${escapeHtml(r.license)}</td>
                <td>${escapeHtml(r.state)}</td>
                <td>${formatDate(r.timestamp)}</td>
                <td><span class="pc-status-badge pc-status-badge--pending">Pending</span></td>
                <td>
                  <button class="pc-btn pc-btn--success pc-btn--small" onclick="approveRequest('${r.email}')">Approve</button>
                  <button class="pc-btn pc-btn--danger pc-btn--small" onclick="rejectRequest('${r.email}')">Reject</button>
                  <button class="pc-btn pc-btn--secondary pc-btn--small" onclick="viewDetails('${r.email}')">Details</button>
                </td>
              </tr>
              <tr id="details-${r.email}" style="display: none;">
                <td colspan="7">
                  <div class="pc-request-detail">
                    <h4>Request Details</h4>
                    <p><strong>Name:</strong> ${escapeHtml(r.name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(r.email)}</p>
                    <p><strong>License:</strong> ${escapeHtml(r.license)}</p>
                    <p><strong>State:</strong> ${escapeHtml(r.state)}</p>
                    <p><strong>Clinic:</strong> ${escapeHtml(r.clinic)}</p>
                    <p><strong>Submitted:</strong> ${formatDate(r.timestamp)}</p>
                    <div class="pc-detail-actions">
                      <button class="pc-btn pc-btn--success" onclick="approveRequest('${r.email}'); hideDetails('${r.email}');">✓ Approve Access</button>
                      <button class="pc-btn pc-btn--danger" onclick="rejectRequest('${r.email}'); hideDetails('${r.email}');">✗ Reject Request</button>
                    </div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
    
    // Render approved users
    const approvedContainer = document.getElementById('approved-users');
    if (approved.length === 0) {
      approvedContainer.innerHTML = '<p class="pc-empty-state">No approved users yet</p>';
    } else {
      approvedContainer.innerHTML = `
        <p>${approved.length} user(s) with approved access:</p>
        <div class="pc-approved-emails">
          ${approved.map(email => `
            <span class="pc-approved-email">
              ${escapeHtml(email)}
              <span class="pc-remove-email" onclick="removeAccess('${email}')">×</span>
            </span>
          `).join('')}
        </div>
      `;
    }
    
    // Render all requests
    const allContainer = document.getElementById('all-requests');
    if (requests.length === 0) {
      allContainer.innerHTML = '<p class="pc-empty-state">No requests found</p>';
    } else {
      allContainer.innerHTML = `
        <table class="pc-requests-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${[...requests].reverse().map(r => `
              <tr>
                <td>${escapeHtml(r.name)}</td>
                <td>${escapeHtml(r.email)}</td>
                <td>
                  <span class="pc-status-badge pc-status-badge--${r.status || 'pending'}">
                    ${r.status || 'Pending'}
                  </span>
                </td>
                <td>${formatDate(r.timestamp)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }
  
  // Utility functions
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function formatDate(timestamp) {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
  
  // Global functions for onclick handlers
  window.approveRequest = function(email) {
    approveEmail(email);
    alert(`Approved access for ${email}`);
  };
  
  window.rejectRequest = function(email) {
    if (confirm(`Reject access request from ${email}?`)) {
      rejectEmail(email);
    }
  };
  
  window.removeAccess = function(email) {
    if (confirm(`Remove access for ${email}?`)) {
      removeApprovedEmail(email);
    }
  };
  
  window.viewDetails = function(email) {
    const row = document.getElementById(`details-${email}`);
    if (row) {
      row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
    }
  };
  
  window.hideDetails = function(email) {
    const row = document.getElementById(`details-${email}`);
    if (row) row.style.display = 'none';
  };
  
  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    if (!checkSession()) return;
    
    document.getElementById('admin-email-display').textContent = 'drparthchaudhari@gmail.com';
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    renderDashboard();
  });
})();
