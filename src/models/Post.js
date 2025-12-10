import BaseModel from './BaseModel.js';

/**
 * Post - Social media post class
 * Demonstrates: Encapsulation, Composition
 */
class Post extends BaseModel {
  #author;
  #content;
  #likes;
  #comments;
  #shares;
  #isPublic;

  constructor(data = {}) {
    super(data.id);
    this.#author = data.author; // User object
    this.#content = data.content || '';
    this.#likes = data.likes || 0;
    this.#comments = data.comments || 0;
    this.#shares = data.shares || 0;
    this.#isPublic = data.isPublic !== undefined ? data.isPublic : true;
  }

  // Getters
  get author() {
    return this.#author;
  }

  get content() {
    return this.#content;
  }

  get likes() {
    return this.#likes;
  }

  get comments() {
    return this.#comments;
  }

  get shares() {
    return this.#shares;
  }

  get isPublic() {
    return this.#isPublic;
  }

  // Setters
  set content(value) {
    if (!value || value.trim().length === 0) {
      throw new Error("Post content cannot be empty");
    }
    if (value.length > 500) {
      throw new Error("Post content too long (max 500 characters)");
    }
    this.#content = value;
    this.touch();
  }

  set isPublic(value) {
    this.#isPublic = value;
    this.touch();
  }

  // Methods
  like() {
    this.#likes++;
    this.touch();
  }

  unlike() {
    if (this.#likes > 0) {
      this.#likes--;
      this.touch();
    }
  }

  addComment() {
    this.#comments++;
    this.touch();
  }

  share() {
    this.#shares++;
    this.touch();
  }

  getEngagementScore() {
    return (this.#likes * 1) + (this.#comments * 2) + (this.#shares * 3);
  }

  getFormattedTime() {
    const now = new Date();
    const diff = now - this.createdAt;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  validate() {
    return this.#author && this.#content && this.#content.length > 0;
  }

  toJSON() {
    return {
      id: this.id,
      author: this.#author?.toJSON() || null,
      content: this.#content,
      likes: this.#likes,
      comments: this.#comments,
      shares: this.#shares,
      isPublic: this.#isPublic,
      engagementScore: this.getEngagementScore(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * VideoPost - Specialized post with video content
 * Demonstrates: Inheritance, Polymorphism
 */
class VideoPost extends Post {
  #videoUrl;
  #thumbnail;
  #duration;
  #views;

  constructor(data = {}) {
    super(data);
    this.#videoUrl = data.videoUrl || '';
    this.#thumbnail = data.thumbnail || '';
    this.#duration = data.duration || 0;
    this.#views = data.views || 0;
  }

  get videoUrl() {
    return this.#videoUrl;
  }

  get thumbnail() {
    return this.#thumbnail;
  }

  get duration() {
    return this.#duration;
  }

  get views() {
    return this.#views;
  }

  addView() {
    this.#views++;
    this.touch();
  }

  getFormattedDuration() {
    const mins = Math.floor(this.#duration / 60);
    const secs = this.#duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Override engagement score to include views
  getEngagementScore() {
    return super.getEngagementScore() + (this.#views * 0.5);
  }

  validate() {
    return super.validate() && this.#videoUrl;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      videoUrl: this.#videoUrl,
      thumbnail: this.#thumbnail,
      duration: this.#duration,
      views: this.#views,
      type: 'video'
    };
  }
}

export { Post, VideoPost };
export default Post;
