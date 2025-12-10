import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithCustomToken, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// --- API & MODELS ---
import { auth } from './api/firebase';
import { Services } from './api/services';
import { User, COLLECTIONS } from './models';

// --- COMPONENTS ---
import Sidebar from './components/layout/Sidebar';
import SplashScreen from './components/common/SplashScreen';

// --- PAGES ---
import AuthPage from './pages/AuthPage';
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import LiveConnect from './pages/LiveConnect';
import Profile from './pages/Profile';
import FriendList from './pages/FriendList';
import Learn from './pages/Learn';

// --- MAIN APP ---
export default function App() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('feed');
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true); // Kontrol visual Splash Screen
  
  // Data Global
  const [users, setUsers] = useState([]);
  
  // State Navigasi Khusus
  const [viewingProfile, setViewingProfile] = useState(null); 
  const [previousTab, setPreviousTab] = useState('feed'); 
  const [chatTargetUser, setChatTargetUser] = useState(null); 

  // --- 1. AUTH & USER LISTENER ---
  useEffect(() => {
    if (!auth) {
        console.warn("Auth not initialized. Cek firebase.js");
        setAuthLoading(false);
        return;
    }

    // Handle token eksternal (opsional, jarang dipakai di dev lokal)
    const initAuth = async () => {
        if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
           try { await signInWithCustomToken(auth, window.__initial_auth_token); } catch(e) { console.error(e); }
        }
    };
    initAuth();

    // Listener Status Login
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
       if(u) {
         // Jika user login, listen data profil mereka secara real-time
         const userDocRef = doc(Services.getColRef(COLLECTIONS.USERS), u.uid);
         onSnapshot(userDocRef, (docSnap) => {
             if (docSnap.exists()) {
                 setCurrentUser(new User({...docSnap.data(), id: docSnap.id}));
             } else {
                 // Jika user baru login pertama kali & belum ada di DB, buat doc baru
                 const newUser = new User({ 
                    id: u.uid, 
                    name: u.displayName || 'User', 
                    username: + (u.displayName || 'user').toLowerCase().replace(/\s/g,''),
                    email: u.email,
                    isOnline: true 
                 });
                 Services.save(COLLECTIONS.USERS, newUser);
             }
             // Auth selesai dicek (bisa jadi user ada, atau user null)
             setAuthLoading(false);
         });
       } else {
         setCurrentUser(null);
         setAuthLoading(false);
       }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. GLOBAL USERS LISTENER ---
  // Mengambil daftar semua user untuk keperluan Search & Metadata Feed
  useEffect(() => {
      const unsubUsers = Services.subscribeCollection(COLLECTIONS.USERS, setUsers, User);
      return () => unsubUsers && unsubUsers();
  }, []); 

  // --- 3. SPLASH SCREEN LOGIC ---
  useEffect(() => {
    // Ketika Firebase selesai loading (!authLoading),
    // Kita tunggu sebentar agar animasi exit splash screen berjalan mulus (2 detik total)
    if (!authLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // --- HANDLERS ---

  const handleLogout = async () => {
      if (auth) await signOut(auth);
      setCurrentUser(null);
      // Reset state saat logout
      setActiveTab('feed');
      setViewingProfile(null);
  };

  const handleViewProfile = (userToView) => {
      if (!userToView) return;
      if (activeTab !== 'profile') {
          setPreviousTab(activeTab);
      }
      setViewingProfile(userToView);
      setActiveTab('profile');
      window.scrollTo(0, 0);
  };

  const handleBackFromProfile = () => {
      setViewingProfile(null);
      setActiveTab(previousTab);
  };

  const handleMessageFromProfile = (userToMessage) => {
      setChatTargetUser(userToMessage);
      setActiveTab('chat');
  };

  const handleTabChange = (tabId) => {
      setActiveTab(tabId);
      if (tabId === 'profile') {
          setViewingProfile(null); // Reset ke profil sendiri jika klik tab Profile
      }
  };

  // --- RENDER ---

  // 1. Tampilkan Splash Screen (Prioritas Utama)
  // finishLoading dikirim true jika authLoading sudah false
  if (showSplash) {
      return <SplashScreen finishLoading={!authLoading} />;
  }

  // 2. Tampilkan Halaman Login jika belum masuk
  if (!currentUser) {
      return <AuthPage />;
  }

  // 3. Tampilkan Aplikasi Utama
  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] font-grotesk selection:bg-[#1d9bf0]/30 custom-scrollbar">
       {/* Meta Viewport untuk Mobile */}
       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
       
       {/* Sidebar Navigasi */}
       <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} onLogout={handleLogout} />
       
       {/* Area Konten Utama */}
       <main className="pb-20 md:pb-0">
         
         {activeTab === 'feed' && (
            <Feed 
                currentUser={currentUser} 
                onViewProfile={handleViewProfile} 
                users={users} 
            />
         )}
         
         {activeTab === 'chat' && (
             <Chat 
               currentUser={currentUser} 
               onViewProfile={handleViewProfile} 
               initialSelectedUser={chatTargetUser}
               users={users}
             />
         )}
         
         {activeTab === 'live' && (
            <LiveConnect currentUser={currentUser} />
         )} 
         
         {activeTab === 'profile' && (
            <Profile 
              user={viewingProfile || currentUser} 
              currentUser={currentUser} 
              isOwnProfile={!viewingProfile || viewingProfile.id === currentUser.id} 
              onBack={handleBackFromProfile}
              onMessage={handleMessageFromProfile}
            />
         )}
         
         {activeTab === 'friends' && (
            <FriendList 
                users={users} 
                currentUser={currentUser} 
                onViewProfile={handleViewProfile} 
            />
         )}
         
         {activeTab === 'learn' && (
            <Learn />
         )}
       </main>
    </div>
  );
}