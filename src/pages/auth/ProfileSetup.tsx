import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, User, Globe, Phone } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  const role = (location.state?.role as string) || 'learner';

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionSize, setInstitutionSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updates: any = { full_name: fullName };
      
      if (role === 'learner') {
        updates.country = country;
      } else if (role === 'instructor') {
        updates.bio = bio;
        updates.area_of_expertise = expertise;
        updates.years_of_experience = experience ? parseInt(experience) : null;
      } else if (role === 'institution') {
        updates.institution_name = institutionName;
        updates.phone = phone;
        updates.institution_size = institutionSize;
      }

      const { error } = await updateProfile(updates);

      if (error) {
        toast({
          title: 'Update Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Profile Updated!',
          description: 'Your profile has been set up successfully',
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <PublicLayout showNav={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-primary">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-2 font-display text-4xl font-bold">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Help us personalize your experience
            </p>
          </div>

          <Card className="border-2 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common fields */}
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Learner fields */}
              {role === 'learner' && (
                <div>
                  <Label htmlFor="country">Country</Label>
                  <div className="relative mt-2">
                    <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="country"
                      type="text"
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              {/* Instructor fields */}
              {role === 'instructor' && (
                <>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expertise">Area of Expertise</Label>
                    <Input
                      id="expertise"
                      type="text"
                      placeholder="e.g., Web Development"
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      min="0"
                    />
                  </div>
                </>
              )}

              {/* Institution fields */}
              {role === 'institution' && (
                <>
                  <div>
                    <Label htmlFor="institutionName">Institution Name</Label>
                    <Input
                      id="institutionName"
                      type="text"
                      placeholder="ABC University"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Contact Phone</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="institutionSize">Size of Learning Group</Label>
                    <Input
                      id="institutionSize"
                      type="text"
                      placeholder="e.g., 100-500 students"
                      value={institutionSize}
                      onChange={(e) => setInstitutionSize(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-primary shadow-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Complete Setup'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProfileSetup;