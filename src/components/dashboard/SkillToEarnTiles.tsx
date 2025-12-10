import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  CheckSquare, 
  BookOpen, 
  Target, 
  Flame,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const tasks = [
  {
    id: 'daily-tasks',
    title: 'Complete Daily Tasks',
    description: 'Finish 3 learning activities today',
    icon: CheckSquare,
    points: 25,
    progress: 2,
    total: 3,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'learn-skill',
    title: 'Learn a Skill',
    description: 'Complete a module lesson',
    icon: BookOpen,
    points: 15,
    progress: 0,
    total: 1,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    id: 'practice',
    title: 'Practice Challenge',
    description: 'Complete a practice quiz',
    icon: Target,
    points: 20,
    progress: 1,
    total: 2,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    id: 'streak',
    title: 'Productivity Streak',
    description: 'Keep your 7-day streak going',
    icon: Flame,
    points: 50,
    progress: 7,
    total: 7,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

export const SkillToEarnTiles = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [completedTasks, setCompletedTasks] = useState<string[]>(['streak']);

  const handleCompleteTask = (taskId: string, points: number, title: string) => {
    if (completedTasks.includes(taskId)) return;

    setCompletedTasks(prev => [...prev, taskId]);
    
    toast({
      title: `+${points} Points Earned!`,
      description: `You completed "${title}"`,
    });

    addNotification({
      title: `Task Completed!`,
      message: `You earned ${points} points for completing "${title}"`,
      type: 'reward',
      points,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tasks.map((task) => {
        const isComplete = completedTasks.includes(task.id) || task.progress >= task.total;
        const Icon = task.icon;
        
        return (
          <Card 
            key={task.id} 
            className={`border-2 p-5 transition-all hover:shadow-lg ${
              isComplete ? 'border-success/50 bg-success/5' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`rounded-xl p-3 ${task.bgColor}`}>
                  <Icon className={`h-6 w-6 ${task.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    {isComplete && (
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        Done
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div 
                        className={`h-full transition-all ${isComplete ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${(task.progress / task.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {task.progress}/{task.total}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="mb-2 gap-1">
                  <Zap className="h-3 w-3" />
                  +{task.points}
                </Badge>
                {!isComplete && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleCompleteTask(task.id, task.points, task.title)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
