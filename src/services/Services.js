import { User, DeafUser, InstructorUser } from '../models/User.js';
import Post, { VideoPost } from '../models/Post.js';
import Message, { VideoCallMessage } from '../models/Message.js';
import Video, { Course } from '../models/Video.js';
import Friendship from '../models/Friendship.js';

/**
 * UserService - Singleton service for user management
 * Demonstrates: Singleton Pattern, Encapsulation
 */
class UserService {
  static #instance = null;
  #users;
  #currentUser;

  constructor() {
    if (UserService.#instance) {
      return UserService.#instance;
    }
    this.#users = new Map();
    this.#currentUser = null;
    UserService.#instance = this;
  }

  static getInstance() {
    if (!UserService.#instance) {
      UserService.#instance = new UserService();
    }
    return UserService.#instance;
  }

  // User Management
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
    
    if (user.validate()) {
      this.#users.set(user.id, user);
      return user;
    }
    throw new Error("Invalid user data");
  }

  getUser(userId) {
    return this.#users.get(userId);
  }

  getAllUsers() {
    return Array.from(this.#users.values());
  }

  updateUser(userId, updates) {
    const user = this.#users.get(userId);
    if (!user) throw new Error("User not found");
    
    Object.keys(updates).forEach(key => {
      if (user[key] !== undefined) {
        user[key] = updates[key];
      }
    });
    
    return user;
  }

  deleteUser(userId) {
    return this.#users.delete(userId);
  }

  setCurrentUser(user) {
    this.#currentUser = user;
  }

  getCurrentUser() {
    return this.#currentUser;
  }

  searchUsers(query) {
    return this.getAllUsers().filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    );
  }

  getOnlineUsers() {
    return this.getAllUsers().filter(user => user.isOnline);
  }
}

/**
 * PostService - Singleton service for post management
 * Demonstrates: Singleton Pattern, Factory Pattern
 */
class PostService {
  static #instance = null;
  #posts;

  constructor() {
    if (PostService.#instance) {
      return PostService.#instance;
    }
    this.#posts = new Map();
    PostService.#instance = this;
  }

  static getInstance() {
    if (!PostService.#instance) {
      PostService.#instance = new PostService();
    }
    return PostService.#instance;
  }

  // Factory Method for creating posts
  createPost(postData, postType = 'regular') {
    let post;
    switch (postType) {
      case 'video':
        post = new VideoPost(postData);
        break;
      default:
        post = new Post(postData);
    }
    
    if (post.validate()) {
      this.#posts.set(post.id, post);
      return post;
    }
    throw new Error("Invalid post data");
  }

  getPost(postId) {
    return this.#posts.get(postId);
  }

  getAllPosts() {
    return Array.from(this.#posts.values());
  }

  getPostsByUser(userId) {
    return this.getAllPosts().filter(post => post.author?.id === userId);
  }

  deletePost(postId) {
    return this.#posts.delete(postId);
  }

  likePost(postId) {
    const post = this.#posts.get(postId);
    if (post) {
      post.like();
      return post;
    }
    throw new Error("Post not found");
  }

  unlikePost(postId) {
    const post = this.#posts.get(postId);
    if (post) {
      post.unlike();
      return post;
    }
    throw new Error("Post not found");
  }

  getTopPosts(limit = 10) {
    return this.getAllPosts()
      .sort((a, b) => b.getEngagementScore() - a.getEngagementScore())
      .slice(0, limit);
  }
}

/**
 * MessageService - Singleton service for message management
 * Demonstrates: Singleton Pattern, Observer Pattern concepts
 */
class MessageService {
  static #instance = null;
  #messages;
  #conversations;

  constructor() {
    if (MessageService.#instance) {
      return MessageService.#instance;
    }
    this.#messages = new Map();
    this.#conversations = new Map();
    MessageService.#instance = this;
  }

  static getInstance() {
    if (!MessageService.#instance) {
      MessageService.#instance = new MessageService();
    }
    return MessageService.#instance;
  }

  sendMessage(messageData, messageType = 'text') {
    let message;
    switch (messageType) {
      case 'video-call':
        message = new VideoCallMessage(messageData);
        break;
      default:
        message = new Message(messageData);
    }
    
    if (message.validate()) {
      this.#messages.set(message.id, message);
      this.#addToConversation(message);
      return message;
    }
    throw new Error("Invalid message data");
  }

  #addToConversation(message) {
    const key = this.#getConversationKey(message.sender.id, message.receiver.id);
    if (!this.#conversations.has(key)) {
      this.#conversations.set(key, []);
    }
    this.#conversations.get(key).push(message);
  }

  #getConversationKey(userId1, userId2) {
    return [userId1, userId2].sort().join('-');
  }

  getConversation(userId1, userId2) {
    const key = this.#getConversationKey(userId1, userId2);
    return this.#conversations.get(key) || [];
  }

  getMessage(messageId) {
    return this.#messages.get(messageId);
  }

  markAsRead(messageId) {
    const message = this.#messages.get(messageId);
    if (message) {
      message.markAsRead();
      return message;
    }
    throw new Error("Message not found");
  }

  getUnreadMessages(userId) {
    return Array.from(this.#messages.values())
      .filter(msg => msg.receiver.id === userId && !msg.isRead);
  }

  getUnreadCount(userId) {
    return this.getUnreadMessages(userId).length;
  }
}

/**
 * VideoService - Singleton service for video/course management
 * Demonstrates: Singleton Pattern, Composition
 */
class VideoService {
  static #instance = null;
  #videos;
  #courses;

  constructor() {
    if (VideoService.#instance) {
      return VideoService.#instance;
    }
    this.#videos = new Map();
    this.#courses = new Map();
    VideoService.#instance = this;
  }

  static getInstance() {
    if (!VideoService.#instance) {
      VideoService.#instance = new VideoService();
    }
    return VideoService.#instance;
  }

  // Video Management
  createVideo(videoData) {
    const video = new Video(videoData);
    if (video.validate()) {
      this.#videos.set(video.id, video);
      return video;
    }
    throw new Error("Invalid video data");
  }

  getVideo(videoId) {
    return this.#videos.get(videoId);
  }

  getAllVideos() {
    return Array.from(this.#videos.values());
  }

  getVideosByCategory(category) {
    return this.getAllVideos().filter(video => video.category === category);
  }

  getVideosByDifficulty(difficulty) {
    return this.getAllVideos().filter(video => video.difficulty === difficulty);
  }

  getPopularVideos(limit = 10) {
    return this.getAllVideos()
      .sort((a, b) => b.getPopularityScore() - a.getPopularityScore())
      .slice(0, limit);
  }

  // Course Management
  createCourse(courseData) {
    const course = new Course(courseData);
    if (course.validate()) {
      this.#courses.set(course.id, course);
      return course;
    }
    throw new Error("Invalid course data");
  }

  getCourse(courseId) {
    return this.#courses.get(courseId);
  }

  getAllCourses() {
    return Array.from(this.#courses.values());
  }

  addVideoToCourse(courseId, videoId) {
    const course = this.#courses.get(courseId);
    const video = this.#videos.get(videoId);
    
    if (!course) throw new Error("Course not found");
    if (!video) throw new Error("Video not found");
    
    course.addVideo(video);
    return course;
  }
}

/**
 * FriendshipService - Singleton service for friendship management
 * Demonstrates: Singleton Pattern
 */
class FriendshipService {
  static #instance = null;
  #friendships;

  constructor() {
    if (FriendshipService.#instance) {
      return FriendshipService.#instance;
    }
    this.#friendships = new Map();
    FriendshipService.#instance = this;
  }

  static getInstance() {
    if (!FriendshipService.#instance) {
      FriendshipService.#instance = new FriendshipService();
    }
    return FriendshipService.#instance;
  }

  createFriendRequest(user1, user2) {
    const friendship = new Friendship({ user1, user2, status: 'pending' });
    if (friendship.validate()) {
      this.#friendships.set(friendship.id, friendship);
      return friendship;
    }
    throw new Error("Invalid friendship data");
  }

  acceptFriendRequest(friendshipId) {
    const friendship = this.#friendships.get(friendshipId);
    if (friendship && friendship.accept()) {
      return friendship;
    }
    throw new Error("Cannot accept friendship");
  }

  declineFriendRequest(friendshipId) {
    const friendship = this.#friendships.get(friendshipId);
    if (friendship && friendship.decline()) {
      return friendship;
    }
    throw new Error("Cannot decline friendship");
  }

  getFriends(userId) {
    return Array.from(this.#friendships.values())
      .filter(f => 
        (f.user1.id === userId || f.user2.id === userId) && 
        f.status === 'accepted'
      );
  }

  getPendingRequests(userId) {
    return Array.from(this.#friendships.values())
      .filter(f => f.user2.id === userId && f.isPending());
  }

  areFriends(userId1, userId2) {
    return Array.from(this.#friendships.values())
      .some(f => f.isFriendWith({ id: userId1 }) && f.isFriendWith({ id: userId2 }));
  }
}

export {
  UserService,
  PostService,
  MessageService,
  VideoService,
  FriendshipService
};
