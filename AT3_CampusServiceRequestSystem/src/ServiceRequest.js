// These are the four categories required by the assessment.
const CATEGORIES = ['ICT Support', 'Facilities Maintenance', 'Cleaning and Sanitation', 'General Campus Service'];

// These are the four supported priority values.
const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

// This map controls every valid Credit workflow transition.
const TRANSITIONS = { Submitted: ['Reviewed', 'Cancelled'], Reviewed: ['Assigned', 'Cancelled'], Assigned: ['In Progress'], 'In Progress': ['Resolved'], Resolved: ['Closed'], Closed: [], Cancelled: [] };

// ServiceRequest stores common request data and shared behaviour.

class ServiceRequest {
  // Construct a request with a default Submitted status.
  constructor({ requestId, requester, title, description, location, category, priority = 'Normal', status = 'Submitted', dateSubmitted = new Date().toISOString(), dateUpdated = dateSubmitted, assignedTechnicianId = null, history = [] }) {

    // Store the request ID privately.
    this.#requestId = requestId;

    // Store the requester object relationship.
    this.requester = requester;

    // Store title and description through controlled setters.
    this.title = title;
    this.description = description;

    // Store the campus location and classification values.
    this.location = location;
    this.category = category;
    this.priority = priority;

    // Store the current workflow state.
    this.status = status;

    // Store submission and update timestamps for history context.
        this.dateSubmitted = dateSubmitted;
    this.dateUpdated = dateUpdated;

    // Store the assigned technician ID when assignment has occurred.
    this.assignedTechnicianId = assignedTechnicianId;
    // Restore history or start a new history array.
    this.history = history;

    // Reject incomplete or unsupported request data.
    this.validate();
  }

  // Keep common identifiers and text values private.
  #requestId;
  #title;
  #description;

  // Return the private request ID.
  get requestId() { return this.#requestId; }

  // Return the title.
  get title() { return this.#title; }

  // Set a non-empty request title.
  set title(value) { if (!String(value ?? '').trim()) throw new Error('Request title is required.'); this.#title = String(value).trim(); }

  // Return the description.
  get description() { return this.#description; }

  // Set a non-empty request description.
  set description(value) { if (!String(value ?? '').trim()) throw new Error('Request description is required.'); this.#description = String(value).trim(); }

  // Validate common fields and supported values.
  validate() { if (!/^REQ[-_A-Z0-9]+$/i.test(this.requestId)) throw new Error('Request ID must start with REQ.'); if (!this.requester?.userId) throw new Error('A valid requester is required.'); if (!String(this.location ?? '').trim()) throw new Error('Campus location is required.'); if (!CATEGORIES.includes(this.category)) throw new Error('Unsupported request category.'); if (!PRIORITIES.includes(this.priority)) throw new Error('Unsupported priority value.'); if (!Object.hasOwn(TRANSITIONS, this.status)) throw new Error('Unsupported request status.'); return true; }

  // Base Credit behaviour provides a common summary.
  getRequestSummary() { return `${this.requestId} | ${this.category} | ${this.title} | ${this.priority} | ${this.status}`; }

  // Subclasses override this method with specialised scoring.
  calculatePriorityScore() { throw new Error('Subclass must implement calculatePriorityScore().'); }

  // Subclasses override this method with specialised targets.
  getTargetResolutionHours() { throw new Error('Subclass must implement getTargetResolutionHours().'); }

  // Add an approved action to the request history array.
  addHistory(previousStatus, newStatus, action, actor, comment = '') { this.history.push({ previousStatus, newStatus, action, actorIdOrRole: actor?.userId || actor?.userType || String(actor), comment, dateTime: new Date().toISOString() }); }

  // Move to a new state only when the transition is permitted.
  transitionTo(newStatus, actor, comment = '') { if (!TRANSITIONS[this.status].includes(newStatus)) throw new Error(`Invalid transition from ${this.status} to ${newStatus}.`); const previousStatus = this.status; this.status = newStatus; this.dateUpdated = new Date().toISOString(); this.addHistory(previousStatus, newStatus, `Status changed to ${newStatus}`, actor, comment); return this.status; }

  // Update only fields permitted for an owned Submitted request.
  updateDetails(changes = {}, actor) { if (this.status !== 'Submitted') throw new Error('Only Submitted requests can be updated.'); if (actor?.userId !== this.requester.userId) throw new Error('Only the requester can update this request.'); for (const field of ['title', 'description', 'location', 'category', 'priority']) if (changes[field] !== undefined) this[field] = changes[field]; this.dateUpdated = new Date().toISOString(); this.addHistory('Submitted', 'Submitted', 'Request details updated', actor, 'Requester update'); return this; }
  
  // Cancel only an owned request through the transition guard.
  cancelRequest(actor) { if (actor?.userId !== this.requester.userId) throw new Error('Only the requester can cancel this request.'); return this.transitionTo('Cancelled', actor, 'Requester cancellation'); }
}

// Export the base class and shared validation constants.
module.exports = { ServiceRequest, CATEGORIES, PRIORITIES, TRANSITIONS };
