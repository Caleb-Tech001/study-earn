import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useWallet } from '@/contexts/WalletContext';
import { Trophy, RotateCcw, Zap, Star, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordPosition {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
  found: boolean;
}

interface CellState {
  letter: string;
  isSelected: boolean;
  isFound: boolean;
  wordIndex?: number;
}

interface Level {
  id: number;
  title: string;
  words: string[];
  gridSize: number;
  points: number;
}

const levels: Level[] = [
  {
    id: 1,
    title: 'Beginner',
    words: ['CODE', 'LEARN', 'EARN', 'QUIZ', 'COIN', 'GAME'],
    gridSize: 10,
    points: 20,
  },
  {
    id: 2,
    title: 'Intermediate',
    words: ['CRYPTO', 'WALLET', 'TOKEN', 'REWARD', 'STUDY', 'SKILL'],
    gridSize: 12,
    points: 35,
  },
  {
    id: 3,
    title: 'Advanced',
    words: ['BLOCKCHAIN', 'EDUCATION', 'KNOWLEDGE', 'PROGRESS', 'ACHIEVE', 'SUCCESS'],
    gridSize: 14,
    points: 50,
  },
];

const DIRECTIONS = {
  horizontal: { dr: 0, dc: 1 },
  vertical: { dr: 1, dc: 0 },
  diagonal: { dr: 1, dc: 1 },
};

export const WordFindGame = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { addPoints } = useWallet();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [pointsEarnedThisSession, setPointsEarnedThisSession] = useState(0);

  const level = levels[currentLevel];
  const foundWords = wordPositions.filter(w => w.found).length;
  const progress = wordPositions.length > 0 ? (foundWords / wordPositions.length) * 100 : 0;

  const placeWord = useCallback((
    grid: string[][],
    word: string,
    gridSize: number
  ): { row: number; col: number; direction: keyof typeof DIRECTIONS } | null => {
    const directions = Object.keys(DIRECTIONS) as (keyof typeof DIRECTIONS)[];
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);

    for (let attempts = 0; attempts < 100; attempts++) {
      const direction = shuffledDirections[attempts % shuffledDirections.length];
      const { dr, dc } = DIRECTIONS[direction];

      const maxRow = gridSize - (dr * (word.length - 1)) - 1;
      const maxCol = gridSize - (dc * (word.length - 1)) - 1;

      if (maxRow < 0 || maxCol < 0) continue;

      const startRow = Math.floor(Math.random() * (maxRow + 1));
      const startCol = Math.floor(Math.random() * (maxCol + 1));

      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const r = startRow + dr * i;
        const c = startCol + dc * i;
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const r = startRow + dr * i;
          const c = startCol + dc * i;
          grid[r][c] = word[i];
        }
        return { row: startRow, col: startCol, direction };
      }
    }
    return null;
  }, []);

  const generateGrid = useCallback(() => {
    const { words, gridSize } = level;
    const tempGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const positions: WordPosition[] = [];

    // Sort words by length (longest first)
    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    for (const word of sortedWords) {
      const placement = placeWord(tempGrid, word, gridSize);
      if (placement) {
        positions.push({
          word,
          startRow: placement.row,
          startCol: placement.col,
          direction: placement.direction,
          found: false,
        });
      }
    }

    // Fill empty cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (tempGrid[r][c] === '') {
          tempGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    // Convert to CellState
    const cellGrid: CellState[][] = tempGrid.map(row =>
      row.map(letter => ({ letter, isSelected: false, isFound: false }))
    );

    setGrid(cellGrid);
    setWordPositions(positions);
    setSelectedCells([]);
  }, [level, placeWord]);

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  const getCellsInLine = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ): { row: number; col: number }[] => {
    const cells: { row: number; col: number }[] = [];
    
    const dr = endRow === startRow ? 0 : endRow > startRow ? 1 : -1;
    const dc = endCol === startCol ? 0 : endCol > startCol ? 1 : -1;

    // Only allow straight lines
    if (dr !== 0 && dc !== 0 && Math.abs(endRow - startRow) !== Math.abs(endCol - startCol)) {
      return cells;
    }

    let r = startRow;
    let c = startCol;
    const steps = Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol));

    for (let i = 0; i <= steps; i++) {
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
        cells.push({ row: r, col: c });
      }
      r += dr;
      c += dc;
    }

    return cells;
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selectionStart) return;
    
    const cells = getCellsInLine(selectionStart.row, selectionStart.col, row, col);
    setSelectedCells(cells);
  };

  const handleMouseUp = () => {
    if (!isSelecting || selectedCells.length === 0) {
      setIsSelecting(false);
      setSelectedCells([]);
      return;
    }

    // Get selected word
    const selectedWord = selectedCells.map(c => grid[c.row][c.col].letter).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    // Check if word matches
    const matchIndex = wordPositions.findIndex(
      wp => !wp.found && (wp.word === selectedWord || wp.word === reversedWord)
    );

    if (matchIndex !== -1) {
      // Mark word as found
      const newPositions = [...wordPositions];
      newPositions[matchIndex].found = true;
      setWordPositions(newPositions);

      // Update grid
      const newGrid = [...grid];
      selectedCells.forEach(({ row, col }) => {
        newGrid[row][col] = { ...newGrid[row][col], isFound: true, wordIndex: matchIndex };
      });
      setGrid(newGrid);

      const wordPoints = Math.ceil(newPositions[matchIndex].word.length * 10);
      setScore(prev => prev + wordPoints);
      setPointsEarnedThisSession(prev => prev + wordPoints);
      
      // Add points to wallet balance
      addPoints(wordPoints);

      addNotification({
        title: 'Word Found!',
        message: `+${wordPoints} points for finding "${newPositions[matchIndex].word}"`,
        type: 'reward',
        points: wordPoints,
      });

      toast({
        title: 'Word Found!',
        description: `+${wordPoints} points for "${newPositions[matchIndex].word}"`,
      });
    }

    setIsSelecting(false);
    setSelectedCells([]);
    setSelectionStart(null);
  };

  const handleCompleteLevel = () => {
    const bonusPoints = level.points * 10; // Bonus points for completing level
    setScore(prev => prev + bonusPoints);
    setCompletedLevels(prev => [...prev, currentLevel]);
    setPointsEarnedThisSession(prev => prev + bonusPoints);

    // Add bonus points to wallet
    addPoints(bonusPoints);

    addNotification({
      title: `Level ${level.id} Completed!`,
      message: `You found all words in "${level.title}" and earned ${bonusPoints} bonus points!`,
      type: 'reward',
      points: bonusPoints,
    });

    toast({
      title: '🎉 Level Complete!',
      description: `You earned ${bonusPoints} bonus points!`,
    });
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    }
  };

  const handleReset = () => {
    generateGrid();
  };

  const isLevelComplete = foundWords === wordPositions.length && wordPositions.length > 0;

  const getColorForWord = (index: number) => {
    const colors = [
      'bg-primary/60',
      'bg-accent/60',
      'bg-success/60',
      'bg-warning/60',
      'bg-secondary',
      'bg-[hsl(280,70%,50%)]/60',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="border-2 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="font-display text-xl font-bold">Word Find</h3>
            <Badge variant="secondary">Level {level.id}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Find all hidden words to earn {level.points} points</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <span className="font-bold">{score}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>{foundWords}/{wordPositions.length} found</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Level Selector */}
      <div className="mb-6 flex gap-2">
        {levels.map((l, i) => (
          <Button
            key={i}
            variant={currentLevel === i ? 'default' : completedLevels.includes(i) ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => i <= Math.max(...completedLevels, 0) + 1 && setCurrentLevel(i)}
            disabled={i > Math.max(...completedLevels, -1) + 1}
            className="gap-1"
          >
            {completedLevels.includes(i) && <Star className="h-3 w-3" />}
            {l.title}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Grid */}
        <div 
          className="inline-block select-none rounded-xl border-2 border-primary/30 bg-card p-3"
          onMouseLeave={() => {
            if (isSelecting) {
              handleMouseUp();
            }
          }}
        >
          <div 
            className="grid gap-1"
            style={{ 
              gridTemplateColumns: `repeat(${level.gridSize}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isSelected = selectedCells.some(c => c.row === rowIndex && c.col === colIndex);
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded font-bold text-sm cursor-pointer transition-all duration-150 select-none sm:h-8 sm:w-8 sm:text-base',
                      cell.isFound
                        ? getColorForWord(cell.wordIndex ?? 0)
                        : isSelected
                        ? 'bg-primary/40 scale-110'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    {cell.letter}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Word List */}
        <div className="flex-1">
          <h4 className="mb-3 font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            Find These Words
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {wordPositions.map((wp, i) => (
              <div
                key={wp.word}
                className={cn(
                  'rounded-lg border px-3 py-2 font-mono text-sm transition-all',
                  wp.found
                    ? `${getColorForWord(i)} border-transparent line-through opacity-70`
                    : 'border-border bg-muted'
                )}
              >
                {wp.word}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Click and drag across letters to select words. Words can be horizontal, vertical, or diagonal.
          </p>
        </div>
      </div>

      {/* Level Complete */}
      {isLevelComplete && !completedLevels.includes(currentLevel) && (
        <div className="mt-6 rounded-lg border-2 border-success bg-success/10 p-6 text-center">
          <Trophy className="mx-auto mb-3 h-12 w-12 text-success" />
          <h3 className="mb-2 font-display text-2xl font-bold text-success">All Words Found!</h3>
          <p className="mb-4 text-muted-foreground">Excellent work!</p>
          <div className="flex justify-center gap-3">
            <Button onClick={handleCompleteLevel} className="bg-success hover:bg-success/90">
              Claim {level.points} Bonus Points
            </Button>
            {currentLevel < levels.length - 1 && (
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
