import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStartedMoving, setHasStartedMoving] = useState(false);
  const lastUpdate = useRef(0);
  const nextDirection = useRef(INITIAL_DIRECTION);
  const snakeRef = useRef(INITIAL_SNAKE);
  const foodRef = useRef({ x: 5, y: 5 });

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    let attempts = 0;
    while (attempts < 100) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(s => s.x === newFood.x && s.y === newFood.y);
      if (!onSnake) return newFood;
      attempts++;
    }
    return { x: 0, y: 0 }; 
  }, []);

  const resetGame = () => {
    const newFood = generateFood(INITIAL_SNAKE);
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;
    setDirection(INITIAL_DIRECTION);
    nextDirection.current = INITIAL_DIRECTION;
    setFood(newFood);
    foodRef.current = newFood;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStartedMoving(false);
    lastUpdate.current = performance.now();
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      
      if (!isPaused && !isGameOver) {
        setHasStartedMoving(true);
      }

      const dir = nextDirection.current;
      switch (e.key) {
        case 'ArrowUp':
          if (dir.y !== 1) nextDirection.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (dir.y !== -1) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (dir.x !== 1) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (dir.x !== -1) nextDirection.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver || !hasStartedMoving) return;

    const gameLoop = (time: number) => {
      const deltaTime = time - lastUpdate.current;
      const speed = Math.max(80, 180 - Math.floor(score / 50) * 10);
      
      if (deltaTime > speed) {
        lastUpdate.current = time;
        const currentDir = nextDirection.current;
        setDirection(currentDir);
        
        const currentSnake = snakeRef.current;
        const currentFood = foodRef.current;
        const head = currentSnake[0];
        
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return;
        }

        if (currentSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setIsGameOver(true);
          return;
        }

        const newSnake = [newHead, ...currentSnake];

        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
          setScore(s => s + 10);
          const nextFood = generateFood(newSnake);
          setFood(nextFood);
          foodRef.current = nextFood;
        } else {
          newSnake.pop();
        }

        setSnake(newSnake);
        snakeRef.current = newSnake;
      }
      requestAnimationFrame(gameLoop);
    };

    const requestId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestId);
  }, [isPaused, isGameOver, hasStartedMoving, generateFood, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#ff00ff' : '#00ffff';
      ctx.shadowBlur = i === 0 ? 15 : 5;
      ctx.shadowColor = i === 0 ? '#ff00ff' : '#00ffff';
      ctx.fillRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2);
    });

    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // RHYTHMIC_GLITCH_ARTIFACTS
    if (Math.random() > 0.98) {
      const y = Math.random() * canvas.height;
      const h = 2 + Math.random() * 8;
      const shift = (Math.random() - 0.5) * 15;
      const slice = ctx.getImageData(0, y, canvas.width, h);
      ctx.putImageData(slice, shift, y);
      
      if (Math.random() > 0.6) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ff00ff11' : '#00ffff11';
        ctx.fillRect(0, y, canvas.width, h);
      }
    }
  }, [snake, food]);

  return (
    <div className="relative border-4 border-[#00ffff] bg-black p-4 shadow-[0_0_30px_rgba(0,255,255,0.15)] glitch-flicker">
      <div className="absolute -top-12 left-0 flex gap-10 font-mono text-sm tracking-tighter">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.4em] opacity-40">Core_Chain</span>
          <span className="text-[#ff00ff] font-black glitch-text" data-text={score}>{score}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.4em] opacity-40">Peak_State</span>
          <span className="text-[#00ffff] font-black">{highScore}</span>
        </div>
      </div>

      <div className="canvas-glitch">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block cursor-none grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>

      <AnimatePresence>
        {(isGameOver || isPaused) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8"
          >
            <div className="text-center space-y-8 w-full max-w-sm border-2 border-[#ff00ff] p-8 bg-black">
              <div className="space-y-4">
                <h2 className={`text-5xl font-mono font-black italic uppercase tracking-tighter ${isGameOver ? 'text-[#ff00ff]' : 'text-[#00ffff]'} glitch-text`}
                    data-text={isGameOver ? "CORE_FAILURE" : "IDLE_STATE"}>
                  {isGameOver ? "CORE_FAILURE" : "IDLE_STATE"}
                </h2>
                <div className="h-1 bg-current opacity-20 w-full" />
              </div>

              <div className="pt-4">
                <button
                  onClick={isGameOver ? resetGame : () => {
                    setIsPaused(false);
                    setHasStartedMoving(false);
                    lastUpdate.current = performance.now();
                  }}
                  className={`w-full group relative px-6 py-4 bg-transparent border-2 font-mono text-xs uppercase tracking-[0.3em] font-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] ${isGameOver ? 'border-[#ff00ff] text-[#ff00ff]' : 'border-[#00ffff] text-[#00ffff]'}`}
                >
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    {isGameOver ? <RefreshCw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    <span>{isGameOver ? "REBOOT_SYSTEM" : "INITIALIZE_NEXUS"}</span>
                  </div>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${isGameOver ? 'shadow-[4px_4px_0_#ff00ff]' : 'shadow-[4px_4px_0_#00ffff]'}`} />
                </button>
                
                {!isGameOver && (
                  <p className="mt-4 text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] animate-pulse">
                    Awaiting_Directional_Input...
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
