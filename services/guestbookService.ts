import { GuestEntry } from '../types';

// In a real app, this would point to '/api/guestbook'
const API_URL = '/api/guestbook';

// MOCK DATA for Preview Mode (since we don't have a live Vercel backend here)
const MOCK_DATA: GuestEntry[] = [
  { id: '1', name: 'Alice', message: 'Love the new website design!', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', name: 'Bob', message: 'Hello from San Francisco!', date: new Date(Date.now() - 172800000).toISOString() },
  { id: '3', name: 'Charlie', message: 'Great work on the project.', date: new Date(Date.now() - 259200000).toISOString() },
];

export const fetchMessages = async (): Promise<GuestEntry[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      // Fallback for demo preview if API is missing (404)
      if (response.status === 404) {
        console.warn('API not found. Using Mock Data for Preview.');
        return MOCK_DATA;
      }
      throw new Error('Failed to fetch messages');
    }
    return await response.json();
  } catch (error) {
    console.warn('Network error or API missing. Using Mock Data for Preview.');
    return MOCK_DATA;
  }
};

export const postMessage = async (name: string, message: string): Promise<void> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, message }),
    });

    if (!response.ok) {
       // Fallback for demo preview
       if (response.status === 404) {
        console.warn('API not found. Simulating success for Preview.');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        return;
      }
      throw new Error('Failed to post message');
    }
  } catch (error) {
    console.warn('Network error or API missing. Simulating success for Preview.');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  }
};
