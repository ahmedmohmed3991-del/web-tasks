/**
 * Base Class: Person
 *
 * Demonstrates:
 * - Public and private (#) fields
 * - Encapsulation using getters and setters with input validation
 * - Base method for polymorphism (describeRole)
 */

class Person {
  // Public property
  name;

  // Private fields for encapsulation
  #email;
  #id;

  /**
   * Constructs a new Person instance
   * @param {string} name - Person's full name
   * @param {string} email - Person's email address
   * @param {string|number} id - Person's unique identification ID
   */
  constructor(name, email, id) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Validation Error: Name must be a non-empty string.");
    }
    this.name = name.trim();

    // Use setters to enforce validation during construction
    this.email = email;
    this.id = id;
  }

  // --- Getter & Setter for #email ---

  get email() {
    return this.#email;
  }

  set email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || typeof value !== "string" || !emailRegex.test(value.trim())) {
      throw new Error(`Validation Error: Invalid email address format '${value}'.`);
    }
    this.#email = value.trim().toLowerCase();
  }

  // --- Getter & Setter for #id ---

  get id() {
    return this.#id;
  }

  set id(value) {
    if (value === undefined || value === null || String(value).trim().length === 0) {
      throw new Error("Validation Error: ID cannot be empty.");
    }
    const cleanId = String(value).trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanId)) {
      throw new Error(`Validation Error: ID '${value}' contains invalid characters. Alphanumeric, hyphens, and underscores only.`);
    }
    this.#id = cleanId;
  }

  /**
   * Describes the person's role in the institution (Base implementation)
   * Intended to be overridden by subclasses to demonstrate polymorphism.
   * @returns {string}
   */
  describeRole() {
    return `Person: ${this.name} (ID: ${this.id}, Email: ${this.email})`;
  }
}

module.exports = Person;
