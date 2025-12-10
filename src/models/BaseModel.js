/**
 * BaseModel - Abstract base class for all models
 * Demonstrates: Abstraction, Encapsulation
 */
class BaseModel {
  #id;
  #createdAt;
  #updatedAt;

  constructor(id = null) {
    if (this.constructor === BaseModel) {
      throw new Error("Cannot instantiate abstract class BaseModel");
    }
    this.#id = id || this.generateId();
    this.#createdAt = new Date();
    this.#updatedAt = new Date();
  }

  // Encapsulation: Getters and Setters
  get id() {
    return this.#id;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  // Protected method - to be used by child classes
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Update timestamp
  touch() {
    this.#updatedAt = new Date();
  }

  // Abstract method - must be implemented by child classes
  validate() {
    throw new Error("validate() must be implemented by child class");
  }

  // Abstract method - must be implemented by child classes
  toJSON() {
    throw new Error("toJSON() must be implemented by child class");
  }
}

export default BaseModel;
