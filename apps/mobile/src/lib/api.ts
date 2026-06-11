import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Use this for our API requests to NestJS
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No valid session found');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
