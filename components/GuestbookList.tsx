import React from 'react';
import { GuestEntry } from '../types';
import { formatDistanceToNow } from 'date-fns'; // Note: In a real app, install date-fns

interface GuestbookListProps {
  entries: GuestEntry[];
  isLoading: boolean;
}

// Simple date formatter to avoid external dependencies for this demo
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Just now';
  }
};

export const GuestbookList: React.FC<GuestbookListProps> = ({ entries, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
            <div className="h-3 bg-slate-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
        <p>No messages yet. Be the first to sign!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div 
          key={entry.id || index} 
          className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
              {entry.name}
            </h3>
            <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-full">
              {formatDate(entry.date)}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
            {entry.message}
          </p>
        </div>
      ))}
    </div>
  );
};
