/**
 * Derived Class: Principal
 *
 * Demonstrates:
 * - Inheritance (`extends Person`)
 * - Calling parent constructor with `super()`
 * - Encapsulation with private collection (`#members`)
 * - Method overriding for polymorphism (`describeRole`)
 * - Type and duplicate validation
 */

const Person = require("./Person");

class Principal extends Person {
  // Private collection of school members
  #members = [];

  /**
   * Constructs a Principal instance
   * @param {string} name
   * @param {string} email
   * @param {string|number} id
   */
  constructor(name, email, id) {
    super(name, email, id);
  }

  /**
   * Adds a new member (Teacher or Student) to the school
   * @param {Person} member - Instance of Person subclass
   */
  addMember(member) {
    if (!(member instanceof Person)) {
      throw new TypeError("Operation Failed: Only valid Person instances (Teacher, Student) can be added as school members.");
    }

    // Check for duplicate ID
    const exists = this.#members.some((m) => m.id === member.id);
    if (exists) {
      throw new Error(`Operation Failed: Member with ID '${member.id}' is already registered in the school.`);
    }

    this.#members.push(member);
    console.log(`[Principal Action] Registered new member: ${member.name} (${member.constructor.name}) with ID ${member.id}`);
    return member;
  }

  /**
   * Removes a member from the school by ID
   * @param {string|number} id - ID of the member to remove
   * @returns {Person} The removed member instance
   */
  removeMember(id) {
    const cleanId = String(id).trim();
    const index = this.#members.findIndex((m) => m.id === cleanId);

    if (index === -1) {
      throw new Error(`Operation Failed: Cannot remove member. ID '${id}' not found in school registry.`);
    }

    const removed = this.#members.splice(index, 1)[0];
    console.log(`[Principal Action] Removed member: ${removed.name} (ID ${removed.id}) from registry.`);
    return removed;
  }

  /**
   * Returns a shallow copy of all registered members
   * @returns {Array<Person>}
   */
  getMembers() {
    return [...this.#members];
  }

  /**
   * Displays and returns a formatted list of all registered school members
   * @returns {Array<string>}
   */
  listMembers() {
    console.log(`\n--- School Registry (Managed by Principal ${this.name}) ---`);
    if (this.#members.length === 0) {
      console.log("  (No members currently registered)");
      return [];
    }

    const formattedList = this.#members.map((member, index) => {
      const entry = `[${index + 1}] ${member.constructor.name}: ${member.name} | ID: ${member.id} | Email: ${member.email}`;
      console.log(`  ${entry}`);
      return entry;
    });
    console.log("----------------------------------------------------------\n");

    return formattedList;
  }

  /**
   * Polymorphic role description override
   * @returns {string}
   */
  describeRole() {
    return `Principal: ${this.name} - Executive Head of School overseeing ${this.#members.length} registered member(s).`;
  }
}

module.exports = Principal;
