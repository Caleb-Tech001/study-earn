import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useWallet } from '@/contexts/WalletContext';
import { useGameLimit } from '@/hooks/useGameLimit';
import { Trophy, Lightbulb, RotateCcw, Star, Zap, Lock, Crown, Timer, Flame, Target } from 'lucide-react';
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

interface Puzzle {
  level: number;
  title: string;
  points: number;
  clues: CrosswordClue[];
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  name: string;
  description: string;
  timeLimit: number; // in seconds
  pointsMultiplier: number;
  icon: typeof Flame;
  color: string;
  bgColor: string;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: 'Easy',
    description: '3-4 letter words • 3 min timer',
    timeLimit: 180,
    pointsMultiplier: 1,
    icon: Target,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  medium: {
    name: 'Medium',
    description: '4-6 letter words • 2 min timer',
    timeLimit: 120,
    pointsMultiplier: 1.5,
    icon: Flame,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  hard: {
    name: 'Hard',
    description: '6-10 letter words • 90 sec timer',
    timeLimit: 90,
    pointsMultiplier: 2,
    icon: Zap,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
};

// Puzzles organized by difficulty
const puzzlesByDifficulty: Record<Difficulty, Puzzle[]> = {
  easy: [
    {
      level: 1,
      title: 'Tech Basics',
      points: 15,
      clues: [
        { id: 1, clue: 'A code error (3)', answer: 'BUG', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
        { id: 2, clue: 'Styling sheets abbreviation (3)', answer: 'CSS', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
        { id: 3, clue: 'World wide ___ (3)', answer: 'WEB', direction: 'down' as const, row: 0, col: 0, userAnswer: '' },
        { id: 4, clue: 'Document structure language (4)', answer: 'HTML', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
      ],
    },
    {
      level: 2,
      title: 'Simple Code',
      points: 20,
      clues: [
        { id: 1, clue: 'Programming language with curly braces (4)', answer: 'JAVA', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
        { id: 2, clue: 'Version control system (3)', answer: 'GIT', direction: 'down' as const, row: 0, col: 0, userAnswer: '' },
        { id: 3, clue: 'Application interface (3)', answer: 'API', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
        { id: 4, clue: 'Structured Query Language (3)', answer: 'SQL', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
      ],
    },
  ],
  medium: [
    {
      level: 1,
      title: 'Data Structures',
      points: 30,
      clues: [
        { id: 1, clue: 'Last In, First Out structure (5)', answer: 'STACK', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
        { id: 2, clue: 'First In, First Out structure (5)', answer: 'QUEUE', direction: 'down' as const, row: 0, col: 0, userAnswer: '' },
        { id: 3, clue: 'Key-value data structure (5)', answer: 'HASH', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
        { id: 4, clue: 'Hierarchical data structure (4)', answer: 'TREE', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
      ],
    },
    {
      level: 2,
      title: 'Algorithms',
      points: 35,
      clues: [
        { id: 1, clue: 'Divide and conquer sorting (5)', answer: 'MERGE', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
        { id: 2, clue: 'Searching technique (6)', answer: 'BINARY', direction: 'down' as const, row: 0, col: 0, userAnswer: '' },
        { id: 3, clue: 'Facebook\'s UI library (5)', answer: 'REACT', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
        { id: 4, clue: 'JavaScript runtime (4)', answer: 'NODE', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
      ],
    },
  ],
  hard: [
    {
      level: 1,
      title: 'Advanced Tech',
      points: 50,
      clues: [
        { id: 1, clue: 'Type-safe JavaScript (10)', answer: 'TYPESCRIPT', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
        { id: 2, clue: 'Object-oriented programming (3 letters abbrev) (3)', answer: 'OOP', direction: 'down' as const, row: 0, col: 0, userAnswer: '' },
        { id: 3, clue: 'Containerization platform (6)', answer: 'DOCKER', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
        { id: 4, clue: 'Container orchestration (10)', answer: 'KUBERNETES', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
      ],
    },
    {
      level: 2,
      title: 'Expert Challenge',
      points: 60,
      clues: [
        { id: 1, clue: 'AI language model architecture (11)', answer: 'TRANSFORMER', direction: 'across' as const, row: 0, col: 0, userAnswer: '' },
        { id: 2, clue: 'Cloud computing provider (3 letters)', answer: 'AWS', direction: 'down' as const, row: 0, col: 0, userAnswer: '' },
        { id: 3, clue: 'Database management system (10)', answer: 'POSTGRESQL', direction: 'across' as const, row: 2, col: 0, userAnswer: '' },
        { id: 4, clue: 'JavaScript framework by Google (7)', answer: 'ANGULAR', direction: 'across' as const, row: 4, col: 0, userAnswer: '' },
      ],
    },
  ],
};

const puzzles = puzzlesByDifficulty.easy; // Default for type reference

export const CrosswordGame = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { addPoints } = useWallet();
  const { canPlay, remainingPlays, playsToday, maxPlays, recordPlay, plan, planName, isLoading: limitLoading } = useGameLimit();
  
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const currentPuzzles = difficulty ? puzzlesByDifficulty[difficulty] : [];
  const puzzle = currentPuzzles[currentLevel];
  const config = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;
  const correctAnswers = clues.filter(c => c.userAnswer.toUpperCase() === c.answer).length;
  const progress = clues.length > 0 ? (correctAnswers / clues.length) * 100 : 0;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setGameOver(true);
            toast({
              title: "⏰ Time's Up!",
              description: 'The timer ran out. Try again!',
              variant: 'destructive',
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, toast]);

  // Load puzzle when level or difficulty changes
  useEffect(() => {
    if (difficulty && currentPuzzles[currentLevel]) {
      setClues(currentPuzzles[currentLevel].clues.map(c => ({ ...c, userAnswer: '' })));
      setSelectedClue(null);
      setInputValue('');
    }
  }, [currentLevel, difficulty]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    setCurrentLevel(0);
    setCompletedLevels([]);
    setScore(0);
    setHintsUsed(0);
    setGameOver(false);
    const puzzleClues = puzzlesByDifficulty[diff][0].clues;
    setClues(puzzleClues.map(c => ({ ...c, userAnswer: '' })));
  };

  const handleStartGame = () => {
    if (!canPlay) {
      toast({
        title: 'Daily Limit Reached',
        description: 'Upgrade your plan for more plays!',
        variant: 'destructive',
      });
      return;
    }
    recordPlay();
    setHasStartedGame(true);
    if (config) {
      setTimeRemaining(config.timeLimit);
      setIsTimerRunning(true);
    }
    toast({
      title: 'Game Started!',
      description: remainingPlays === 'unlimited' 
        ? 'You have unlimited plays!' 
        : `${typeof remainingPlays === 'number' ? remainingPlays - 1 : remainingPlays} plays remaining today`,
    });
  };

  const handleSubmitAnswer = () => {
    if (!selectedClue || !inputValue.trim() || gameOver) return;

    const isCorrect = inputValue.toUpperCase() === selectedClue.answer;
    
    setClues(prev => prev.map(c => 
      c.id === selectedClue.id ? { ...c, userAnswer: inputValue.toUpperCase() } : c
    ));

    if (isCorrect && config) {
      const basePoints = Math.max(50, 100 - hintsUsed * 20);
      const pointsEarned = Math.round(basePoints * config.pointsMultiplier);
      setScore(prev => prev + pointsEarned);
      
      addPoints(pointsEarned);
      
      addNotification({
        title: 'Correct Answer!',
        message: `+${pointsEarned} points for solving the clue!`,
        type: 'reward',
        points: pointsEarned,
      });
      
      toast({
        title: 'Correct!',
        description: `+${pointsEarned} points earned! (${config.pointsMultiplier}x multiplier)`,
      });
    } else if (!isCorrect) {
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
    if (!selectedClue || gameOver) return;
    
    const hint = selectedClue.answer.charAt(0);
    setInputValue(hint);
    setHintsUsed(prev => prev + 1);
    // Penalty: reduce time by 10 seconds
    setTimeRemaining(prev => Math.max(0, prev - 10));
    toast({
      title: 'Hint Used (-10s)',
      description: `The answer starts with "${hint}"`,
    });
  };

  const handleCompleteLevel = () => {
    if (!puzzle || !config) return;
    
    setIsTimerRunning(false);
    const timeBonus = Math.round(timeRemaining * 0.5); // Bonus for remaining time
    const bonusPoints = Math.round((puzzle.points * 10 + timeBonus) * config.pointsMultiplier);
    setScore(prev => prev + bonusPoints);
    setCompletedLevels(prev => [...prev, currentLevel]);
    
    addPoints(bonusPoints);
    
    addNotification({
      title: `Level ${puzzle.level} Completed!`,
      message: `Amazing! You earned ${bonusPoints} bonus points (includes ${timeBonus} time bonus)!`,
      type: 'reward',
      points: bonusPoints,
    });

    toast({
      title: '🎉 Level Complete!',
      description: `You earned ${bonusPoints} bonus points! Time bonus: +${timeBonus}`,
    });
  };

  const handleNextLevel = () => {
    if (currentLevel < currentPuzzles.length - 1 && config) {
      setCurrentLevel(prev => prev + 1);
      setHintsUsed(0);
      setTimeRemaining(config.timeLimit);
      setIsTimerRunning(true);
      setGameOver(false);
    }
  };

  const handleReset = () => {
    if (config) {
      setClues(currentPuzzles[currentLevel].clues.map(c => ({ ...c, userAnswer: '' })));
      setSelectedClue(null);
      setInputValue('');
      setHintsUsed(0);
      setTimeRemaining(config.timeLimit);
      setIsTimerRunning(true);
      setGameOver(false);
    }
  };

  const handleChangeDifficulty = () => {
    setDifficulty(null);
    setHasStartedGame(false);
    setIsTimerRunning(false);
    setGameOver(false);
  };

  const isLevelComplete = clues.length > 0 && correctAnswers === clues.length;

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

  // Show difficulty selection
  if (!difficulty) {
    return (
      <Card className="border-2 p-6">
        <div className="text-center mb-6">
          <h3 className="font-display text-2xl font-bold mb-2">Select Difficulty</h3>
          <p className="text-muted-foreground">Choose your challenge level</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => {
            const cfg = DIFFICULTY_CONFIG[diff];
            const Icon = cfg.icon;
            return (
              <Card
                key={diff}
                onClick={() => handleSelectDifficulty(diff)}
                className={`cursor-pointer border-2 p-6 text-center transition-all hover:scale-105 hover:shadow-lg ${cfg.bgColor}`}
              >
                <div className={`mx-auto mb-3 h-12 w-12 rounded-full ${cfg.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${cfg.color}`} />
                </div>
                <h4 className={`font-display text-xl font-bold ${cfg.color}`}>{cfg.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{cfg.description}</p>
                <Badge variant="outline" className="mt-3">
                  {cfg.pointsMultiplier}x Points
                </Badge>
              </Card>
            );
          })}
        </div>
      </Card>
    );
  }

  // Show start game or locked state
  if (!hasStartedGame) {
    return (
      <Card className="border-2 p-6">
        <div className="text-center py-8">
          <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center ${canPlay ? config?.bgColor : 'bg-muted'}`}>
            {canPlay && config ? (
              (() => {
                const Icon = config.icon;
                return <Icon className={`h-8 w-8 ${config.color}`} />;
              })()
            ) : (
              <Lock className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          <Badge className={`mb-3 ${config?.bgColor} ${config?.color} border-0`}>
            {config?.name} Mode
          </Badge>
          
          <h3 className="font-display text-2xl font-bold mb-2">
            {canPlay ? 'Ready to Play?' : 'Daily Limit Reached'}
          </h3>
          
          <p className="text-muted-foreground mb-2">
            {canPlay 
              ? `You have ${remainingPlays === 'unlimited' ? 'unlimited' : remainingPlays} ${remainingPlays === 1 ? 'play' : 'plays'} remaining today`
              : `You've used all ${maxPlays} plays for today`
            }
          </p>
          
          {canPlay && config && (
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {formatTime(config.timeLimit)}
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {config.pointsMultiplier}x points
              </span>
            </div>
          )}

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
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={handleChangeDifficulty}>
                Change Difficulty
              </Button>
              <Button size="lg" onClick={handleStartGame}>
                <Zap className="mr-2 h-5 w-5" />
                Start Game
              </Button>
            </div>
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
      {/* Header with timer and stats */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-4">
          <Badge className={`${config?.bgColor} ${config?.color} border-0`}>
            {config?.name}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Plays: {playsToday}/{maxPlays === Infinity ? '∞' : maxPlays}
          </span>
        </div>
        
        {/* Timer */}
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${
          timeRemaining <= 30 ? 'bg-destructive/20 text-destructive animate-pulse' : 'bg-primary/10'
        }`}>
          <Timer className="h-4 w-4" />
          <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Game Over State */}
      {gameOver && !isLevelComplete && (
        <div className="mb-6 rounded-lg border-2 border-destructive bg-destructive/10 p-6 text-center">
          <Timer className="mx-auto mb-3 h-12 w-12 text-destructive" />
          <h3 className="mb-2 font-display text-2xl font-bold text-destructive">Time's Up!</h3>
          <p className="mb-4 text-muted-foreground">You solved {correctAnswers}/{clues.length} clues</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={handleChangeDifficulty}>
              Change Difficulty
            </Button>
            <Button onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {!gameOver && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold">{puzzle?.title}</h3>
                <Badge variant="secondary">Level {puzzle?.level}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete for {puzzle?.points} base points ({config?.pointsMultiplier}x multiplier)
              </p>
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
            {currentPuzzles.map((p, i) => (
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
                  Hint (-10s)
                </Button>
              </div>
            </div>
          )}

          {/* Level Complete */}
          {isLevelComplete && !completedLevels.includes(currentLevel) && (
            <div className="mt-6 rounded-lg border-2 border-success bg-success/10 p-6 text-center">
              <Trophy className="mx-auto mb-3 h-12 w-12 text-success" />
              <h3 className="mb-2 font-display text-2xl font-bold text-success">Level Complete!</h3>
              <p className="mb-2 text-muted-foreground">You solved all clues with {formatTime(timeRemaining)} remaining!</p>
              <p className="mb-4 text-sm text-muted-foreground">Time bonus: +{Math.round(timeRemaining * 0.5)} points</p>
              <div className="flex justify-center gap-3">
                <Button onClick={handleCompleteLevel} className="bg-success hover:bg-success/90">
                  Claim Points
                </Button>
                {currentLevel < currentPuzzles.length - 1 && (
                  <Button variant="outline" onClick={() => { handleCompleteLevel(); handleNextLevel(); }}>
                    Next Level →
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
