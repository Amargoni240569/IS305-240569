// Group requests by a selected property using reduce.
function groupBy(requests, property) { return requests.reduce((groups, request) => { const key = request[property]; (groups[key] ||= []).push(request); return groups; }, {}); }

// Produce the management reports required for Distinction.
function buildReports(requests, now = new Date()) { const completed = requests.filter(request => ['Resolved', 'Closed'].includes(request.status)); const resolutionHours = completed.map(request => (new Date(request.dateUpdated) - new Date(request.dateSubmitted)) / 3600000); return { byStatus: groupBy(requests, 'status'), byCategory: groupBy(requests, 'category'), byPriority: groupBy(requests, 'priority'), urgent: requests.filter(request => request.priority === 'Urgent'), overdue: requests.filter(request => request.status !== 'Closed' && request.getTargetResolutionHours && (now - new Date(request.dateSubmitted)) / 3600000 > request.getTargetResolutionHours()), byTechnician: groupBy(requests, 'assignedTechnicianId'), completedByTechnician: groupBy(completed, 'assignedTechnicianId'), averageResolutionHours: resolutionHours.length ? resolutionHours.reduce((sum, hours) => sum + hours, 0) / resolutionHours.length : 0, volumeByLocation: groupBy(requests, 'location') }; }

// Export the report builder.
module.exports = { groupBy, buildReports };
