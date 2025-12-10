import BaseModel from './BaseModel.js';

/**
 * Friendship - Manages friend relationships
 * Demonstrates: Encapsulation, Association
 */
class Friendship extends BaseModel {
  #user1;
  #user2;
  #status;
  #mutualFriends;

  constructor(data = {}) {
    super(data.id);
    this.#user1 = data.user1; // User object
    this.#user2 = data.user2; // User object
    this.#status = data.status || 'pending'; // pending, accepted, blocked
    this.#mutualFriends = data.mutualFriends || 0;
  }

  // Getters
  get user1() {
    return this.#user1;
  }

  get user2() {
    return this.#user2;
  }

  get status() {
    return this.#status;
  }

  get mutualFriends() {
    return this.#mutualFriends;
  }

  // Methods
  accept() {
    if (this.#status === 'pending') {
      this.#status = 'accepted';
      this.touch();
      return true;
    }
    return false;
  }

  decline() {
    if (this.#status === 'pending') {
      this.#status = 'declined';
      this.touch();
      return true;
    }
    return false;
  }

  block() {
    this.#status = 'blocked';
    this.touch();
  }

  unblock() {
    if (this.#status === 'blocked') {
      this.#status = 'accepted';
      this.touch();
    }
  }

  isFriendWith(user) {
    return (this.#user1.id === user.id || this.#user2.id === user.id) && 
           this.#status === 'accepted';
  }

  isPending() {
    return this.#status === 'pending';
  }

  isBlocked() {
    return this.#status === 'blocked';
  }

  validate() {
    return this.#user1 && this.#user2 && this.#user1.id !== this.#user2.id;
  }

  toJSON() {
    return {
      id: this.id,
      user1: this.#user1?.toJSON() || null,
      user2: this.#user2?.toJSON() || null,
      status: this.#status,
      mutualFriends: this.#mutualFriends,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Friendship;
