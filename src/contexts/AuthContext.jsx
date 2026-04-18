import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectedPlatforms, setConnectedPlatforms] = useState(() => {
    const saved = localStorage.getItem('gs_connected');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gs_connected', JSON.stringify(connectedPlatforms));
  }, [connectedPlatforms]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Wrap Firestore fetch in a timeout or localized try-catch
          let userData = {};
          try {
            // Use a promise with timeout for the Firestore fetch
            const fetchProfile = async () => {
              const userRef = doc(db, 'users', firebaseUser.uid);
              const userSnap = await getDoc(userRef);
              
              if (!userSnap.exists()) {
                const newProfile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  plan: 'free',
                  location: '',
                  language: 'en',
                  instagramConnected: false,
                  telegramChatId: '',
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                };
                await setDoc(userRef, newProfile);
                return newProfile;
              }
              return userSnap.data();
            };

            // 5 second timeout for profile fetch
            userData = await Promise.race([
              fetchProfile(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 5000))
            ]);
          } catch (profileError) {
            console.warn('Could not fetch/create Firestore profile, proceeding with basic auth:', profileError);
            // Non-blocking fallback: use basic firebase auth info
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...userData,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Critical auth state error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    connectedPlatforms,
    setConnectedPlatforms,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
