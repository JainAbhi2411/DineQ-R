import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { 
  UtensilsCrossed, 
  Mail,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Info
} from 'lucide-react';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: 'Success',
          description: 'Email verified successfully! Redirecting to your dashboard...',
        });

        // Get user profile to determine role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // Redirect based on role
        setTimeout(() => {
          if (profile?.role === 'owner') {
            navigate('/owner');
          } else {
            navigate('/customer');
          }
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Verification code sent! Please check your email.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend code',
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">DineQR</h1>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Verify Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a 6-digit verification code to<br />
              <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* SMTP Configuration Notice */}
            <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-900 dark:text-blue-100">Email Delivery Information</AlertTitle>
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                If you don't receive the email within 2-3 minutes:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Check your spam/junk folder</li>
                  <li>Click "Resend Code" below</li>
                  <li>Verify your email address is correct</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Note for Developers:</strong> SMTP must be configured in Supabase for email delivery. 
                  See <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">SMTP_CONFIGURATION_GUIDE.md</code> for setup instructions.
                </p>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-base">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading}
                  required
                  maxLength={6}
                  className="h-12 text-base text-center text-2xl tracking-widest font-semibold"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Check your email inbox and spam folder
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Verify Email
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Didn't receive the code?
                  </span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12 text-base font-semibold gap-2"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Resend Code
                  </>
                )}
              </Button>

              <Link to="/register">
                <Button variant="ghost" className="w-full h-12 text-base font-semibold gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Registration
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By verifying your email, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
