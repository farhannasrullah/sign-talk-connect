import React, { useState, useEffect } from 'react';
import { Services } from '../api/services';
import { COLLECTIONS, Post, Comment } from '../models';
import Avatar from '../components/common/Avatar';
import { where } from 'firebase/firestore';
import { AlertCircle, ImageIcon, Heart, MessageSquare, Share2, Send } from 'lucide-react';

const Feed = ({ currentUser, onViewProfile, users }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  useEffect(() => Services.subscribeCollection(COLLECTIONS.POSTS, setPosts, Post), []);

  const handlePost = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) return;
    try {
      const newPost = new Post({
        authorId: currentUser.id,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
          userType: currentUser.userType
        },
        content
      });
      await Services.save(COLLECTIONS.POSTS, newPost);
      setContent('');
    } catch (err) {
      setError(err.message);
    }
  };

  const CommentSection = ({ postId }) => {
     const [comments, setComments] = useState([]);
     const [commentText, setCommentText] = useState('');

     useEffect(() => {
       const qConstraints = [where('postId', '==', postId)];
       const unsub = Services.subscribeCollection(COLLECTIONS.COMMENTS, setComments, Comment, qConstraints);
       return () => unsub();
     }, [postId]);

     const handleSendComment = async (e) => {
       e.preventDefault();
       if(!commentText.trim()) return;
       const newComment = new Comment({
           postId,
           authorId: currentUser.id,
           authorName: currentUser.name,
           authorAvatar: currentUser.avatar,
           text: commentText
       });
       await Services.save(COLLECTIONS.COMMENTS, newComment);
       const post = posts.find(p => p.id === postId);
       if(post) await Services.update(COLLECTIONS.POSTS, postId, { commentsCount: (post.commentsCount || 0) + 1 });
       setCommentText('');
     };

     return (
        <div className="mt-4 pl-4 border-l-2 border-[#2f3336] animate-fade-in-up">
           <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {comments.map(c => {
                  const commentAuthor = users.find(u => u.id === c.authorId) || {
                      name: c.authorName,
                      avatar: c.authorAvatar
                  };
                  return (
                    <div key={c.id} className="flex gap-2">
                        <div onClick={() => onViewProfile({id: c.authorId})} className="cursor-pointer">
                            <Avatar src={commentAuthor.avatar} size="sm" />
                        </div>
                        <div className="bg-[#16181c] p-2 rounded-2xl rounded-tl-none px-3">
                            <p onClick={() => onViewProfile({id: c.authorId})} className="text-xs font-bold text-[#e7e9ea] cursor-pointer hover:underline">{commentAuthor.name}</p>
                            <p className="text-sm text-[#e7e9ea]">{c.text}</p>
                        </div>
                    </div>
                  );
              })}
           </div>
           <form onSubmit={handleSendComment} className="flex gap-2">
               <input 
                 value={commentText} 
                 onChange={e => setCommentText(e.target.value)}
                 placeholder="Tulis balasan..."
                 className="flex-1 bg-transparent border-b border-[#2f3336] focus:border-[#1d9bf0] outline-none text-sm text-[#e7e9ea] py-1"
               />
               <button type="submit" className="text-[#1d9bf0] disabled:opacity-50" disabled={!commentText.trim()}><Send size={16}/></button>
           </form>
        </div>
     )
  };

  return (
    <div className="max-w-[600px] mx-auto w-full px-4 pb-24 pt-24 md:pt-4">
      <h2 className="text-[#e7e9ea] text-3xl font-grotesk font-bold mb-6 tracking-tight sticky top-0 bg-black/80 backdrop-blur z-40 py-2">Beranda</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      {/* Create Post */}
      <form onSubmit={handlePost} className="bg-[#0a0a0a] border border-[#2f3336] rounded-2xl p-4 mb-6 shadow-sm focus-within:border-[#1d9bf0] transition-colors">
        <div className="flex gap-3">
            <div onClick={() => onViewProfile(currentUser)} className="cursor-pointer">
                <Avatar src={currentUser.avatar} size="md" />
            </div>
            <div className="flex-1">
                <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Apa yang sedang terjadi, ${currentUser.name}?`}
                className="w-full bg-transparent text-[#e7e9ea] text-lg placeholder-[#71767b] outline-none resize-none min-h-[80px]"
                />
                <div className="flex justify-between items-center mt-2 border-t border-[#2f3336] pt-3">
                    <div className="flex gap-2 text-[#1d9bf0]">
                        <ImageIcon size={20} className="cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full p-1 w-8 h-8" />
                    </div>
                    <button type="submit" disabled={!content.trim()} className="px-5 py-1.5 bg-[#1d9bf0] text-white rounded-full font-bold hover:bg-[#1a8cd8] transition disabled:opacity-50 disabled:cursor-not-allowed">
                        Post
                    </button>
                </div>
            </div>
        </div>
      </form>

      {/* Posts List */}
      <div className="flex flex-col gap-4">
        {posts.map(post => {
            const authorData = users.find(u => u.id === post.authorId) || post.author;
            
            return (
              <div key={post.id} className="bg-[#0a0a0a] border border-[#2f3336] p-4 rounded-2xl hover:bg-[#16181c]/30 transition duration-200 animate-fade-in-up">
                <div className="flex gap-3">
                  <div onClick={() => onViewProfile(authorData)} className="cursor-pointer">
                      <Avatar src={authorData?.avatar} size="md" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 onClick={() => onViewProfile(authorData)} className="text-[#e7e9ea] font-bold text-[0.95rem] hover:underline cursor-pointer">{authorData?.name}</h3>
                        <span onClick={() => onViewProfile(authorData)} className="text-[#71767b] text-sm cursor-pointer">{authorData?.username}</span>
                        <span className="text-[#71767b] text-sm">· {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-[#e7e9ea] leading-relaxed mt-1 text-[0.95rem] whitespace-pre-wrap">{post.content}</p>
                    
                    {/* Actions */}
                    <div className="flex gap-8 mt-3 text-[#71767b] text-sm">
                      <button 
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className={`flex items-center gap-2 hover:text-[#1d9bf0] transition group ${activeCommentPostId === post.id ? 'text-[#1d9bf0]' : ''}`}
                      >
                        <MessageSquare size={18} className="group-hover:bg-[#1d9bf0]/10 rounded-full p-0.5 box-content" />
                        <span>{post.commentsCount || 0}</span>
                      </button>
                      <button 
                        onClick={async () => { 
                            await Services.update(COLLECTIONS.POSTS, post.id, { likes: (post.likes || 0) + 1 }); 
                        }} 
                        className="flex items-center gap-2 hover:text-pink-500 transition group"
                      >
                        <Heart size={18} className="group-hover:bg-pink-500/10 rounded-full p-0.5 box-content" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-green-500 transition group">
                        <Share2 size={18} className="group-hover:bg-green-500/10 rounded-full p-0.5 box-content" />
                      </button>
                    </div>

                    {/* Comments Section */}
                    {activeCommentPostId === post.id && <CommentSection postId={post.id} />}
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Feed;