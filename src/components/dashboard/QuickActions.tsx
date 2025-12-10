import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  FileQuestion, 
  Coins, 
  PlayCircle,
} from 'lucide-react';

const actions = [
  {
    title: 'Play Game',
    description: 'Crossword puzzle',
    icon: Gamepad2,
    path: '#crossword',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Attempt Quiz',
    description: 'Test your skills',
    icon: FileQuestion,
    path: '/learner/modules',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    title: 'Earn Opportunities',
    description: 'View ways to earn',
    icon: Coins,
    path: '/learner/marketplace',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Resume Module',
    description: 'Continue learning',
    icon: PlayCircle,
    path: '/learner/modules',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

interface QuickActionsProps {
  onPlayGame?: () => void;
}

export const QuickActions = ({ onPlayGame }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;
        const isGame = action.path === '#crossword';
        
        if (isGame) {
          return (
            <Card 
              key={action.title}
              className="cursor-pointer border-2 p-4 transition-all hover:shadow-lg hover:scale-[1.02]"
              onClick={onPlayGame}
            >
              <div className={`mx-auto mb-3 w-fit rounded-xl p-3 ${action.bgColor}`}>
                <Icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <h3 className="text-center text-sm font-semibold">{action.title}</h3>
              <p className="text-center text-xs text-muted-foreground">{action.description}</p>
            </Card>
          );
        }

        return (
          <Link key={action.title} to={action.path}>
            <Card className="cursor-pointer border-2 p-4 transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className={`mx-auto mb-3 w-fit rounded-xl p-3 ${action.bgColor}`}>
                <Icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <h3 className="text-center text-sm font-semibold">{action.title}</h3>
              <p className="text-center text-xs text-muted-foreground">{action.description}</p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
