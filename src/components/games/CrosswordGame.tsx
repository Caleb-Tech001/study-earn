import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useWallet } from '@/contexts/WalletContext';
import { useGameLimit } from '@/hooks/useGameLimit';
import { Trophy, Lightbulb, RotateCcw, Star, Zap, Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CrosswordClue {
  id: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
  userAnswer: string;
}

const puzzles = [
  {
    level: 1,
    title: 'Tech Basics',
    points: 15,
    clues: [
      { id: 1, clue: 'A programming language with curly braces (4)', answer: 'JAVA', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
      { id: 2, clue: 'Document structure language (4)', answer: 'HTML', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
      { id: 3, clue: 'A code error (3)', answer: 'BUG', direction: 'down' as const, row: 0, col: 2, userAnswer: '' },
      { id: 4, clue: 'Styling sheets abbreviation (3)', answer: 'CSS', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
    ],
  },
  {
    level: 2,
    title: 'Data & Algorithms',
    points: 25,
    clues: [
      { id: 1, clue: 'Last In, First Out structure (5)', answer: 'STACK', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
      { id: 2, clue: 'First In, First Out structure (5)', answer: 'QUEUE', direction: 'down' as const, row: 0, col: 0, userAnswer: '' },
      { id: 3, clue: 'Divide and conquer sorting (5)', answer: 'MERGE', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
      { id: 4, clue: 'Searching technique (6)', answer: 'BINARY', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
    ],
  },
  {
    level: 3,
    title: 'Web Development',
    points: 35,
    clues: [
      { id: 1, clue: 'JavaScript runtime (4)', answer: 'NODE', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
      { id: 2, clue: 'Facebook\'s UI library (5)', answer: 'REACT', direction: 'down' as const, row: 0, col: 0, userAnswer: '' },
      { id: 3, clue: 'API architecture style (4)', answer: 'REST', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
      { id: 4, clue: 'Type-safe JavaScript (10)', answer: 'TYPESCRIPT', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
    ],
  },
];

export const CrosswordGame = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { addPoints } = useWallet();
  const { canPlay, remainingPlays, playsToday, maxPlays, recordPlay, plan, planName, isLoading: limitLoading } = useGameLimit();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [clues, setClues] = useState<CrosswordClue[]>(puzzles[0].clues);
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [hasStartedGame, setHasStartedGame] = useState(false);

  const puzzle = puzzles[currentLevel];
  const correctAnswers = clues.filter(c => c.userAnswer.toUpperCase() === c.answer).length;
  const progress = (correctAnswers / clues.length) * 100;

  useEffect(() => {
    setClues(puzzles[currentLevel].clues.map(c => ({ ...c, userAnswer: '' })));
    setSelectedClue(null);
    setInputValue('');
  }, [currentLevel]);

  const handleStartGame = () => {
    if (!canPlay) {
      toast({
        title: 'Daily Limit Reached',
        description: `Upgrade your plan for more plays!`,
        variant: 'destructive',
      });
      return;
    }
    recordPlay();
    setHasStartedGame(true);
    toast({
      title: 'Game Started!',
      description: remainingPlays === 'unlimited' 
        ? 'You have unlimited plays!' 
        : `${typeof remainingPlays === 'number' ? remainingPlays - 1 : remainingPlays} plays remaining today`,
    });
  };

  const handleSubmitAnswer = () => {
    if (!selectedClue || !inputValue.trim()) return;

    const isCorrect = inputValue.toUpperCase() === selectedClue.answer;
    
    setClues(prev => prev.map(c => 
      c.id === selectedClue.id ? { ...c, userAnswer: inputValue.toUpperCase() } : c
    ));

    if (isCorrect) {
      const pointsEarned = Math.max(50, 100 - hintsUsed * 20);
      setScore(prev => prev + pointsEarned);
      
      // Add points to wallet
      addPoints(pointsEarned);
      
      addNotification({
        title: 'Correct Answer!',
        message: `+${pointsEarned} points for solving the clue!`,
        type: 'reward',
        points: pointsEarned,
      });
      
      toast({
        title: 'Correct!',
        description: `+${pointsEarned} points earned!`,
      });
    } else {
      toast({
        title: 'Incorrect',
        description: 'Try again or use a hint!',
        variant: 'destructive',
      });
    }

    setInputValue('');
    setSelectedClue(null);
  };

  const handleHint = () => {
    if (!selectedClue) return;
    
    const hint = selectedClue.answer.charAt(0);
    setInputValue(hint);
    setHintsUsed(prev => prev + 1);
    toast({
      title: 'Hint Used',
      description: `The answer starts with "${hint}"`,
    });
  };

  const handleCompleteLevel = () => {
    const bonusPoints = puzzle.points * 10;
    setScore(prev => prev + bonusPoints);
    setCompletedLevels(prev => [...prev, currentLevel]);
    
    // Add bonus points to wallet
    addPoints(bonusPoints);
    
    addNotification({
      title: `Level ${puzzle.level} Completed!`,
      message: `Amazing! You completed "${puzzle.title}" and earned ${bonusPoints} bonus points!`,
      type: 'reward',
      points: bonusPoints,
    });

    toast({
      title: '🎉 Level Complete!',
      description: `You earned ${bonusPoints} bonus points! ${currentLevel < puzzles.length - 1 ? 'Next level unlocked!' : 'All levels completed!'}`,
    });
  };

  const handleNextLevel = () => {
    if (currentLevel < puzzles.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setHintsUsed(0);
    }
  };

  const handleReset = () => {
    setClues(puzzles[currentLevel].clues.map(c => ({ ...c, userAnswer: '' })));
    setSelectedClue(null);
    setInputValue('');
    setHintsUsed(0);
  };

  const isLevelComplete = correctAnswers === clues.length;

  // Show loading state
  if (limitLoading) {
    return (
      <Card className="border-2 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Card>
    );
  }

  // Show start game or locked state
  if (!hasStartedGame) {
    return (
      <Card className="border-2 p-6">
        <div className="text-center py-8">
          <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center ${canPlay ? 'bg-primary/10' : 'bg-muted'}`}>
            {canPlay ? (
              <Trophy className="h-8 w-8 text-primary" />
            ) : (
              <Lock className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          <h3 className="font-display text-2xl font-bold mb-2">
            {canPlay ? 'Ready to Play?' : 'Daily Limit Reached'}
          </h3>
          
          <p className="text-muted-foreground mb-4">
            {canPlay 
              ? `You have ${remainingPlays === 'unlimited' ? 'unlimited' : remainingPlays} ${remainingPlays === 1 ? 'play' : 'plays'} remaining today`
              : `You've used all ${maxPlays} plays for today`
            }
          </p>

          {/* Plan info badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="gap-1">
              {plan === 'premium' && <Crown className="h-3 w-3 text-accent" />}
              {planName} Plan
            </Badge>
            <span className="text-sm text-muted-foreground">
              • {maxPlays === Infinity ? 'Unlimited' : maxPlays} plays/day
            </span>
          </div>

          {canPlay ? (
            <Button size="lg" onClick={handleStartGame}>
              <Zap className="mr-2 h-5 w-5" />
              Start Game
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Upgrade to get more plays!
              </p>
              <div className="flex justify-center gap-2">
                {plan === 'free' && (
                  <Link to="/learner/settings">
                    <Button variant="outline">
                      <Crown className="mr-2 h-4 w-4" />
                      Basic (4 plays/day)
                    </Button>
                  </Link>
                )}
                {plan !== 'premium' && (
                  <Link to="/learner/settings">
                    <Button className="bg-gradient-to-r from-accent to-primary">
                      <Crown className="mr-2 h-4 w-4" />
                      Premium (Unlimited)
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 p-6">
      {/* Play count indicator */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
        <span className="text-muted-foreground">
          Today's plays: {playsToday}/{maxPlays === Infinity ? '∞' : maxPlays}
        </span>
        <Badge variant="outline" className="gap-1">
          {plan === 'premium' && <Crown className="h-3 w-3 text-accent" />}
          {planName}
        </Badge>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-bold">{puzzle.title}</h3>
            <Badge variant="secondary">Level {puzzle.level}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Complete the crossword to earn {puzzle.points} points</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <span className="font-bold">{score}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>{correctAnswers}/{clues.length} solved</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Level Indicators */}
      <div className="mb-6 flex gap-2">
        {puzzles.map((p, i) => (
          <Button
            key={i}
            variant={currentLevel === i ? 'default' : completedLevels.includes(i) ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => i <= Math.max(...completedLevels, 0) + 1 && setCurrentLevel(i)}
            disabled={i > Math.max(...completedLevels, -1) + 1}
            className="gap-1"
          >
            {completedLevels.includes(i) && <Star className="h-3 w-3" />}
            {p.level}
          </Button>
        ))}
      </div>

      {/* Clues */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-3 font-semibold">Across</h4>
          <div className="space-y-2">
            {clues.filter(c => c.direction === 'across').map(clue => (
              <div
                key={clue.id}
                onClick={() => !clue.userAnswer && setSelectedClue(clue)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedClue?.id === clue.id ? 'border-primary bg-primary/5' : 
                  clue.userAnswer === clue.answer ? 'border-success bg-success/5' :
                  clue.userAnswer ? 'border-destructive bg-destructive/5' : 'hover:bg-muted'
                }`}
              >
                <p className="text-sm">{clue.clue}</p>
                {clue.userAnswer && (
                  <p className={`mt-1 font-mono text-sm font-bold ${
                    clue.userAnswer === clue.answer ? 'text-success' : 'text-destructive'
                  }`}>
                    {clue.userAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Down</h4>
          <div className="space-y-2">
            {clues.filter(c => c.direction === 'down').map(clue => (
              <div
                key={clue.id}
                onClick={() => !clue.userAnswer && setSelectedClue(clue)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedClue?.id === clue.id ? 'border-primary bg-primary/5' : 
                  clue.userAnswer === clue.answer ? 'border-success bg-success/5' :
                  clue.userAnswer ? 'border-destructive bg-destructive/5' : 'hover:bg-muted'
                }`}
              >
                <p className="text-sm">{clue.clue}</p>
                {clue.userAnswer && (
                  <p className={`mt-1 font-mono text-sm font-bold ${
                    clue.userAnswer === clue.answer ? 'text-success' : 'text-destructive'
                  }`}>
                    {clue.userAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Input */}
      {selectedClue && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="mb-3 text-sm font-medium">
            Selected: {selectedClue.clue}
          </p>
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              placeholder="Enter your answer..."
              className="font-mono uppercase"
              maxLength={selectedClue.answer.length}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
            />
            <Button onClick={handleSubmitAnswer}>
              <Zap className="mr-2 h-4 w-4" />
              Submit
            </Button>
            <Button variant="outline" onClick={handleHint}>
              <Lightbulb className="mr-2 h-4 w-4" />
              Hint
            </Button>
          </div>
        </div>
      )}

      {/* Level Complete */}
      {isLevelComplete && !completedLevels.includes(currentLevel) && (
        <div className="mt-6 rounded-lg border-2 border-success bg-success/10 p-6 text-center">
          <Trophy className="mx-auto mb-3 h-12 w-12 text-success" />
          <h3 className="mb-2 font-display text-2xl font-bold text-success">Level Complete!</h3>
          <p className="mb-4 text-muted-foreground">You solved all clues!</p>
          <div className="flex justify-center gap-3">
            <Button onClick={handleCompleteLevel} className="bg-success hover:bg-success/90">
              Claim {puzzle.points} Points
            </Button>
            {currentLevel < puzzles.length - 1 && (
              <Button variant="outline" onClick={() => { handleCompleteLevel(); handleNextLevel(); }}>
                Next Level →
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
