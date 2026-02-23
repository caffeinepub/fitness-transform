import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ProfileId = 'user' | 'girlfriend';

interface ProfileContextType {
  activeProfile: ProfileId;
  setActiveProfile: (profile: ProfileId) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<ProfileId>(() => {
    try {
      const stored = sessionStorage.getItem('activeProfile');
      const validProfile = stored === 'girlfriend' ? 'girlfriend' : 'user';
      console.log('[ProfileContext] Initialized with profile:', validProfile);
      return validProfile;
    } catch (error) {
      console.error('[ProfileContext] Error reading from sessionStorage:', error);
      return 'user';
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('activeProfile', activeProfile);
      console.log('[ProfileContext] Profile changed to:', activeProfile);
    } catch (error) {
      console.error('[ProfileContext] Error writing to sessionStorage:', error);
    }
  }, [activeProfile]);

  const setActiveProfile = (profile: ProfileId) => {
    if (!profile || (profile !== 'user' && profile !== 'girlfriend')) {
      console.error('[ProfileContext] Invalid profile value:', profile);
      return;
    }
    console.log('[ProfileContext] Setting active profile to:', profile);
    setActiveProfileState(profile);
  };

  return (
    <ProfileContext.Provider value={{ activeProfile, setActiveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
