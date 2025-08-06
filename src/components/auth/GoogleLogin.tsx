import { useState } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { LogOut, ChevronDown } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from './AuthContext';
import { type GoogleUser } from '../../types/auth';

export function GoogleLoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, logout: authLogout } = useAuth();
  const { toast } = useToast();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Get user profile from Google API
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userProfile = await response.json();
        const googleUser: GoogleUser = {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          picture: userProfile.picture,
        };

        setUser(googleUser);
        localStorage.setItem('googleUser', JSON.stringify(googleUser));

        toast({
          title: "Welcome!",
          description: `Logged in as ${googleUser.name}`,
        });
      } catch (error) {
        console.error('Login error:', error);
        toast({
          title: "Error",
          description: "Failed to login with Google. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      toast({
        title: "Error",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
    }
  });

  const logout = () => {
    googleLogout();
    authLogout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (user) {
    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 px-3 justify-start">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block">Hola, {user.name.split(' ')[0]}</span>
              <span className="sm:hidden">Welcome</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  return (
      <Button
          onClick={() => login()}
          disabled={isLoading}
          variant="outline"
          className="h-10"
      >
        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
          <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Button>
  );
}