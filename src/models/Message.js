import BaseModel from './BaseModel.js';

/**
 * Message - Chat message class
 * Demonstrates: Encapsulation, Polymorphism
 */
class Message extends BaseModel {
  #sender;
  #receiver;
  #content;
  #isRead;
  #type;

  constructor(data = {}) {
    super(data.id);
    this.#sender = data.sender; // User object
    this.#receiver = data.receiver; // User object
    this.#content = data.content || '';
    this.#isRead = data.isRead || false;
    this.#type = data.type || 'text'; // text, video, image
  }

  // Getters
  get sender() {
    return this.#sender;
  }

  get receiver() {
    return this.#receiver;
  }

  get content() {
    return this.#content;
  }

  get isRead() {
    return this.#isRead;
  }

  get type() {
    return this.#type;
  }

  // Methods
  markAsRead() {
    this.#isRead = true;
    this.touch();
  }

  isSentBy(user) {
    return this.#sender?.id === user?.id;
  }

  getFormattedTime() {
    return this.createdAt.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  validate() {
    return this.#sender && this.#receiver && this.#content;
  }

  toJSON() {
    return {
      id: this.id,
      sender: this.#sender?.toJSON() || null,
      receiver: this.#receiver?.toJSON() || null,
      content: this.#content,
      isRead: this.#isRead,
      type: this.#type,
      createdAt: this.createdAt,
      time: this.getFormattedTime()
    };
  }
}

/**
 * VideoCallMessage - Specialized message for video calls
 * Demonstrates: Inheritance, Polymorphism
 */
class VideoCallMessage extends Message {
  #duration;
  #callStatus;

  constructor(data = {}) {
    super({ ...data, type: 'video-call' });
    this.#duration = data.duration || 0;
    this.#callStatus = data.callStatus || 'missed'; // missed, completed, declined
  }

  get duration() {
    return this.#duration;
  }

  get callStatus() {
    return this.#callStatus;
  }

  setDuration(seconds) {
    this.#duration = seconds;
    this.touch();
  }

  setCallStatus(status) {
    this.#callStatus = status;
    this.touch();
  }

  getFormattedDuration() {
    const mins = Math.floor(this.#duration / 60);
    const secs = this.#duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      duration: this.#duration,
      callStatus: this.#callStatus,
      formattedDuration: this.getFormattedDuration()
    };
  }
}

export { Message, VideoCallMessage };
export default Message;
