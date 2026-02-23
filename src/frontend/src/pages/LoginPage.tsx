import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, identity, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (identity && !identity.getPrincipal().isAnonymous()) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Dumbbell className="h-9 w-9 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FitTransform
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Exercise today and be proud of yourself tomorrow
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Sign in to start tracking your fitness journey and transform your body
            </p>
            
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full text-lg py-6 gap-2 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure authentication using passkey, email, or phone number
            </p>
          </div>

          {loginStatus === 'loginError' && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center">
                Authentication failed. Please try again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
