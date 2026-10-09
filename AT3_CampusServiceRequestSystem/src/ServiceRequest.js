// These constants define the allowed categories, priorities, and workflow states.
const CATEGORIES = ['ICT Support', 'Facilities Maintenance', 'Cleaning and Sanitation', 'General Campus Service'];

// Priority values are ordered from least to most urgent.
const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

// Status transitions are controlled by this map rather than arbitrary assignments.
const TRANSITIONS = { Submitted: ['Reviewed', 'Cancelled'], Reviewed: ['Assigned', 'Cancelled'], Assigned: ['In Progress', 'Cancelled'], 'In Progress': ['Resolved'], Resolved: ['Closed'], Closed: [], Cancelled: [] };

// The base request contains common data and shared behaviour.
class ServiceRequest {

  // Build and validate a common request.
  constructor({ requestId, requester, title, description, location, category, priority = 'Normal', status = 'Submitted', dateSubmitted = new Date().toISOString(), dateUpdated = dateSubmitted, assignedTechnicianId = null, history = [] }) {

    // Keep the identifier private to demonstrate encapsulation.
    this.#requestId = requestId;

    // Store the requester object relationship.
    this.requester = requester;

    // Store the title through a controlled setter.
    this.title = title;

    // Store the description through a controlled setter.
    this.description = description;

    // Store the campus location.
    this.location = location;

    // Store category and priority values.
    this.category = category;
    this.priority = priority;

    // Store the current workflow status.
    this.status = status;

    // Preserve timestamps for reporting.
    this.dateSubmitted = dateSubmitted;
    this.dateUpdated = dateUpdated;

    // Store the assigned technician identifier when one exists.
    this.assignedTechnicianId = assignedTechnicianId;

    // Restore or create a request history collection.
    this.history = history;

    // Reject incomplete or unsupported data.
    this.validate();
  }
  
  // Private request identifier backing field.
  #requestId;
  #title;
  #description;

  // Expose the request identifier as read-only data.
  get requestId() { return this.#requestId; }

  // Return the title.
  get title() { return this.#title; }

  // Require a non-empty title.
  set title(value) { if (!String(value ?? '').trim()) throw new Error('Request title is required.'); this.#title = String(value).trim(); }

  // Return the description.
  get description() { return this.#description; }

  // Require a non-empty description.
  set description(value) { if (!String(value ?? '').trim()) throw new Error('Request description is required.'); this.#description = String(value).trim(); }

  // Validate common request fields and supported enumerations.
  validate() { if (!/^REQ[-_A-Z0-9]+$/i.test(this.requestId)) throw new Error('Request ID must start with REQ.'); if (!this.requester?.userId) throw new Error('A valid requester is required.'); if (!this.location) throw new Error('Campus location is required.'); if (!CATEGORIES.includes(this.category)) throw new Error('Unsupported request category.'); if (!PRIORITIES.includes(this.priority)) throw new Error('Unsupported priority value.'); if (!Object.hasOwn(TRANSITIONS, this.status)) throw new Error('Unsupported request status.'); return true; }

  // Base methods intentionally throw so subclasses must provide specialised behaviour.
  calculatePriorityScore() { throw new Error('Subclass must implement calculatePriorityScore().'); }

  // Base methods intentionally throw so subclasses must provide specialised behaviour.
  getTargetResolutionHours() { throw new Error('Subclass must implement getTargetResolutionHours().'); }

  // Base summaries provide common data and are overridden by specialised requests.
  getRequestSummary() { return `${this.requestId} | ${this.category} | ${this.title} | ${this.priority} | ${this.status}`; }

  // Record a workflow action in the request history.
  addHistory(previousStatus, newStatus, action, actor, comment = '') { this.history.push({ previousStatus, newStatus, action, actorIdOrRole: actor?.userId || actor?.userType || String(actor), comment, dateTime: new Date().toISOString() }); }

  // Apply only an allowed next status and record the action.
  transitionTo(newStatus, actor, comment = '') { if (!TRANSITIONS[this.status].includes(newStatus)) throw new Error(`Invalid transition from ${this.status} to ${newStatus}.`); const previous = this.status; this.status = newStatus; this.dateUpdated = new Date().toISOString(); this.addHistory(previous, newStatus, `Status changed to ${newStatus}`, actor, comment); return this.status; }

  // Update only editable fields for the owning requester.
  updateDetails(changes = {}, actor) { if (this.status !== 'Submitted') throw new Error('Only Submitted requests can be updated.'); if (actor?.userId !== this.requester.userId) throw new Error('Only the requester can update this request.'); for (const field of ['title', 'description', 'location', 'category', 'priority']) if (changes[field] !== undefined) this[field] = changes[field]; this.dateUpdated = new Date().toISOString(); this.addHistory(this.status, this.status, 'Request details updated', actor, 'Requester update'); return this; }

  // Cancel only an eligible request owned by the acting requester.
  cancelRequest(actor) { if (actor?.userId !== this.requester.userId) throw new Error('Only the requester can cancel this request.'); return this.transitionTo('Cancelled', actor, 'Requester cancellation'); }

  // Return a plain object with requester ID for persistence.
  toJSON() { return { requestId: this.requestId, requestType: this.constructor.name, requesterId: this.requester.userId, title: this.title, description: this.description, location: this.location, category: this.category, priority: this.priority, status: this.status, dateSubmitted: this.dateSubmitted, dateUpdated: this.dateUpdated, assignedTechnicianId: this.assignedTechnicianId, history: this.history, ...this.specialisedData() }; }

  // Subclasses can add their own plain fields.
  specialisedData() { return {}; }
}

// Export constants and base class for validation and other modules.
module.exports = { ServiceRequest, CATEGORIES, PRIORITIES, TRANSITIONS };
