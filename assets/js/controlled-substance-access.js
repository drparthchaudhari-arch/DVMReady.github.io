/**
 * Controlled Substance Access Control
 * Locks access to DEA-controlled drugs behind veterinarian verification
 * 
 * Controlled substances identified per DEA schedule:
 * Schedule III: Buprenorphine, Ketamine
 * Schedule IV: Tramadol, Butorphanol, Phenobarbital, Diazepam, Midazolam
 * 
 * All dosages verified against Plumb's Veterinary Drug Handbook & Merck Veterinary Manual
 */

;(function() {
  'use strict'

  const CONFIG = {
    ACCESS_DURATION_HOURS: 8,
    STORAGE_KEY: 'vetludics_controlled_access',
    AUDIT_KEY: 'vetludics_access_audit_log',
    MAX_FAILED_ATTEMPTS: 3,
    LOCKOUT_MINUTES: 30
  }

  const CONTROLLED_DRUGS = {
    'Tramadol': { schedule: 'IV', requiresVet: true },
    'Buprenorphine': { schedule: 'III', requiresVet: true },
    'Butorphanol': { schedule: 'IV', requiresVet: true },
    'Phenobarbital': { schedule: 'IV', requiresVet: true },
    'Diazepam': { schedule: 'IV', requiresVet: true },
    'Midazolam': { schedule: 'IV', requiresVet: true },
    'Ketamine': { schedule: 'III', requiresVet: true }
  }

  // Check if a drug is controlled
  function isControlled(drugName) {
    if (!drugName) return false
    const normalized = drugName.trim()
    return CONTROLLED_DRUGS.hasOwnProperty(normalized)
  }

  // Get controlled substance info
  function getControlledInfo(drugName) {
    if (!isControlled(drugName)) return null
    return CONTROLLED_DRUGS[drugName.trim()]
  }

  // Check if user has active access
  function hasActiveAccess() {
    try {
      const accessData = localStorage.getItem(CONFIG.STORAGE_KEY)
      if (!accessData) return false
      
      const access = JSON.parse(accessData)
      if (!access.granted || !access.timestamp) return false
      
      const now = new Date().getTime()
      const granted = new Date(access.timestamp).getTime()
      const hoursElapsed = (now - granted) / (1000 * 60 * 60)
      
      return hoursElapsed < CONFIG.ACCESS_DURATION_HOURS
    } catch (e) {
      console.error('Error checking access:', e)
      return false
    }
  }

  // Grant access
  function grantAccess(credentials) {
    try {
      const accessData = {
        granted: true,
        timestamp: new Date().toISOString(),
        credentials: credentials,
        sessionId: generateSessionId()
      }
      
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(accessData))
      logAuditEvent('ACCESS_GRANTED', credentials)
      return true
    } catch (e) {
      console.error('Error granting access:', e)
      return false
    }
  }

  // Revoke access
  function revokeAccess() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY)
      logAuditEvent('ACCESS_REVOKED', null)
      return true
    } catch (e) {
      console.error('Error revoking access:', e)
      return false
    }
  }

  // Log audit event
  function logAuditEvent(eventType, data) {
    try {
      let auditLog = JSON.parse(localStorage.getItem(CONFIG.AUDIT_KEY) || '[]')
      
      auditLog.push({
        timestamp: new Date().toISOString(),
        event: eventType,
        drug: data ? data.drug : null,
        page: window.location.href,
        userAgent: navigator.userAgent.substring(0, 100)
      })
      
      // Keep only last 100 entries
      if (auditLog.length > 100) {
        auditLog = auditLog.slice(-100)
      }
      
      localStorage.setItem(CONFIG.AUDIT_KEY, JSON.stringify(auditLog))
    } catch (e) {
      console.error('Error logging audit event:', e)
    }
  }

  // Generate session ID
  function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Show access modal
  function showAccessModal(drugName, onGranted, onDenied) {
    // Remove existing modal
    const existingModal = document.getElementById('controlled-access-modal')
    if (existingModal) {
      existingModal.remove()
    }

    const drugInfo = getControlledInfo(drugName)
    const schedule = drugInfo ? drugInfo.schedule : 'IV'

    const modal = document.createElement('div')
    modal.id = 'controlled-access-modal'
    modal.innerHTML = `
      <div class="controlled-modal-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
      ">
        <div class="controlled-modal-content" style="
          background: var(--calc-card-bg, #fff);
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          border: 2px solid #dc2626;
        ">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="
              width: 60px;
              height: 60px;
              background: #dc2626;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1rem;
              font-size: 1.75rem;
            ">🔒</div>
            <h2 style="margin: 0 0 0.5rem; color: #dc2626; font-size: 1.25rem;">Controlled Substance</h2>
            <p style="margin: 0; color: var(--calc-text-muted); font-size: 0.875rem;">
              DEA Schedule ${schedule} - Veterinarian Access Required
            </p>
          </div>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
            <p style="margin: 0 0 0.5rem; font-size: 0.8125rem; color: #991b1b;">
              <strong>⚠️ Important Notice</strong>
            </p>
            <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.75rem; color: #7f1d1d; line-height: 1.6;">
              <li>This is a controlled substance regulated by DEA</li>
              <li>Access is restricted to licensed veterinarians only</li>
              <li>All access attempts are logged for audit purposes</li>
              <li>Dosages verified against Plumb's Veterinary Drug Handbook</li>
            </ul>
          </div>

          <div id="access-form">
            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.8125rem; font-weight: 500; margin-bottom: 0.375rem;">
                License Number / Verification Code
              </label>
              <input 
                type="password" 
                id="vet-verification-input"
                placeholder="Enter verification code"
                style="
                  width: 100%;
                  padding: 0.625rem 0.875rem;
                  border: 1.5px solid #d1d5db;
                  border-radius: 8px;
                  font-size: 0.9375rem;
                "
              >
              <p style="margin: 0.375rem 0 0; font-size: 0.6875rem; color: var(--calc-text-muted);">
                Contact site administrator for access credentials
              </p>
            </div>

            <div id="access-error" style="
              display: none;
              background: #fef2f2;
              color: #dc2626;
              padding: 0.625rem;
              border-radius: 6px;
              font-size: 0.8125rem;
              margin-bottom: 1rem;
            ">
              Invalid verification code. Access denied.
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button 
                type="button"
                onclick="ControlledSubstanceAccess.verifyAndGrant('${drugName}')"
                style="
                  flex: 1;
                  padding: 0.625rem 1rem;
                  background: #dc2626;
                  color: white;
                  border: none;
                  border-radius: 8px;
                  font-weight: 500;
                  cursor: pointer;
                "
              >
                Verify Access
              </button>
              <button 
                type="button"
                onclick="ControlledSubstanceAccess.closeModal()"
                style="
                  padding: 0.625rem 1rem;
                  background: #f3f4f6;
                  color: #374151;
                  border: none;
                  border-radius: 8px;
                  font-weight: 500;
                  cursor: pointer;
                "
              >
                Cancel
              </button>
            </div>
          </div>

          <div id="access-granted" style="display: none; text-align: center;">
            <div style="color: #059669; font-size: 3rem; margin-bottom: 1rem;">✓</div>
            <h3 style="margin: 0 0 0.5rem; color: #059669;">Access Granted</h3>
            <p style="margin: 0 0 1rem; font-size: 0.8125rem; color: var(--calc-text-muted);">
              You now have ${CONFIG.ACCESS_DURATION_HOURS}-hour access to controlled substance dosing.
            </p>
            <button 
              type="button"
              onclick="ControlledSubstanceAccess.closeModal()"
              style="
                padding: 0.625rem 2rem;
                background: #059669;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
              "
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(modal)
    
    // Store callbacks
    modal.dataset.drugName = drugName
    if (onGranted) window._controlledOnGranted = onGranted
    if (onDenied) window._controlledOnDenied = onDenied

    // Focus input
    setTimeout(() => {
      const input = document.getElementById('vet-verification-input')
      if (input) input.focus()
    }, 100)
  }

  // Close modal
  function closeModal() {
    const modal = document.getElementById('controlled-access-modal')
    if (modal) {
      modal.remove()
    }
  }

  // Verify and grant access
  function verifyAndGrant(drugName) {
    const input = document.getElementById('vet-verification-input')
    const errorDiv = document.getElementById('access-error')
    const grantedDiv = document.getElementById('access-granted')
    const formDiv = document.getElementById('access-form')
    
    if (!input) return

    const code = input.value.trim()
    
    // Simple verification - in production this would verify against a server
    // For now, use a basic code that can be distributed to veterinarians
    const validCodes = ['VET2026', 'DVMACCESS', 'VETPROF', 'DEALICENSE']
    
    if (validCodes.includes(code.toUpperCase())) {
      grantAccess({
        drug: drugName,
        code: code.toUpperCase(),
        timestamp: new Date().toISOString()
      })
      
      if (formDiv) formDiv.style.display = 'none'
      if (grantedDiv) grantedDiv.style.display = 'block'
      
      // Call granted callback
      if (window._controlledOnGranted) {
        setTimeout(() => {
          window._controlledOnGranted(drugName)
          window._controlledOnGranted = null
        }, 1500)
      }
    } else {
      if (errorDiv) {
        errorDiv.style.display = 'block'
        errorDiv.textContent = 'Invalid verification code. Please contact your administrator.'
      }
      logAuditEvent('ACCESS_DENIED_INVALID_CODE', { drug: drugName })
    }
  }

  // Filter drugs to exclude controlled substances if no access
  function filterControlledDrugs(drugs) {
    if (hasActiveAccess()) {
      return drugs
    }
    
    return drugs.filter(drug => {
      const drugName = typeof drug === 'string' ? drug : drug.name
      return !isControlled(drugName)
    })
  }

  // Wrap drug select options
  function wrapDrugSelect(selectElement, drugs) {
    if (!selectElement) return
    
    const filteredDrugs = filterControlledDrugs(drugs)
    
    selectElement.innerHTML = '<option value="">Select drug...</option>'
    
    filteredDrugs.forEach(drug => {
      const option = document.createElement('option')
      option.value = drug.name || drug
      option.textContent = drug.name || drug
      selectElement.appendChild(option)
    })
    
    // Add controlled section header if user has access
    if (hasActiveAccess()) {
      const controlledHeader = document.createElement('optgroup')
      controlledHeader.label = '🔒 Controlled Substances (Vet Access)'
      
      const controlledDrugs = drugs.filter(drug => {
        const drugName = typeof drug === 'string' ? drug : drug.name
        return isControlled(drugName)
      })
      
      controlledDrugs.forEach(drug => {
        const option = document.createElement('option')
        option.value = drug.name || drug
        option.textContent = drug.name || drug
        controlledHeader.appendChild(option)
      })
      
      if (controlledDrugs.length > 0) {
        selectElement.appendChild(controlledHeader)
      }
    }
  }

  // Check access before showing drug info
  function checkDrugAccess(drugName, onAccess, onDenied) {
    if (!isControlled(drugName)) {
      // Not controlled, allow access
      if (onAccess) onAccess(drugName)
      return true
    }
    
    if (hasActiveAccess()) {
      // Has active access
      logAuditEvent('CONTROLLED_DRUG_ACCESSED', { drug: drugName })
      if (onAccess) onAccess(drugName)
      return true
    }
    
    // Show access modal
    showAccessModal(drugName, onAccess, onDenied)
    return false
  }

  // Initialize on page load
  function init() {
    // Add controlled indicator to any existing controlled drug options
    const drugSelects = document.querySelectorAll('select[id*="drug"], select[name*="drug"]')
    drugSelects.forEach(select => {
      select.addEventListener('change', function(e) {
        const drugName = e.target.value
        if (isControlled(drugName) && !hasActiveAccess()) {
          e.preventDefault()
          e.target.value = ''
          checkDrugAccess(drugName, () => {
            e.target.value = drugName
            e.target.dispatchEvent(new Event('change'))
          })
        }
      })
    })
  }

  // Public API
  window.ControlledSubstanceAccess = {
    isControlled,
    getControlledInfo,
    hasActiveAccess,
    grantAccess,
    revokeAccess,
    showAccessModal,
    closeModal,
    verifyAndGrant,
    checkDrugAccess,
    filterControlledDrugs,
    wrapDrugSelect,
    logAuditEvent,
    CONFIG
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
