# Object-Oriented Programming Implementation - Sign To Talk App

## Overview
This document explains the comprehensive OOP implementation in the Sign To Talk application, demonstrating all major OOP principles required for a final project in Object-Oriented Programming (PBO - Pemrograman Berorientasi Objek).

---

## 🎯 OOP Principles Implemented

### 1. **Encapsulation (Enkapsulasi)**
- **Private fields** using JavaScript private class fields (`#fieldName`)
- **Getters and Setters** for controlled access to private data
- **Data hiding** to protect object state

**Example:**
```javascript
class User extends BaseModel {
  #name;      // Private field
  #email;     // Private field
  #isOnline;  // Private field

  get name() {
    return this.#name;  // Getter
  }

  set name(value) {     // Setter with validation
    if (!value || value.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    this.#name = value;
  }
}
```

**Files:** 
- `src/models/User.js`
- `src/models/Post.js`
- `src/models/Message.js`
- `src/models/Video.js`

---

### 2. **Inheritance (Pewarisan)**
- **Base class** (`BaseModel`) with common functionality
- **Child classes** extending base class
- **Method overriding** for specialized behavior

**Example:**
```javascript
// Base class
class BaseModel {
  #id;
  #createdAt;
  
  constructor(id) {
    this.#id = id || this.generateId();
  }
  
  // Abstract methods
  validate() {
    throw new Error("Must be implemented");
  }
}

// Child classes
class User extends BaseModel { }
class DeafUser extends User { }
class InstructorUser extends User { }
```

**Inheritance Hierarchy:**
```
BaseModel
├── User
│   ├── DeafUser
│   └── InstructorUser
├── Post
│   └── VideoPost
├── Message
│   └── VideoCallMessage
└── Video

Course (extends BaseModel)
Friendship (extends BaseModel)
```

**Files:**
- `src/models/BaseModel.js` (base class)
- `src/models/User.js` (3-level inheritance)
- `src/models/Post.js` (inheritance)
- `src/models/Message.js` (inheritance)

---

### 3. **Polymorphism (Polimorfisme)**
- **Method overriding** - child classes override parent methods
- **Different behavior** for same method name

**Example:**
```javascript
class User {
  getUserType() {
    return 'Regular User';
  }
}

class DeafUser extends User {
  getUserType() {  // Override
    return 'Deaf Community Member';
  }
}

class InstructorUser extends User {
  getUserType() {  // Override
    return 'Sign Language Instructor';
  }
  
  getDisplayName() {  // Override
    return `${super.getDisplayName()} (Instructor)`;
  }
}

// Usage demonstrates polymorphism
const user1 = new User();
const user2 = new DeafUser();
const user3 = new InstructorUser();

console.log(user1.getUserType());  // "Regular User"
console.log(user2.getUserType());  // "Deaf Community Member"
console.log(user3.getUserType());  // "Sign Language Instructor"
```

**Files:**
- `src/models/User.js` (getUserType, getDisplayName)
- `src/models/Post.js` (getEngagementScore)
- `src/models/Video.js` (toJSON)

---

### 4. **Abstraction (Abstraksi)**
- **Abstract base class** that cannot be instantiated
- **Abstract methods** that must be implemented by children
- **Interface-like behavior**

**Example:**
```javascript
class BaseModel {
  constructor(id) {
    if (this.constructor === BaseModel) {
      throw new Error("Cannot instantiate abstract class");
    }
  }
  
  // Abstract methods - must be implemented
  validate() {
    throw new Error("validate() must be implemented");
  }
  
  toJSON() {
    throw new Error("toJSON() must be implemented");
  }
}
```

**Files:**
- `src/models/BaseModel.js`

---

### 5. **Composition (Komposisi)**
- Objects contain other objects
- "Has-a" relationship

**Example:**
```javascript
class Post {
  #author;  // User object (composition)
  
  constructor(data) {
    this.#author = data.author;  // Post HAS-A User
  }
}

class Course {
  #instructor;  // InstructorUser object
  #videos;      // Array of Video objects
  
  addVideo(video) {
    if (!(video instanceof Video)) {
      throw new Error("Must be a Video instance");
    }
    this.#videos.push(video);
  }
}
```

**Files:**
- `src/models/Post.js` (Post has User)
- `src/models/Message.js` (Message has sender and receiver)
- `src/models/Video.js` (Course has Videos and Instructor)

---

### 6. **Association (Asosiasi)**
- Objects know about and interact with other objects
- Looser relationship than composition

**Example:**
```javascript
class Friendship {
  #user1;  // User object
  #user2;  // User object
  #status;
  
  isFriendWith(user) {
    return (this.#user1.id === user.id || 
            this.#user2.id === user.id) && 
           this.#status === 'accepted';
  }
}
```

**Files:**
- `src/models/Friendship.js`

---

## 🏗️ Design Patterns Implemented

### 1. **Singleton Pattern**
- Only one instance of service classes
- Global point of access

**Example:**
```javascript
class UserService {
  static #instance = null;
  
  constructor() {
    if (UserService.#instance) {
      return UserService.#instance;
    }
    UserService.#instance = this;
  }
  
  static getInstance() {
    if (!UserService.#instance) {
      UserService.#instance = new UserService();
    }
    return UserService.#instance;
  }
}

// Usage
const service1 = UserService.getInstance();
const service2 = UserService.getInstance();
console.log(service1 === service2);  // true
```

**Services (all Singleton):**
- `UserService`
- `PostService`
- `MessageService`
- `VideoService`
- `FriendshipService`

**Files:**
- `src/services/Services.js`

---

### 2. **Factory Pattern**
- Creates objects without specifying exact class
- Centralized object creation logic

**Example:**
```javascript
class PostService {
  createPost(postData, postType = 'regular') {
    let post;
    switch (postType) {
      case 'video':
        post = new VideoPost(postData);
        break;
      default:
        post = new Post(postData);
    }
    return post;
  }
}

class UserService {
  createUser(userData, userType = 'regular') {
    let user;
    switch (userType) {
      case 'deaf':
        user = new DeafUser(userData);
        break;
      case 'instructor':
        user = new InstructorUser(userData);
        break;
      default:
        user = new User(userData);
    }
    return user;
  }
}
```

**Files:**
- `src/services/Services.js`

---

## 📁 Project Structure

```
src/
├── models/              # OOP Model Classes
│   ├── BaseModel.js     # Abstract base class
│   ├── User.js          # User, DeafUser, InstructorUser
│   ├── Post.js          # Post, VideoPost
│   ├── Message.js       # Message, VideoCallMessage
│   ├── Video.js         # Video, Course
│   └── Friendship.js    # Friendship
│
├── services/            # Service Layer (Singleton + Factory)
│   └── Services.js      # All service classes
│
└── components/          # React Components (using OOP models)
    ├── Feed.jsx         # Uses PostService, UserService
    ├── Chat.jsx
    ├── LearnSignLanguage.jsx
    ├── Profile.jsx
    └── FriendList.jsx
```

---

## 🎓 Class Diagram

```
┌─────────────┐
│  BaseModel  │ (Abstract)
└──────┬──────┘
       │
       ├───────────┬───────────┬───────────┬─────────────┐
       │           │           │           │             │
   ┌───▼───┐  ┌───▼───┐  ┌────▼────┐ ┌───▼────┐  ┌─────▼─────┐
   │  User │  │  Post │  │ Message │ │ Video  │  │ Friendship│
   └───┬───┘  └───┬───┘  └────┬────┘ └────────┘  └───────────┘
       │          │           │
   ┌───┴────┬─────┴─────┬────┴────────┐
   │        │           │             │
┌──▼──┐ ┌──▼──┐    ┌───▼────┐   ┌───▼──────┐
│Deaf │ │Inst-│    │Video   │   │VideoCall │
│User │ │ructor    │Post    │   │Message   │
└─────┘ └─────┘    └────────┘   └──────────┘
```

---

## 💻 Usage Examples

### Creating Users with Inheritance
```javascript
const userService = UserService.getInstance();

// Regular user
const user1 = userService.createUser({
  name: 'John Doe',
  username: '@john',
  email: 'john@example.com'
}, 'regular');

// Deaf user (specialized)
const user2 = userService.createUser({
  name: 'Sarah',
  username: '@sarah',
  email: 'sarah@example.com',
  preferredSignLanguage: 'ASL'
}, 'deaf');

// Instructor user (specialized)
const user3 = userService.createUser({
  name: 'Mike',
  username: '@mike',
  email: 'mike@example.com',
  yearsOfExperience: 10
}, 'instructor');

console.log(user1.getUserType());  // "Regular User"
console.log(user2.getUserType());  // "Deaf Community Member"
console.log(user3.getUserType());  // "Sign Language Instructor"
```

### Working with Posts
```javascript
const postService = PostService.getInstance();

// Create regular post
const post1 = postService.createPost({
  author: user1,
  content: 'Hello community!'
});

// Create video post (polymorphism)
const post2 = postService.createPost({
  author: user2,
  content: 'Check out my tutorial',
  videoUrl: 'https://example.com/video.mp4',
  duration: 180
}, 'video');

// Like a post (encapsulation)
postService.likePost(post1.id);

// Get engagement score (different for regular vs video posts)
console.log(post1.getEngagementScore());
console.log(post2.getEngagementScore());  // Includes views
```

### Managing Friendships
```javascript
const friendshipService = FriendshipService.getInstance();

// Create friend request
const friendship = friendshipService.createFriendRequest(user1, user2);

// Accept request
friendshipService.acceptFriendRequest(friendship.id);

// Check if friends
const areFriends = friendshipService.areFriends(user1.id, user2.id);
```

---

## ✅ OOP Principles Checklist

- [x] **Encapsulation**: Private fields with getters/setters
- [x] **Inheritance**: 3-level inheritance hierarchy (BaseModel → User → DeafUser)
- [x] **Polymorphism**: Method overriding in child classes
- [x] **Abstraction**: Abstract BaseModel class with abstract methods
- [x] **Composition**: Objects containing other objects
- [x] **Association**: Object relationships
- [x] **Singleton Pattern**: Service layer
- [x] **Factory Pattern**: Object creation
- [x] **Validation**: Built-in data validation
- [x] **Error Handling**: Proper exception throwing

---

## 🎯 Learning Outcomes

This implementation demonstrates:

1. **Class Design** - Proper class hierarchy and relationships
2. **Data Hiding** - Private fields and controlled access
3. **Code Reusability** - Inheritance and composition
4. **Flexibility** - Polymorphism allows different behaviors
5. **Maintainability** - Service layer separates concerns
6. **Scalability** - Easy to add new user types, post types, etc.
7. **Best Practices** - Follows OOP principles and design patterns

---

## 📚 References

- All model classes in `/src/models/`
- All service classes in `/src/services/`
- Component integration in `/src/components/Feed.jsx`

---

**Author**: Tugas Akhir PBO - Sign to Talk
**Date**: December 2025
