'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SIGNIN_PROMPT_KEY = 'movieflix_signin_prompt_shown';
const SIGNIN_PROMPT_DISMISSED_KEY = 'movieflix_signin_prompt_dismissed';

export const useSignInPrompt = () => {
  const { user, loading } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Don't show anything while auth is loading
    if (loading) return;

    // Don't show if user is already signed in
    if (user) return;

    // Check if user has previously dismissed the dialog permanently
    const hasBeenDismissed = localStorage.getItem(SIGNIN_PROMPT_DISMISSED_KEY);
    if (hasBeenDismissed === 'true') return;

    // Check if this is a new session (hasn't seen the prompt in this session)
    const hasSeenPromptInSession = sessionStorage.getItem(SIGNIN_PROMPT_KEY);
    
    if (!hasSeenPromptInSession) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setShowDialog(true);
        sessionStorage.setItem(SIGNIN_PROMPT_KEY, 'true');
      }, 1500); // Show after 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleDismissPermanently = () => {
    setShowDialog(false);
    localStorage.setItem(SIGNIN_PROMPT_DISMISSED_KEY, 'true');
  };

  const resetPrompt = () => {
    localStorage.removeItem(SIGNIN_PROMPT_DISMISSED_KEY);
    sessionStorage.removeItem(SIGNIN_PROMPT_KEY);
  };

  return {
    showDialog,
    handleClose,
    handleDismissPermanently,
    resetPrompt
  };
};