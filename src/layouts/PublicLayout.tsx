import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export const PublicLayout = ({ children, showNav = true }: PublicLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      {showNav && (
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <nav className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">StudyEarn</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {showNav && (
        <footer className="border-t border-border bg-card py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-display text-lg font-bold">StudyEarn</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Earn real rewards for verified learning.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">Platform</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/about" className="text-muted-foreground hover:text-foreground">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/help" className="text-muted-foreground hover:text-foreground">
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/legal" className="text-muted-foreground hover:text-foreground">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal" className="text-muted-foreground hover:text-foreground">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">Contact</h3>
                <div className="space-y-2">
                  <a 
                    href="mailto:studyearnservices@gmail.com" 
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Email
                  </a>
                  <p className="text-sm text-muted-foreground">LinkedIn</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
              © 2025 StudyEarn. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
