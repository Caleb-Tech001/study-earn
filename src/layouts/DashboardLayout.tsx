import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  Wallet,
  User,
  Settings,
  LogOut,
  Menu,
  GraduationCap,
  Users,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { CartDropdown } from '@/components/CartDropdown';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const userRole = user?.user_metadata?.role || 'learner';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const getNavLinks = () => {
    if (!user) return [];

    switch (userRole) {
      case 'learner':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/learner/dashboard' },
          { icon: BookOpen, label: 'My Modules', path: '/learner/modules' },
          { icon: Wallet, label: 'Wallet', path: '/learner/wallet' },
          { icon: ShoppingBag, label: 'Marketplace', path: '/learner/marketplace' },
          { icon: MessageSquare, label: 'Community', path: '/learner/community' },
        ];
      case 'instructor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/instructor/dashboard' },
          { icon: GraduationCap, label: 'My Courses', path: '/instructor/courses' },
          { icon: Users, label: 'Students', path: '/instructor/students' },
          { icon: Wallet, label: 'Payout', path: '/instructor/payout' },
        ];
      case 'institution':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/institution/dashboard' },
          { icon: Users, label: 'Cohorts', path: '/institution/cohorts' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Wallet, label: 'Finance', path: '/admin/finance' },
        ];
      default:
        return [];
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/welcome');
  };

  const navLinks = getNavLinks();

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold">StudyEarn</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-smooth hover:bg-muted"
          >
            <link.icon className="h-5 w-5" />
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 border-r border-border bg-card lg:block">
        <NavContent />
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <NavContent />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <CartDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden font-medium md:inline-block">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/${userRole}/profile`)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/${userRole}/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
