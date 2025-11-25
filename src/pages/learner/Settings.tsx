import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Bell, Lock, CreditCard } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

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
                    Manage your payment methods and subscription
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Current Plan</h3>
                    <span className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
                      Free
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You're currently on the free plan
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold">Payment Methods</h3>
                  <Button variant="outline">Add Payment Method</Button>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold">Upgrade Plan</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Unlock premium features and earn more rewards
                  </p>
                  <Button>View Premium Plans</Button>
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
