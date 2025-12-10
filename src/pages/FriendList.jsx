import React, { useState } from 'react';
import { Services } from '../api/services';
import Avatar from '../components/common/Avatar';
import { Search } from 'lucide-react';

const FriendList = ({ users, currentUser, onViewProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleFollow = async (e, targetUser) => {
      e.stopPropagation(); 
      const isFollowing = (currentUser.following || []).includes(targetUser.id);
      await Services.toggleFollow(currentUser.id, targetUser.id, isFollowing);
  };

  const filteredUsers = users.filter(u => {
      if (u.id === currentUser.id) return false;
      const query = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(query) || 
             u.username.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-[1200px] mx-auto w-full pt-24 md:pt-4 px-4 pb-20">
      <h2 className="text-[#e7e9ea] text-3xl font-grotesk font-bold mb-6">Temukan Teman</h2>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-[#71767b]" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari teman berdasarkan nama atau username..."
          className="w-full bg-[#16181c] border border-[#2f3336] rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#1d9bf0] transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredUsers.length === 0 ? (
             <div className="col-span-full text-center py-10 text-[#71767b]">
                 <p>Tidak ditemukan pengguna dengan nama tersebut.</p>
             </div>
         ) : filteredUsers.map(u => {
            const isFollowing = (currentUser.following || []).includes(u.id);
            return (
              <div 
                key={u.id} 
                onClick={() => onViewProfile(u)}
                className="bg-[#0a0a0a] border border-[#2f3336] rounded-2xl p-5 flex flex-col hover:bg-[#16181c]/50 transition shadow-sm animate-fade-in-up cursor-pointer group"
              >
                  <div className="flex justify-between items-start mb-4">
                      <Avatar src={u.avatar} size="lg" />
                      <button 
                          onClick={(e) => handleFollow(e, u)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold transition border z-10 ${
                             isFollowing 
                             ? 'bg-transparent text-[#e7e9ea] border-[#536471] hover:text-red-500 hover:border-red-500 hover:bg-red-500/10' 
                             : 'bg-[#e7e9ea] text-black border-[#e7e9ea] hover:bg-[#d7dbdc]'
                          }`}
                      >
                          {isFollowing ? 'Mengikuti' : 'Ikuti'}
                      </button>
                  </div>
                  <h3 className="text-[#e7e9ea] text-lg font-bold group-hover:underline">{u.name}</h3>
                  <p className="text-[#71767b] text-sm mb-3">{u.username}</p>
                  <p className="text-[#e7e9ea] text-sm mb-4 line-clamp-2">{u.bio || "Tidak ada bio."}</p>
                  <div className="mt-auto flex items-center gap-4 text-[#71767b] text-xs">
                    <span>{u.followers?.length || 0} Pengikut</span>
                  </div>
              </div>
            )
         })}
      </div>
    </div>
  );
};

export default FriendList;