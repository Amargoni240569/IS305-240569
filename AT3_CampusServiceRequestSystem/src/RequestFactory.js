// Import user roles for restoration.
const { User, StudentRequester, StaffRequester, ServiceOfficer, Technician } = require('./User');

// Import specialised request constructors for restoration.
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest, GeneralCampusRequest } = require('./specialisedRequests');

// Restore a user subclass based on the saved role label.
function restoreUser(data) { const common = [data.userId, data.firstName, data.lastName, data.email]; if (data.userType === 'StudentRequester') return new StudentRequester(...common, data.programme, data.yearLevel); if (data.userType === 'StaffRequester') return new StaffRequester(...common, data.department); if (data.userType === 'ServiceOfficer') return new ServiceOfficer(...common, data.serviceSection); if (data.userType === 'Technician') return new Technician(...common, data.technicalSpeciality); return new User(...common, data.userType); }

// Restore a request subclass and reconnect it to the active requester object.
function restoreRequest(data, requester) { const common = { ...data, requester }; if (data.requestType === 'ICTSupportRequest') return new ICTSupportRequest(common, data); if (data.requestType === 'MaintenanceRequest') return new MaintenanceRequest(common, data); if (data.requestType === 'CleaningRequest') return new CleaningRequest(common, data); if (data.requestType === 'GeneralCampusRequest') return new GeneralCampusRequest(common); throw new Error(`Unknown request type ${data.requestType}.`); }

// Export both factory functions.
module.exports = { restoreUser, restoreRequest };
