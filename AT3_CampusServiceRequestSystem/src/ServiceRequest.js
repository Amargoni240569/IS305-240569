// These categories are the only categories accepted by the Pass component.
const CATEGORIES = ['ICT Support', 'Facilities Maintenance', 'Cleaning and Sanitation', 'General Campus Service'];

// These priorities are the only priority values accepted by the Pass component.
const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

// The Pass component supports Submitted and final Cancelled statuses.
const STATUSES = ['Submitted', 'Cancelled'];

// ServiceRequest stores one submitted campus service request.
class ServiceRequest {
  
  // Construct a request with Submitted as the default status.
  constructor({ requestId, requester, title, description, location, category, priority = 'Normal', status = 'Submitted', dateSubmitted = new Date().toISOString(), dateUpdated = dateSubmitted }) {

    // Keep the request ID private for encapsulation.
    this.#requestId = requestId;

    // Store the requester object relationship.
    this.requester = requester;

    // Store title and description using controlled setters.
    this.title = title;
    this.description = description;

    // Store the campus location and supported classification values.
    this.location = location;
    this.category = category;
    this.priority = priority;

    // Store the initial or restored request status.
    this.status = status;

    // Store submission and last-update timestamps.
    this.dateSubmitted = dateSubmitted;
    this.dateUpdated = dateUpdated;

    // Reject invalid data before the request enters the manager array.
    this.validate();
  }

  // Keep the request ID, title, and description private.
  #requestId;
  #title;
  #description;

  // Return the private request ID.
  get requestId() { return this.#requestId; }

  // Return the request title.
  get title() { return this.#title; }

  // Require a non-empty title.
  set title(value) { if (!String(value ?? '').trim()) throw new Error('Request title is required.'); this.#title = String(value).trim(); }

  // Return the request description.
  get description() { return this.#description; }

  // Require a non-empty description.
  set description(value) { if (!String(value ?? '').trim()) throw new Error('Request description is required.'); this.#description = String(value).trim(); }

  // Validate IDs, ownership, location, categories, priorities, and statuses.
  validate() { if (!/^REQ[-_A-Z0-9]+$/i.test(this.requestId)) throw new Error('Request ID must start with REQ.'); if (!this.requester?.userId) throw new Error('A valid requester is required.'); if (!String(this.location ?? '').trim()) throw new Error('Campus location is required.'); if (!CATEGORIES.includes(this.category)) throw new Error('Unsupported request category.'); if (!PRIORITIES.includes(this.priority)) throw new Error('Unsupported priority value.'); if (!STATUSES.includes(this.status)) throw new Error('Unsupported Pass status.'); return true; }
  // Return a concise summary for console viewing.
  getRequestSummary() { return `${this.requestId} | ${this.category} | ${this.title} | ${this.priority} | ${this.status}`; }

  // Update only an owned request that is still Submitted.
  updateDetails(changes = {}, actor) { if (this.status !== 'Submitted') throw new Error('Only Submitted requests can be updated.'); if (actor?.userId !== this.requester.userId) throw new Error('Only the requester can update this request.'); const original = { title: this.title, description: this.description, location: this.location, category: this.category, priority: this.priority }; try { for (const field of ['title', 'description', 'location', 'category', 'priority']) if (changes[field] !== undefined) this[field] = changes[field]; this.validate(); } catch (error) { Object.assign(this, original); throw error; } this.dateUpdated = new Date().toISOString(); return this; }

  // Cancel only an owned Submitted request.
  cancelRequest(actor) { if (this.status !== 'Submitted') throw new Error('Only Submitted requests can be cancelled.'); if (actor?.userId !== this.requester.userId) throw new Error('Only the requester can cancel this request.'); this.status = 'Cancelled'; this.dateUpdated = new Date().toISOString(); return this; }
}

// Export the class and constants for the manager, app, and tests.
module.exports = { ServiceRequest, CATEGORIES, PRIORITIES, STATUSES };
