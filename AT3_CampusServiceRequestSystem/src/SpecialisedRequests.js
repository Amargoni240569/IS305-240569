// Import the common ServiceRequest base class.
const { ServiceRequest } = require('./ServiceRequest');

// ICTSupportRequest models device, system, fault, and network impact information.

class ICTSupportRequest extends ServiceRequest {
  // Chain common request data through super() before setting ICT fields.
  constructor(common, specialised = {}) { super({ ...common, category: 'ICT Support' }); this.deviceType = specialised.deviceType; this.systemName = specialised.systemName; this.faultType = specialised.faultType; this.networkImpact = specialised.networkImpact; this.validateSpecialisedFields(); }

  // Validate every required ICT-specific field.
  validateSpecialisedFields() { if (!this.deviceType || !this.systemName || !this.faultType || !this.networkImpact) throw new Error('ICT device, system, fault, and network impact are required.'); return true; }

  // Override the score method with network-impact behaviour.
  calculatePriorityScore() { return ({ Low: 10, Normal: 20, High: 35, Urgent: 50 })[this.priority] + (this.networkImpact === 'High' ? 20 : 0); }
  // Override the target method with a shorter high-impact target.
  getTargetResolutionHours() { return this.networkImpact === 'High' ? 4 : 12; }
  // Override the summary method with ICT-specific information.
  getRequestSummary() { return `${super.getRequestSummary()} | ${this.deviceType}/${this.systemName} | Fault: ${this.faultType}`; }
}

// MaintenanceRequest models building, room, hazard, and equipment information.

class MaintenanceRequest extends ServiceRequest {
  // Chain common request data through super() before setting maintenance fields.
  constructor(common, specialised = {}) { super({ ...common, category: 'Facilities Maintenance' }); this.building = specialised.building; this.roomNumber = specialised.roomNumber; this.hazardLevel = specialised.hazardLevel; this.equipmentAffected = specialised.equipmentAffected; this.validateSpecialisedFields(); }

  // Validate every required maintenance-specific field.
  validateSpecialisedFields() { if (!this.building || !this.roomNumber || !this.hazardLevel || !this.equipmentAffected) throw new Error('Building, room, hazard, and equipment are required.'); return true; }

  // Override the score method with hazard-level behaviour.
  calculatePriorityScore() { return ({ Low: 10, Normal: 20, High: 35, Urgent: 50 })[this.priority] + ({ Low: 0, Medium: 10, High: 20 })[this.hazardLevel]; }

  // Override the target method with a hazard-level target.
  getTargetResolutionHours() { return this.hazardLevel === 'High' ? 8 : 24; }

  // Override the summary method with maintenance-specific information.
  getRequestSummary() { return `${super.getRequestSummary()} | ${this.building} Room ${this.roomNumber} | Hazard: ${this.hazardLevel}`; }
}

// CleaningRequest models cleaning area, risk, service type, and preferred time.

class CleaningRequest extends ServiceRequest {
  // Chain common request data through super() before setting cleaning fields.
  constructor(common, specialised = {}) { super({ ...common, category: 'Cleaning and Sanitation' }); this.cleaningArea = specialised.cleaningArea; this.hygieneRisk = specialised.hygieneRisk; this.serviceType = specialised.serviceType; this.preferredServiceTime = specialised.preferredServiceTime; this.validateSpecialisedFields(); }

  // Validate every required cleaning-specific field.
  validateSpecialisedFields() { if (!this.cleaningArea || !this.hygieneRisk || !this.serviceType || !this.preferredServiceTime) throw new Error('Cleaning area, hygiene risk, service type, and time are required.'); return true; }

  // Override the score method with hygiene-risk behaviour.
  calculatePriorityScore() { return ({ Low: 10, Normal: 20, High: 35, Urgent: 50 })[this.priority] + ({ Low: 0, Medium: 10, High: 20 })[this.hygieneRisk]; }

  // Override the target method with a hygiene-risk target.
  getTargetResolutionHours() { return this.hygieneRisk === 'High' ? 6 : 18; }

  // Override the summary method with cleaning-specific information.
  getRequestSummary() { return `${super.getRequestSummary()} | Area: ${this.cleaningArea} | Risk: ${this.hygieneRisk}`; }
}

// Export all Credit request subclasses.
module.exports = { ICTSupportRequest, MaintenanceRequest, CleaningRequest };
