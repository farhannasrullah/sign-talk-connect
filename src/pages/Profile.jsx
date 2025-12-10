import React, { useState, useEffect } from 'react';
import { Services } from '../api/services';
import { User, COLLECTIONS } from '../models';
import Avatar from '../components/common/Avatar';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';

const Profile = ({ user, currentUser, isOwnProfile, onBack, onMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user || currentUser); 
  const [bio, setBio] = useState(profileData?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profileData?.avatar || '');

  useEffect(() => {
    if (user) {
        setProfileData(user);
        setBio(user.bio || '');
        setAvatarUrl(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
      if(!user?.id) return;
      const unsub = onSnapshot(doc(Services.getColRef(COLLECTIONS.USERS), user.id), (docSnap) => {
          if (docSnap.exists()) {
             const newData = new User({...docSnap.data(), id: docSnap.id});
             setProfileData(newData);
             if(isOwnProfile && !isEditing) {
                 setBio(newData.bio);
                 setAvatarUrl(newData.avatar);
             }
          }
      });
      return () => unsub();
  }, [user?.id, isOwnProfile, isEditing]);

  const saveProfile = async () => {
    try {
        const updatedUser = new User({ ...profileData.toJSON(), bio, avatar: avatarUrl });
        await Services.save(COLLECTIONS.USERS, updatedUser);
        setIsEditing(false);
    } catch(e) { alert(e.message); }
  };

  const handleFollow = async () => {
      const isFollowing = (currentUser.following || []).includes(profileData.id);
      await Services.toggleFollow(currentUser.id, profileData.id, isFollowing);
  };

  const isFollowed = (currentUser.following || []).includes(profileData.id);

  if (!profileData) return <div className="text-white text-center pt-20">Memuat profil...</div>;

  return (
    <div className="max-w-[800px] mx-auto w-full pt-20 md:pt-4 px-0 md:px-4 pb-20">
      <div className="bg-[#0a0a0a] md:border border-[#2f3336] md:rounded-2xl overflow-hidden pb-4 relative animate-fade-in-up">
        {/* Banner */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-[#1d9bf0] to-[#00ba7c] relative">
            {!isOwnProfile && (
                <button 
                    onClick={onBack}
                    className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white backdrop-blur-sm transition"
                >
                    <ArrowLeft size={24} />
                </button>
            )}
        </div>
        
        <div className="px-4 relative">
           <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4">
               <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-full p-1">
                  <Avatar src={profileData.avatar} size="xxl" className="border-4 border-black" />
               </div>
               
               <div className="flex gap-2">
                 {isOwnProfile ? (
                   <button 
                     onClick={() => isEditing ? saveProfile() : setIsEditing(true)} 
                     className={`px-4 py-2 rounded-full font-bold text-sm transition ${isEditing ? 'bg-[#e7e9ea] text-black hover:bg-white' : 'border border-[#536471] text-[#e7e9ea] hover:bg-white/10'}`}
                   >
                     {isEditing ? 'Simpan' : 'Edit Profil'}
                   </button>
                 ) : (
                   <>
                     <button 
                        onClick={() => onMessage(profileData)}
                        className="p-2 border border-[#536471] rounded-full hover:bg-white/10 text-[#e7e9ea]"
                     >
                        <MessageSquare size={20}/>
                     </button>
                     <button 
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition ${isFollowed ? 'border border-[#536471] text-[#e7e9ea] hover:border-red-500 hover:text-red-500 hover:bg-red-500/10' : 'bg-[#e7e9ea] text-black hover:bg-white'}`}
                     >
                        {isFollowed ? 'Mengikuti' : 'Ikuti'}
                     </button>
                   </>
                 )}
               </div>
           </div>

           <div className="mt-2">
              <h2 className="text-[#e7e9ea] text-2xl font-bold leading-tight">{profileData.name}</h2>
              <p className="text-[#71767b] text-sm">{profileData.username}</p>
           </div>

           <div className="mt-4">
              {isEditing ? (
                <div className="space-y-3 bg-[#16181c] p-4 rounded-xl border border-[#2f3336]">
                    <div>
                        <label className="text-xs text-[#71767b] uppercase font-bold block mb-1">Bio</label>
                        <textarea 
                            value={bio} 
                            onChange={e => setBio(e.target.value)} 
                            className="w-full bg-black border border-[#2f3336] rounded-lg p-3 text-[#e7e9ea] focus:border-[#1d9bf0] outline-none"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-[#71767b] uppercase font-bold block mb-1">URL Foto Profil</label>
                        <input 
                            type="text"
                            value={avatarUrl} 
                            onChange={e => setAvatarUrl(e.target.value)} 
                            className="w-full bg-black border border-[#2f3336] rounded-lg p-3 text-[#e7e9ea] focus:border-[#1d9bf0] outline-none text-sm"
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>
                </div>
              ) : (
                <p className="text-[#e7e9ea] text-[0.95rem] leading-relaxed whitespace-pre-wrap">{profileData.bio || "Belum ada bio."}</p>
              )}
           </div>

           <div className="flex gap-6 mt-4 text-[#71767b] text-sm">
               <span className="hover:underline cursor-pointer"><strong className="text-[#e7e9ea]">{profileData.following?.length || 0}</strong> Mengikuti</span>
               <span className="hover:underline cursor-pointer"><strong className="text-[#e7e9ea]">{profileData.followers?.length || 0}</strong> Pengikut</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;