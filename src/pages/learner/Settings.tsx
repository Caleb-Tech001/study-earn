import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Bell, Lock, CreditCard, CheckCircle2, Sun, Moon, Monitor, Palette } from 'lucide-react';
import { PricingPlans } from '@/components/subscription/PricingPlans';
import { useSubscription } from '@/hooks/useSubscription';

const Settings = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { plan, subscriptionEnd, checkSubscription } = useSubscription();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check for success/canceled params from Stripe redirect
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast({
        title: 'Subscription Successful!',
        description: 'Welcome to your new plan. Refreshing your subscription status...',
      });
      // Refresh subscription status
      setTimeout(() => checkSubscription(), 2000);
    } else if (canceled === 'true') {
      toast({
        title: 'Checkout Canceled',
        description: 'Your subscription was not processed.',
        variant: 'destructive',
      });
    }
  }, [searchParams, toast, checkSubscription]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved successfully.",
    });
  };

  const defaultTab = searchParams.get('tab') || 'notifications';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="flex-wrap">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="mt-6">
            <Card className="border-2 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Appearance</h2>
                  <p className="text-sm text-muted-foreground">
                    Customize how StudyEarn looks on your device
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-4 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Card 
                      className={`cursor-pointer p-4 text-center transition-all hover:border-primary ${theme === 'light' ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="mx-auto mb-2 h-8 w-8 text-amber-500" />
                      <p className="font-medium">Light</p>
                      <p className="text-xs text-muted-foreground">Bright and clean</p>
                    </Card>
                    <Card 
                      className={`cursor-pointer p-4 text-center transition-all hover:border-primary ${theme === 'dark' ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="mx-auto mb-2 h-8 w-8 text-indigo-500" />
                      <p className="font-medium">Dark</p>
                      <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                    </Card>
                    <Card 
                      className={`cursor-pointer p-4 text-center transition-all hover:border-primary ${theme === 'system' ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setTheme('system')}
                    >
                      <Monitor className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="font-medium">System</p>
                      <p className="text-xs text-muted-foreground">Match device</p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="border-2 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose how you want to be notified
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="course-updates">Course Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new modules and content
                    </p>
                  </div>
                  <Switch id="course-updates" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="achievement-notifications">Achievement Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when you earn achievements
                    </p>
                  </div>
                  <Switch id="achievement-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="community-notifications">Community Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about replies and mentions
                    </p>
                  </div>
                  <Switch id="community-notifications" />
                </div>

                <Button onClick={handleSaveSettings}>Save Preferences</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="border-2 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Security Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account security
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <Card className="border-2 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Privacy Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Control your privacy and data sharing
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch id="profile-visibility" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-progress">Show Learning Progress</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your course progress on your profile
                    </p>
                  </div>
                  <Switch id="show-progress" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="leaderboard-visibility">Leaderboard Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Show your ranking on public leaderboards
                    </p>
                  </div>
                  <Switch id="leaderboard-visibility" defaultChecked />
                </div>

                <Button onClick={handleSaveSettings}>Save Privacy Settings</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <Card className="border-2 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Billing & Subscription</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your subscription and payment methods
                  </p>
                </div>
              </div>

              {/* Current Plan Status */}
              {plan !== 'free' && subscriptionEnd && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium capitalize">Active {plan} Plan</p>
                    <p className="text-sm text-muted-foreground">
                      Renews on {new Date(subscriptionEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 font-semibold">Choose Your Plan</h3>
                  <PricingPlans onSuccess={() => checkSubscription()} />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
