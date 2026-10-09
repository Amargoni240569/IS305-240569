// The base User class stores common identity data for every role.

class User {
  // Construct a user and validate all shared fields.
  constructor(userId, firstName, lastName, email, userType = 'Requester') {
    // Store the identifier in a private field.
    this.#userId = userId;

    // Store and validate the first name through its setter.
    this.firstName = firstName;

    // Store and validate the last name through its setter.
    this.lastName = lastName;

    // Store and validate the email through its setter.
    this.email = email;

    // Store the role used by Credit permission checks.
    this.userType = userType;

    // Validate the identifier after all values are assigned.
    this.validate();
  }

  // Keep the user identifier private and read-only.
  #userId;

  // Keep the remaining shared fields private through backing fields.
  #firstName;
  #lastName;
  #email;
  #userType;

  // Return the private user identifier.
  get userId() { return this.#userId; }

  // Return the first name.
  get firstName() { return this.#firstName; }

  // Set a non-empty first name.
  set firstName(value) { if (!String(value ?? '').trim()) throw new Error('First name is required.'); this.#firstName = String(value).trim(); }

  // Return the last name.
  get lastName() { return this.#lastName; }

  // Set a non-empty last name.
  set lastName(value) { if (!String(value ?? '').trim()) throw new Error('Last name is required.'); this.#lastName = String(value).trim(); }

  // Return the email address.
  get email() { return this.#email; }

  // Set an email address with a basic valid format.
  set email(value) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ''))) throw new Error('A valid email is required.'); this.#email = String(value).trim(); }

  // Return the role label.
  get userType() { return this.#userType; }

  // Set a non-empty role label.
  set userType(value) { if (!String(value ?? '').trim()) throw new Error('User type is required.'); this.#userType = String(value).trim(); }

  // Validate that an ID contains at least three safe characters.
  validate() { if (!/^\w[\w-]{2,}$/.test(this.#userId)) throw new Error('User ID must contain at least three safe characters.'); return true; }

  // Return the combined first and last name.
  getFullName() { return `${this.firstName} ${this.lastName}`; }

  // Return readable user information for the console.
  displayInfo() { return `${this.userId} | ${this.getFullName()} | ${this.email} | ${this.userType}`; }
}

// StudentRequester extends User with programme and year-level fields.
class StudentRequester extends User {

  // Call the User constructor first through super().
  constructor(userId, firstName, lastName, email, programme, yearLevel) { super(userId, firstName, lastName, email, 'StudentRequester'); if (!programme || !Number.isInteger(yearLevel) || yearLevel < 1) throw new Error('Student programme and year level are required.'); this.programme = programme; this.yearLevel = yearLevel; }
  // Include student details in the display output.
  displayInfo() { return `${super.displayInfo()} | ${this.programme} | Year ${this.yearLevel}`; }
}

// StaffRequester extends User with department information.
class StaffRequester extends User {
  // Call the User constructor first through super().
  constructor(userId, firstName, lastName, email, department) { super(userId, firstName, lastName, email, 'StaffRequester'); if (!department) throw new Error('Department is required.'); this.department = department; }
}

// ServiceOfficer extends User for review, assignment, and closure permissions.
class ServiceOfficer extends User {
  // Call the User constructor first through super().
  constructor(userId, firstName, lastName, email, serviceSection = 'Campus Services') { super(userId, firstName, lastName, email, 'ServiceOfficer'); this.serviceSection = serviceSection; }
}

// Technician extends User for assigned work permissions.
class Technician extends User {
  // Call the User constructor first through super().
  constructor(userId, firstName, lastName, email, technicalSpeciality) { super(userId, firstName, lastName, email, 'Technician'); if (!technicalSpeciality) throw new Error('Technical speciality is required.'); this.technicalSpeciality = technicalSpeciality; }
}

// Export the base class and every Credit role subclass.
module.exports = { User, StudentRequester, StaffRequester, ServiceOfficer, Technician };
