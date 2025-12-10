import BaseModel from './BaseModel.js';

/**
 * Video - Sign language tutorial video class
 * Demonstrates: Encapsulation, Composition
 */
class Video extends BaseModel {
  #title;
  #description;
  #thumbnail;
  #duration;
  #instructor;
  #category;
  #difficulty;
  #views;
  #likes;

  constructor(data = {}) {
    super(data.id);
    this.#title = data.title || '';
    this.#description = data.description || '';
    this.#thumbnail = data.thumbnail || '';
    this.#duration = data.duration || 0;
    this.#instructor = data.instructor; // InstructorUser object
    this.#category = data.category || '';
    this.#difficulty = data.difficulty || 'beginner'; // beginner, intermediate, advanced
    this.#views = data.views || 0;
    this.#likes = data.likes || 0;
  }

  // Getters
  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get thumbnail() {
    return this.#thumbnail;
  }

  get duration() {
    return this.#duration;
  }

  get instructor() {
    return this.#instructor;
  }

  get category() {
    return this.#category;
  }

  get difficulty() {
    return this.#difficulty;
  }

  get views() {
    return this.#views;
  }

  get likes() {
    return this.#likes;
  }

  // Setters
  set title(value) {
    if (!value || value.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }
    this.#title = value;
    this.touch();
  }

  set description(value) {
    this.#description = value;
    this.touch();
  }

  set category(value) {
    this.#category = value;
    this.touch();
  }

  set difficulty(value) {
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(value)) {
      throw new Error("Invalid difficulty level");
    }
    this.#difficulty = value;
    this.touch();
  }

  // Methods
  addView() {
    this.#views++;
    this.touch();
  }

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

  getFormattedDuration() {
    const mins = Math.floor(this.#duration / 60);
    const secs = this.#duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getPopularityScore() {
    return (this.#views * 0.5) + (this.#likes * 2);
  }

  getDifficultyLevel() {
    const levels = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    return levels[this.#difficulty];
  }

  validate() {
    return this.#title && this.#category && this.#duration > 0;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.#title,
      description: this.#description,
      thumbnail: this.#thumbnail,
      duration: this.#duration,
      formattedDuration: this.getFormattedDuration(),
      instructor: this.#instructor?.toJSON() || null,
      category: this.#category,
      difficulty: this.#difficulty,
      views: this.#views,
      likes: this.#likes,
      popularityScore: this.getPopularityScore(),
      createdAt: this.createdAt
    };
  }
}

/**
 * Course - Collection of videos
 * Demonstrates: Composition, Aggregation
 */
class Course extends BaseModel {
  #title;
  #description;
  #instructor;
  #videos;
  #enrolledStudents;
  #category;

  constructor(data = {}) {
    super(data.id);
    this.#title = data.title || '';
    this.#description = data.description || '';
    this.#instructor = data.instructor; // InstructorUser object
    this.#videos = data.videos || []; // Array of Video objects
    this.#enrolledStudents = data.enrolledStudents || [];
    this.#category = data.category || '';
  }

  // Getters
  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get instructor() {
    return this.#instructor;
  }

  get videos() {
    return [...this.#videos];
  }

  get enrolledStudents() {
    return this.#enrolledStudents.length;
  }

  get category() {
    return this.#category;
  }

  // Methods
  addVideo(video) {
    if (!(video instanceof Video)) {
      throw new Error("Must be a Video instance");
    }
    this.#videos.push(video);
    this.touch();
  }

  removeVideo(videoId) {
    this.#videos = this.#videos.filter(v => v.id !== videoId);
    this.touch();
  }

  enrollStudent(student) {
    if (!this.#enrolledStudents.includes(student.id)) {
      this.#enrolledStudents.push(student.id);
      this.touch();
    }
  }

  getTotalDuration() {
    return this.#videos.reduce((total, video) => total + video.duration, 0);
  }

  getFormattedTotalDuration() {
    const total = this.getTotalDuration();
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    return `${hours}h ${mins}m`;
  }

  getVideoCount() {
    return this.#videos.length;
  }

  getAverageDifficulty() {
    if (this.#videos.length === 0) return 0;
    const total = this.#videos.reduce((sum, video) => sum + video.getDifficultyLevel(), 0);
    return total / this.#videos.length;
  }

  validate() {
    return this.#title && this.#instructor && this.#videos.length > 0;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.#title,
      description: this.#description,
      instructor: this.#instructor?.toJSON() || null,
      videos: this.#videos.map(v => v.toJSON()),
      videoCount: this.getVideoCount(),
      totalDuration: this.getTotalDuration(),
      formattedTotalDuration: this.getFormattedTotalDuration(),
      enrolledStudents: this.#enrolledStudents,
      category: this.#category,
      averageDifficulty: this.getAverageDifficulty(),
      createdAt: this.createdAt
    };
  }
}

export { Video, Course };
export default Video;
