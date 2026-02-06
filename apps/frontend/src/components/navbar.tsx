'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLogout } from '@/hooks/use-auth-mutations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Calendar, Search, Shield } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();
  const router = useRouter();

  if (isLoading) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Turf Booking
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
          🏟️ Turf Booking
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push('/search')}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>

              {user?.email === 'john.doe@example.com' && (
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin')}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => router.push('/my-bookings')}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                My Bookings
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout.mutate()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}