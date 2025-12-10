import { useState } from 'react';
import { Bell, Trophy, Info, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'reward':
        return <Trophy className="h-4 w-4 text-accent" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications ({notifications.length})
          </SheetTitle>
        </SheetHeader>

        {unreadCount > 0 && (
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        )}

        <Separator />

        <div className="flex-1 overflow-y-auto py-4">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                You'll see updates here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer rounded-lg border p-3 transition-all hover:bg-muted/50 ${
                    !notification.read ? 'border-primary/30 bg-primary/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {notification.points && (
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            +{notification.points} pts
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
