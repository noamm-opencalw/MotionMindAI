import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// =============================
// SUPABASE CLIENT
// =============================
const SUPABASE_URL = 'https://sazaxtlmtzvjmqmbkioo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhemF4dGxtdHp2am1xbWJraW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNDgzNjksImV4cCI6MjA4OTcyNDM2OX0.bmnMt-XoXb6hjQXrSBVtZuIi5E8LqLriyCHuiM_Vs2g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentProfile = null;

// =============================
// AUTH INITIALIZATION
// =============================
export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await loadProfile();
  }
  return currentUser;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      await loadProfile();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      currentProfile = null;
    }
    callback(event, session);
  });
}

// =============================
// PROFILE MANAGEMENT
// =============================
async function loadProfile() {
  if (!currentUser) return;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .maybeSingle();
  currentProfile = data;
}

export async function refreshProfile() {
  await loadProfile();
}

// =============================
// AUTH ACTIONS
// =============================
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname,
    },
  });
  if (error) throw error;
}

export async function signInWithApple() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: window.location.origin + window.location.pathname,
    },
  });
  if (error) throw error;
}

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  currentUser = data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
  currentUser = null;
  currentProfile = null;
  window.location.hash = '#/';
  window.location.reload();
}

// =============================
// USER STATE GETTERS
// =============================
export function getUser() { return currentUser; }
export function getProfile() { return currentProfile; }
export function isLoggedIn() { return !!currentUser && (!!currentProfile || isGuest()); }
export function isGuest() { return currentUser?.is_anonymous === true; }
export function isAdmin() { return currentProfile?.role === 'admin'; }
export function isLocked() { return currentProfile?.is_locked === true; }

export function getFirstName() {
  return currentProfile?.first_name || currentProfile?.full_name?.split(' ')[0] || '';
}

export function getTimeGreeting(firstName) {
  const hour = new Date().getHours();
  let greeting;
  if (hour >= 5 && hour < 12) greeting = 'בוקר טוב';
  else if (hour >= 12 && hour < 17) greeting = 'צהריים טובים';
  else if (hour >= 17 && hour < 21) greeting = 'ערב טוב';
  else greeting = 'לילה טוב';
  return firstName ? `${greeting}, ${firstName}` : greeting;
}
