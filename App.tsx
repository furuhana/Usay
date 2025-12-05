import React from 'react';
import useSWR from 'swr';
import { GuestbookForm } from './components/GuestbookForm';
import { GuestbookList } from './components/GuestbookList';
import { fetchMessages, postMessage } from './services/guestbookService';
import { GuestEntry } from './types';
import { BookOpen } from 'lucide-react';

export default function App() {
  // 1. Use SWR for data fetching
  // 'refreshInterval: 10000' refreshes data every 10 seconds
  const { data: entries, isLoading, mutate } = useSWR<GuestEntry[]>(
    '/api/guestbook',
    fetchMessages,
    {
      refreshInterval: 10000,
      fallbackData: [], // Initial empty state
    }
  );

  const handleMessagePosted = async (name: string, message: string) => {
    // 2. Optimistic UI Update
    // Create a temporary entry to show immediately
    const optimisticEntry: GuestEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      message,
      date: new Date().toISOString(),
    };

    const currentEntries = entries || [];
    const updatedEntries = [optimisticEntry, ...currentEntries];

    // Mutate the local cache immediately (false = do not revalidate yet)
    // This makes the UI feel instant
    await mutate(updatedEntries, false);

    // Send the actual request to the backend
    await postMessage(name, message);

    // Trigger a re-fetch from the server to ensure data consistency
    await mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-md mb-4 text-indigo-600">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-3">
            Digital Guestbook
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powered by Next.js & Google Sheets
          </p>
        </div>

        <div className="grid gap-10">
          {/* Input Section */}
          <section>
            <GuestbookForm onMessagePosted={handleMessagePosted} />
          </section>

          {/* List Section */}
          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-semibold text-slate-800">
                Recent Messages
              </h2>
              <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                {entries ? entries.length : 0} entries
              </span>
            </div>
            <GuestbookList entries={entries || []} isLoading={isLoading} />
          </section>
        </div>

        <div className="mt-16 text-center border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-400">
            Note: This preview runs in Demo Mode. <br/>
            Real implementation requires setting up the <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-600">/api/guestbook</code> route.
          </p>
        </div>
      </div>
    </div>
  );
}