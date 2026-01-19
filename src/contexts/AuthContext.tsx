// src/context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/db/supabase";
import { Profile } from "@/types/types";
import { profileApi } from "@/db/api";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: "owner" | "customer"
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile safely
  const loadProfile = async (userId: string) => {
    try {
      const profileData = await profileApi.getCurrentProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  useEffect(() => {
    let isMounted = true; // prevent state updates after unmount

    // 1️⃣ Initialize session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadProfile(data.session.user.id);
      setLoading(false);
    });

    // 2️⃣ Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    // Cleanup listener on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in user
  const signIn = async (email: string, password: string) => {
    const username = email.includes("@") ? email.split("@")[0] : email;
    const fullEmail = `${username}@gmail.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email: fullEmail,
      password,
    });
    if (error) throw error;
  };

  // Sign up user and create profile
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "owner" | "customer"
  ) => {
    const username = email.includes("@") ? email.split("@")[0] : email;
    const fullEmail = `${username}@gmail.com`;

    const { data, error } = await supabase.auth.signUp({
      email: fullEmail,
      password,
    });
    if (error) throw error;

    if (data.user) {
      await profileApi.updateProfile(data.user.id, {
        full_name: fullName,
        role: role,
      });
    }
  };

  // Sign out user
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  // Refresh profile manually
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
