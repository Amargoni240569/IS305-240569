// Import the common request base class.
const { ServiceRequest } = require('./ServiceRequest');

// ICT requests add device and network information.
class ICTSupportRequest extends ServiceRequest {

  // Chain common data through super and validate specialised fields.
  constructor(common, specialised = {}) { super({ ...common, category: 'ICT Support' }); this.deviceType = specialised.deviceType; this.systemName = specialised.systemName; this.faultType = specialised.faultType; this.networkImpact = specialised.networkImpact; this.validateSpecialisedFields(); }

  // Validate the ICT-specific fields.
  validateSpecialisedFields() { if (!this.deviceType || !this.systemName || !this.faultType || !this.networkImpact) throw new Error('ICT device, system, fault, and network impact are required.'); }

  // Calculate a higher score for network-impacting faults.
  calculatePriorityScore() { return ({ Low: 10, Normal: 20, High: 35, Urgent: 50 })[this.priority] + (this.networkImpact === 'High' ? 20 : 0); }

  // ICT incidents target a short resolution period.
  getTargetResolutionHours() { return this.networkImpact === 'High' ? 4 : 12; }

  // Override the common summary with ICT details.
  getRequestSummary() { return `${super.getRequestSummary()} | ${this.deviceType}/${this.systemName} | Fault: ${this.faultType}`; }

  // Return specialised fields for JSON persistence.
  specialisedData() { return { deviceType: this.deviceType, systemName: this.systemName, faultType: this.faultType, networkImpact: this.networkImpact }; }
}

// Maintenance requests add building, room, hazard, and equipment information.
class MaintenanceRequest extends ServiceRequest {

  // Chain common data through super and validate specialised fields.
  constructor(common, specialised = {}) { super({ ...common, category: 'Facilities Maintenance' }); this.building = specialised.building; this.roomNumber = specialised.roomNumber; this.hazardLevel = specialised.hazardLevel; this.equipmentAffected = specialised.equipmentAffected; this.validateSpecialisedFields(); }

  // Validate the maintenance-specific fields.
  validateSpecialisedFields() { if (!this.building || !this.roomNumber || !this.hazardLevel || !this.equipmentAffected) throw new Error('Building, room, hazard, and equipment are required.'); }
  // Hazard level changes the priority score.
  calculatePriorityScore() { return ({ Low: 10, Normal: 20, High: 35, Urgent: 50 })[this.priority] + ({ Low: 0, Medium: 10, High: 20 })[this.hazardLevel]; }
  // Hazardous maintenance receives a faster target.
  getTargetResolutionHours() { return this.hazardLevel === 'High' ? 8 : 24; }
  // Override the common summary with location-specific details.
  getRequestSummary() { return `${super.getRequestSummary()} | ${this.building} Room ${this.roomNumber} | Hazard: ${this.hazardLevel}`; }
  // Return specialised fields for JSON persistence.
  specialisedData() { return { building: this.building, roomNumber: this.roomNumber, hazardLevel: this.hazardLevel, equipmentAffected: this.equipmentAffected }; }
}
// Cleaning requests add hygiene and scheduling information.
class CleaningRequest extends ServiceRequest {

  // Chain common data through super and validate specialised fields.
  constructor(common, specialised = {}) { super({ ...common, category: 'Cleaning and Sanitation' }); this.cleaningArea = specialised.cleaningArea; this.hygieneRisk = specialised.hygieneRisk; this.serviceType = specialised.serviceType; this.preferredServiceTime = specialised.preferredServiceTime; this.validateSpecialisedFields(); }

  // Validate the cleaning-specific fields.
  validateSpecialisedFields() { if (!this.cleaningArea || !this.hygieneRisk || !this.serviceType || !this.preferredServiceTime) throw new Error('Cleaning area, hygiene risk, service type, and time are required.'); }

  // Hygiene risk changes the priority score.
  calculatePriorityScore() { return ({ Low: 10, Normal: 20, High: 35, Urgent: 50 })[this.priority] + ({ Low: 0, Medium: 10, High: 20 })[this.hygieneRisk]; }

  // High hygiene risk receives a faster target.
  getTargetResolutionHours() { return this.hygieneRisk === 'High' ? 6 : 18; }

  // Override the common summary with cleaning details.
  getRequestSummary() { return `${super.getRequestSummary()} | Area: ${this.cleaningArea} | Risk: ${this.hygieneRisk}`; }

  // Return specialised fields for JSON persistence.
  specialisedData() { return { cleaningArea: this.cleaningArea, hygieneRisk: this.hygieneRisk, serviceType: this.serviceType, preferredServiceTime: this.preferredServiceTime }; }
}

// General campus requests provide concrete behaviour for the fourth Pass category.
class GeneralCampusRequest extends ServiceRequest {

  // Chain common request fields through the base constructor.
  constructor(common) { super({ ...common, category: 'General Campus Service' }); }

  // Give general requests the normal baseline priority score.
  calculatePriorityScore() { return ({ Low: 10, Normal: 20, High: 35, Urgent: 50 })[this.priority]; }

  // Give general requests a one-day target.
  getTargetResolutionHours() { return 24; }

  // Preserve the inherited summary behaviour for general requests.
  getRequestSummary() { return `${super.getRequestSummary()} | General campus service`; }
}

// Export all specialised classes for managers, factories, and tests.
module.exports = { ICTSupportRequest, MaintenanceRequest, CleaningRequest, GeneralCampusRequest };
