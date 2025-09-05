import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Moon, Sun } from 'lucide-react';
import { VisualizationArea } from './VisualizationArea';
import { Controls } from './Controls';
import { StatsPanel } from './StatsPanel';
import { SortingVisualizer as SortingEngine, SORTING_ALGORITHMS } from '../algorithms/sortingAlgorithms';
import { ArrayElement, SortingStep, SortingStats } from '../types';

export const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(50);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stats, setStats] = useState<SortingStats>({
    comparisons: 0,
    swaps: 0,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  });

  const generateArray = useCallback(() => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        id: `element-${i}`,
        value: Math.floor(Math.random() * 300) + 10,
        state: 'default'
      });
    }
    setArray(newArray);
    setCurrentStep(0);
    setSteps([]);
    setStats({
      comparisons: 0,
      swaps: 0,
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)'
    });
  }, [arraySize]);

  const shuffleArray = useCallback(() => {
    if (isPlaying) return;
    
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Reset states
    const resetArray = shuffled.map(element => ({
      ...element,
      state: 'default' as const
    }));
    
    setArray(resetArray);
    setCurrentStep(0);
    setSteps([]);
    setStats({
      comparisons: 0,
      swaps: 0,
      timeComplexity: '',
      spaceComplexity: ''
    });
    
    toast.success('Array shuffled!');
  }, [array, isPlaying]);

  const startSorting = useCallback(() => {
    if (steps.length === 0) {
      const visualizer = new SortingEngine(array);
      let sortingSteps: SortingStep[] = [];

      try {
        switch (selectedAlgorithm) {
          case 'bubble':
            sortingSteps = visualizer.bubbleSort();
            break;
          case 'selection':
            sortingSteps = visualizer.selectionSort();
            break;
          case 'insertion':
            sortingSteps = visualizer.insertionSort();
            break;
          case 'merge':
            sortingSteps = visualizer.mergeSort();
            break;
          case 'quick':
            sortingSteps = visualizer.quickSort();
            break;
          case 'heap':
            sortingSteps = visualizer.heapSort();
            break;
          case 'cocktail':
            sortingSteps = visualizer.cocktailShakerSort();
            break;
          case 'bogo':
            sortingSteps = visualizer.bogoSort();
            break;
          default:
            sortingSteps = visualizer.bubbleSort();
        }
        
        setSteps(sortingSteps);
        toast.success(`Starting ${SORTING_ALGORITHMS.find(a => a.id === selectedAlgorithm)?.name}!`);
        
        // Auto-scroll to visualization area
        setTimeout(() => {
          const visualizationElement = document.getElementById('visualization-area');
          if (visualizationElement) {
            visualizationElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 300);
      } catch (error) {
        toast.error('Error during sorting');
        console.error(error);
      }
    }
    setIsPlaying(true);
  }, [array, selectedAlgorithm, steps.length]);

  const pauseSorting = useCallback(() => {
    setIsPlaying(false);
    toast.success('Sorting paused');
  }, []);

  const resetSorting = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    generateArray();
    toast.success('Array reset!');
  }, [generateArray]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseSorting();
    } else {
      startSorting();
    }
  }, [isPlaying, pauseSorting, startSorting]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleArraySizeChange = useCallback((newSize: number) => {
    if (isPlaying) return;
    setArraySize(newSize);
  }, [isPlaying]);

  const handleAlgorithmChange = useCallback((algorithm: string) => {
    if (isPlaying) return;
    setSelectedAlgorithm(algorithm);
    setCurrentStep(0);
    setSteps([]);
    setStats({
      comparisons: 0,
      swaps: 0,
      timeComplexity: '',
      spaceComplexity: ''
    });
  }, [isPlaying]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
    toast.success(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
  }, [isDarkMode]);
  // Animation loop
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) {
      if (currentStep >= steps.length && steps.length > 0) {
        setIsPlaying(false);
        toast.success('Sorting complete!', {
          icon: '🎉',
          duration: 3000
        });
      }
      return;
    }

    const timer = setTimeout(() => {
      const step = steps[currentStep];
      setArray(step.array);
      setStats(step.stats);
      setCurrentStep(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]);

  // Initialize array on mount
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Update array when size changes
  useEffect(() => {
    if (!isPlaying) {
      generateArray();
    }
  }, [arraySize, generateArray, isPlaying]);

  const maxValue = Math.max(...array.map(element => element.value));
  const selectedAlgorithmData = SORTING_ALGORITHMS.find(algo => algo.id === selectedAlgorithm);

  return (
    <div className={`min-h-screen transition-all duration-500 p-4 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`absolute top-0 right-0 p-3 rounded-full transition-all duration-300 ${
              isDarkMode
                ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
                : 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
            } shadow-lg`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            Sorting Algorithm Visualizer
          </h1>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Watch sorting algorithms come to life with beautiful animations and real-time performance metrics
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Controls
            isPlaying={isPlaying}
            speed={speed}
            arraySize={arraySize}
            selectedAlgorithm={selectedAlgorithm}
            isDarkMode={isDarkMode}
            onPlayPause={handlePlayPause}
            onReset={resetSorting}
            onShuffle={shuffleArray}
            onSpeedChange={handleSpeedChange}
            onArraySizeChange={handleArraySizeChange}
            onAlgorithmChange={handleAlgorithmChange}
            algorithms={SORTING_ALGORITHMS}
          />
        </motion.div>

        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsPanel
            stats={stats}
            isPlaying={isPlaying}
            isDarkMode={isDarkMode}
            algorithmName={selectedAlgorithmData?.name || 'Unknown'}
          />
        </motion.div>

        {/* Visualization Area */}
        <motion.div
          id="visualization-area"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          <VisualizationArea
            array={array}
            maxValue={maxValue}
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </div>
    </div>
  );
};