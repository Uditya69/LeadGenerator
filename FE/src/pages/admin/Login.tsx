import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { login } from '@/lib/api';
import { AUTH_CONFIG } from '@/lib/config';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if already logged in
  const isAuthenticated = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) !== null;
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEMO_CREDENTIALS,
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });
      
      if (response.success && response.data) {
        toast({
          title: 'Login successful',
          description: 'Welcome to the admin dashboard.',
        });
        
        // Navigate to dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        toast({
          title: 'Login failed',
          description: response.error || 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    form.setValue('email', DEMO_CREDENTIALS.email);
    form.setValue('password', DEMO_CREDENTIALS.password);
    form.handleSubmit(onSubmit)();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Sign In'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    Login with Demo Account
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Demo credentials: admin@example.com / admin123
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
