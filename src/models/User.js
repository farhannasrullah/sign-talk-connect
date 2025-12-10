import BaseModel from './BaseModel.js';

/**
 * User - Base user class
 * Demonstrates: Inheritance, Encapsulation, Polymorphism
 */
class User extends BaseModel {
  #name;
  #username;
  #email;
  #avatar;
  #bio;
  #isOnline;

  constructor(data = {}) {
    super(data.id);
    this.#name = data.name || '';
    this.#username = data.username || '';
    this.#email = data.email || '';
    this.#avatar = data.avatar || '👤';
    this.#bio = data.bio || '';
    this.#isOnline = data.isOnline || false;
  }

  // Getters
  get name() {
    return this.#name;
  }

  get username() {
    return this.#username;
  }

  get email() {
    return this.#email;
  }

  get avatar() {
    return this.#avatar;
  }

  get bio() {
    return this.#bio;
  }

  get isOnline() {
    return this.#isOnline;
  }

  // Setters with validation
  set name(value) {
    if (!value || value.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    this.#name = value;
    this.touch();
  }

  set username(value) {
    if (!value || !value.startsWith('@')) {
      throw new Error("Username must start with @");
    }
    this.#username = value;
    this.touch();
  }

  set bio(value) {
    this.#bio = value;
    this.touch();
  }

  set avatar(value) {
    this.#avatar = value;
    this.touch();
  }

  // Methods
  setOnlineStatus(status) {
    this.#isOnline = status;
    this.touch();
  }

  getDisplayName() {
    return this.#name;
  }

  // Polymorphism - can be overridden by child classes
  getUserType() {
    return 'Regular User';
  }

  // Implementation of abstract method
  validate() {
    return this.#name && this.#username && this.#email;
  }

  // Implementation of abstract method
  toJSON() {
    return {
      id: this.id,
      name: this.#name,
      username: this.#username,
      email: this.#email,
      avatar: this.#avatar,
      bio: this.#bio,
      isOnline: this.#isOnline,
      userType: this.getUserType(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * DeafUser - Specialized user class for deaf community members
 * Demonstrates: Inheritance, Polymorphism
 */
class DeafUser extends User {
  #preferredSignLanguage;
  #accessibilitySettings;

  constructor(data = {}) {
    super(data);
    this.#preferredSignLanguage = data.preferredSignLanguage || 'ASL';
    this.#accessibilitySettings = data.accessibilitySettings || {
      captionsEnabled: true,
      vibrationAlerts: true,
      visualNotifications: true
    };
  }

  get preferredSignLanguage() {
    return this.#preferredSignLanguage;
  }

  set preferredSignLanguage(value) {
    this.#preferredSignLanguage = value;
    this.touch();
  }

  get accessibilitySettings() {
    return { ...this.#accessibilitySettings };
  }

  updateAccessibilitySettings(settings) {
    this.#accessibilitySettings = { ...this.#accessibilitySettings, ...settings };
    this.touch();
  }

  // Polymorphism - override parent method
  getUserType() {
    return 'Deaf Community Member';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      preferredSignLanguage: this.#preferredSignLanguage,
      accessibilitySettings: this.#accessibilitySettings
    };
  }
}

/**
 * InstructorUser - Specialized user class for sign language instructors
 * Demonstrates: Inheritance, Polymorphism
 */
class InstructorUser extends User {
  #certifications;
  #specializations;
  #yearsOfExperience;

  constructor(data = {}) {
    super(data);
    this.#certifications = data.certifications || [];
    this.#specializations = data.specializations || [];
    this.#yearsOfExperience = data.yearsOfExperience || 0;
  }

  get certifications() {
    return [...this.#certifications];
  }

  get specializations() {
    return [...this.#specializations];
  }

  get yearsOfExperience() {
    return this.#yearsOfExperience;
  }

  addCertification(cert) {
    this.#certifications.push(cert);
    this.touch();
  }

  addSpecialization(spec) {
    this.#specializations.push(spec);
    this.touch();
  }

  // Polymorphism - override parent method
  getUserType() {
    return 'Sign Language Instructor';
  }

  getDisplayName() {
    return `${super.getDisplayName()} (Instructor)`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      certifications: this.#certifications,
      specializations: this.#specializations,
      yearsOfExperience: this.#yearsOfExperience
    };
  }
}

export { User, DeafUser, InstructorUser };
export default User;
