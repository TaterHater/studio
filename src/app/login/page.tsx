"use client";

import React, { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect to home
  if (user) {
    router.push('/');
    return null; // Or a loading indicator
  }
  return (<div>
    login
  </div>)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await login(email, password);
      // Redirect to home after successful login
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  }
}