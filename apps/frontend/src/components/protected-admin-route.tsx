'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent } from '@/components/ui/card';

const ADMIN_EMAILS = ['john.doe@example.com', 'admin@turfbooking.com'];

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && isAuthenticated && user && !ADMIN_EMAILS.includes(user.email)) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-center text-destructive">
                Access Denied: Admin privileges required
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}