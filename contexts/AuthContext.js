import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth as authApi, users as usersApi } from '../services';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();

    const { data: { subscription } } = authApi.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function loadSession() {
    try {
      const isGuestMode = await authApi.isGuestSession();
      
      if (isGuestMode) {
        const guestSession = await authApi.getGuestSession();
        if (guestSession) {
          setSession(guestSession);
          setUser(guestSession.user);
          
          const formattedProfile = {
            id: guestSession.profile.id,
            phone: guestSession.profile.phone,
            whatsapp_number: guestSession.profile.whatsappNumber,
            first_name: guestSession.profile.firstName,
            last_name: guestSession.profile.lastName,
            city_id: guestSession.profile.cityId,
            cities: { name: guestSession.profile.cityName || 'Nouakchott' },
            role: guestSession.profile.role || 'normal',
            wallet_balance_mru: guestSession.profile.walletBalance || 0,
            free_posts_remaining: guestSession.profile.freePostsRemaining || 5,
            isGuest: true,
          };
          
          setProfile(formattedProfile);
          setLoading(false);
          return;
        }
      }
      
      const session = await authApi.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(userId) {
    try {
      const userProfile = await usersApi.getUser(userId);
      setProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }

  async function sendOtp(phone) {
    try {
      setLoading(true);
      const result = await authApi.sendOtp(phone);
      return result;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(phone, token) {
    try {
      setLoading(true);
      const { user, session } = await authApi.verifyOtp(phone, token);
      setUser(user);
      setSession(session);
      
      if (user) {
        const userProfile = await loadProfile(user.id);
        return { user, session, profile: userProfile, isNewUser: !userProfile };
      }
      
      return { user, session, profile: null, isNewUser: true };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function completeRegistration(userData) {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const createData = {
        id: user.id,
        phone: user.phone,
        whatsapp_number: userData.whatsapp_number || user.phone,
        first_name: userData.first_name,
        last_name: userData.last_name,
        city_id: userData.city_id,
      };

      // Only include profile_photo_url if provided
      if (userData.profile_photo_url) {
        createData.profile_photo_url = userData.profile_photo_url;
      }

      const newProfile = await usersApi.createUser(createData);
      setProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates) {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const updatedProfile = await usersApi.updateUser(user.id, updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await authApi.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser() {
    try {
      const session = await authApi.getSession();
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        const userProfile = await loadProfile(session.user.id);
        return { user: session.user, profile: userProfile };
      }
      return { user: null, profile: null };
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { user: null, profile: null };
    }
  }

  async function signInAsGuest() {
    try {
      setLoading(true);
      
      const { user: guestUser, session: guestSession, profile: guestProfile } = await authApi.continueAsGuest();
      
      const formattedProfile = {
        id: guestProfile.id,
        phone: guestProfile.phone,
        whatsapp_number: guestProfile.whatsappNumber,
        first_name: guestProfile.firstName,
        last_name: guestProfile.lastName,
        city_id: guestProfile.cityId,
        cities: { name: guestProfile.cityName || 'Nouakchott' },
        role: guestProfile.role || 'normal',
        wallet_balance_mru: guestProfile.walletBalance || 0,
        free_posts_remaining: guestProfile.freePostsRemaining || 5,
        isGuest: true,
      };
      
      setUser(guestUser);
      setSession(guestSession);
      setProfile(formattedProfile);
      
      return { user: guestUser, session: guestSession, profile: formattedProfile };
    } catch (error) {
      console.error('Guest sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function isGuest() {
    return profile?.isGuest === true;
  }

  const value = {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    isProfileComplete: !!profile,
    isGuest: isGuest(),
    sendOtp,
    verifyOtp,
    completeRegistration,
    updateProfile,
    signInAsGuest,
    signOut,
    refreshUser,
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
