'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; 
import { faFilm as faFilmSolid } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      console.error('Failed to sign in:', error);
      setIsSigningIn(false);
    }
  };

  // Show loading if checking auth state or if user is already logged in
  if (loading || user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 p-4 rounded-full">
              <FontAwesomeIcon 
                icon={faFilmSolid} 
                className="text-white text-3xl"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to MovieFlix
          </h1>
          <p className="text-slate-300 text-lg">
            Sign in to save your favorite movies and get personalized recommendations
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Get Started
            </h2>
            <p className="text-slate-400">
              Continue with your Google account
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faGoogle} className="text-xl" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-slate-600">
            <h3 className="text-white font-medium mb-4 text-center">
              What you'll get:
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Save and organize your favorite movies</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Get personalized movie recommendations</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Sync your preferences across devices</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;