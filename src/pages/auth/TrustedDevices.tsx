import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Smartphone, Tablet, Monitor, Trash2, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TrustedDevice {
  id: string;
  device_name: string;
  device_type: string;
  device_fingerprint: string;
  ip_address: string;
  last_used_at: string;
  trusted_at: string;
  is_active: boolean;
}

const TrustedDevices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, [user]);

  const fetchDevices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_used_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load devices',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('trusted_devices')
        .update({ is_active: false })
        .eq('id', deviceId);

      if (error) throw error;

      toast({
        title: 'Device Removed',
        description: 'This device will require verification on next login',
      });

      fetchDevices();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove device',
        variant: 'destructive',
      });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading devices...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="mb-2 font-display text-3xl font-bold">Trusted Devices</h1>
          <p className="text-muted-foreground">
            Manage devices that don't require verification
          </p>
        </div>

        {devices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold">No Trusted Devices</h3>
              <p className="text-center text-sm text-muted-foreground">
                When you mark a device as trusted during login, it will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.device_type);
              
              return (
                <Card key={device.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <DeviceIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{device.device_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last used {formatDistanceToNow(new Date(device.last_used_at), { addSuffix: true })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          IP: {device.ip_address}
                        </p>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Trusted Device?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This device will require phone verification on the next login attempt.
                            You can always mark it as trusted again later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveDevice(device.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Remove Device
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">About Trusted Devices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • Trusted devices don't require phone verification for 30 days
            </p>
            <p>
              • Device trust expires automatically after 30 days of inactivity
            </p>
            <p>
              • You can remove trust from any device at any time
            </p>
            <p>
              • We recommend only trusting your personal devices
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TrustedDevices;