import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Camera, Trophy, Calendar, Mail, Phone } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const userName = user?.user_metadata?.full_name || 'User';
  const userEmail = user?.email || '';

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const stats = [
    { label: 'Modules Completed', value: '12', icon: Trophy },
    { label: 'Days Active', value: '45', icon: Calendar },
    { label: 'Total Earned', value: '$1,250', icon: Trophy },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-2 p-6 lg:col-span-2">
            <h2 className="mb-6 font-display text-2xl font-bold">Personal Information</h2>
            
            <div className="mb-6 flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary text-3xl text-primary-foreground">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">{userName}</h3>
                <p className="text-muted-foreground">Learner</p>
                <Badge className="mt-2">Level 5</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={userName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" defaultValue={userEmail} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="Select your country" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Learning Interests</Label>
                <Input
                  id="interests"
                  placeholder="e.g., Python, Web Development, Data Science"
                />
              </div>

              <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                Save Changes
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-2 p-6">
              <h3 className="mb-4 font-display text-xl font-bold">Statistics</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <stat.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-2 p-6">
              <h3 className="mb-4 font-display text-xl font-bold">Account</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-medium">Jan 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <Badge variant="secondary">Free</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
