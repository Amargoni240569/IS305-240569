// The base User class stores shared identity and contact details for every system role.
class User {

  // The constructor creates a user and validates all required values.
  constructor(userId, firstName, lastName, email, userType = 'Requester') {

    // Store the identifier privately through a JavaScript private field.
    this.#userId = userId;

    // Store the first name after checking it is usable.
    this.firstName = firstName;

    // Store the last name after checking it is usable.
    this.lastName = lastName;

    // Store the email address after checking its simple format.
    this.email = email;

    // Store the role label used by permission checks.
    this.userType = userType;

    // Reject invalid values immediately so invalid objects cannot enter the system.
    this.validate();
  }

  // Keep the user identifier private and read-only from outside the class.
  #userId;
  #firstName;
  #lastName;
  #email;
  #userType;

  // Return the identifier without exposing internal storage.
  get userId() { return this.#userId; }

  // Return the first name.
  get firstName() { return this.#firstName; }

  // Set a valid first name through a controlled setter.
  set firstName(value) { if (!String(value ?? '').trim()) throw new Error('First name is required.'); this.#firstName = String(value).trim(); }

  // Return the last name.
  get lastName() { return this.#lastName; }

  // Set a valid last name through a controlled setter.
  set lastName(value) { if (!String(value ?? '').trim()) throw new Error('Last name is required.'); this.#lastName = String(value).trim(); }

  // Return the email address.
  get email() { return this.#email; }
  
  // Set an email address only when it has a basic valid structure.
  set email(value) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ''))) throw new Error('A valid email is required.'); this.#email = String(value).trim(); }

  // Return the role type.
  get userType() { return this.#userType; }

  // Allow only a non-empty role label.
  set userType(value) { if (!String(value ?? '').trim()) throw new Error('User type is required.'); this.#userType = String(value).trim(); }

  // Validate the identifier and all other shared user fields.
  validate() { if (!/^\w[\w-]{2,}$/.test(this.#userId)) throw new Error('User ID must contain at least three safe characters.'); return true; }

  // Return a display name made from the two name fields.
  getFullName() { return `${this.firstName} ${this.lastName}`; }

  // Return a safe summary suitable for console output.
  displayInfo() { return `${this.userId} | ${this.getFullName()} | ${this.email} | ${this.userType}`; }

  // Convert the user into plain JSON data without private field syntax.
  toJSON() { return { userId: this.userId, firstName: this.firstName, lastName: this.lastName, email: this.email, userType: this.userType }; }
}

// A student requester adds study programme and year level information.
class StudentRequester extends User {

  // Call the base constructor first through super for constructor chaining.
  constructor(userId, firstName, lastName, email, programme, yearLevel) { super(userId, firstName, lastName, email, 'StudentRequester'); this.programme = programme; this.yearLevel = yearLevel; if (!programme || !Number.isInteger(yearLevel) || yearLevel < 1) throw new Error('Student programme and year level are required.'); }

  // Include student-specific information in the display.
  displayInfo() { return `${super.displayInfo()} | ${this.programme} | Year ${this.yearLevel}`; }

  // Preserve specialised fields when saving the object.
  toJSON() { return { ...super.toJSON(), programme: this.programme, yearLevel: this.yearLevel }; }
}

// A staff requester adds a department.
class StaffRequester extends User {

  // Chain into User and then validate the department.
  constructor(userId, firstName, lastName, email, department) { super(userId, firstName, lastName, email, 'StaffRequester'); if (!department) throw new Error('Department is required.'); this.department = department; }

  // Preserve the department in saved data.
  toJSON() { return { ...super.toJSON(), department: this.department }; }
}

// A service officer is allowed to review, assign, verify, and close requests.
class ServiceOfficer extends User {

  // Chain into User and store the service section.
  constructor(userId, firstName, lastName, email, serviceSection = 'Campus Services') { super(userId, firstName, lastName, email, 'ServiceOfficer'); this.serviceSection = serviceSection; }
  // Preserve the section in saved data.
  toJSON() { return { ...super.toJSON(), serviceSection: this.serviceSection }; }
}

// A technician performs assigned work and records progress.
class Technician extends User {

  // Chain into User and store the technical speciality.
  constructor(userId, firstName, lastName, email, technicalSpeciality) { super(userId, firstName, lastName, email, 'Technician'); if (!technicalSpeciality) throw new Error('Technical speciality is required.'); this.technicalSpeciality = technicalSpeciality; }

  // Preserve the speciality in saved data.
  toJSON() { return { ...super.toJSON(), technicalSpeciality: this.technicalSpeciality }; }
}

// Export every role so other modules can compose the hierarchy.
module.exports = { User, StudentRequester, StaffRequester, ServiceOfficer, Technician };
