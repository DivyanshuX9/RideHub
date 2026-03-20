'use client';

import { useAuth } from '@/components/auth/auth-context';
import { User, Calendar } from 'lucide-react';

export function ProfileInfo() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="h-10 w-10 text-primary" />
      </div>

      <h3 className="text-xl font-bold mb-1">{user?.username}</h3>

      <div className="space-y-2 mt-4 w-full">
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}