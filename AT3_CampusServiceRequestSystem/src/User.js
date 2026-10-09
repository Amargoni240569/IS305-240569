// The User class represents a student, staff member, or other requester.
class User {

  // Construct a user from the required identity and contact values.
  constructor(userId, firstName, lastName, email, userType = 'Requester') {

    // Store the identifier in a private field for encapsulation.
    this.#userId = userId;

    // Store the first name through its controlled setter.
    this.firstName = firstName;

    // Store the last name through its controlled setter.
    this.lastName = lastName;

    // Store the email through its controlled setter.
    this.email = email;

    // Store the user type used for display.
    this.userType = userType;

    // Validate the identifier after construction.
    this.validate();
  }

  // Keep all user values private behind public accessors.
  #userId;
  #firstName;
  #lastName;
  #email;
  #userType;

  // Return the private user ID.
  get userId() { return this.#userId; }

  // Return the first name.
  get firstName() { return this.#firstName; }

  // Accept only a non-empty first name.
  set firstName(value) { if (!String(value ?? '').trim()) throw new Error('First name is required.'); this.#firstName = String(value).trim(); }

  // Return the last name.
  get lastName() { return this.#lastName; }

  // Accept only a non-empty last name.
  set lastName(value) { if (!String(value ?? '').trim()) throw new Error('Last name is required.'); this.#lastName = String(value).trim(); }

  // Return the email address.
  get email() { return this.#email; }

  // Accept only a basic valid email format.
  set email(value) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ''))) throw new Error('A valid email is required.'); this.#email = String(value).trim(); }

  // Return the user type.
  get userType() { return this.#userType; }

  // Accept only a non-empty user type.
  set userType(value) { if (!String(value ?? '').trim()) throw new Error('User type is required.'); this.#userType = String(value).trim(); }
  
  // Reject identifiers that are too short or contain unsafe characters.
  validate() { if (!/^\w[\w-]{2,}$/.test(this.#userId)) throw new Error('User ID must contain at least three safe characters.'); return true; }

  // Return the user's full name.
  getFullName() { return `${this.firstName} ${this.lastName}`; }

  // Return a simple console-friendly user summary.
  displayInfo() { return `${this.userId} | ${this.getFullName()} | ${this.email} | ${this.userType}`; }
}

// Export the Pass User class for the request manager and tests.
module.exports = { User };
