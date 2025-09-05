import React from 'react';
import { Play, Pause, RotateCcw, Shuffle, Settings, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlsProps {
  isPlaying: boolean;
  speed: number;
  arraySize: number;
  selectedAlgorithm: string;
  isDarkMode: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onShuffle: () => void;
  onSpeedChange: (speed: number) => void;
  onArraySizeChange: (size: number) => void;
  onAlgorithmChange: (algorithm: string) => void;
  algorithms: Array<{
    id: string;
    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    category: string;
  }>;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  speed,
  arraySize,
  selectedAlgorithm,
  isDarkMode,
  onPlayPause,
  onReset,
  onShuffle,
  onSpeedChange,
  onArraySizeChange,
  onAlgorithmChange,
  algorithms
}) => {
  const selectedAlgo = algorithms.find(algo => algo.id === selectedAlgorithm);
  
  const categoryColors = {
    elementary: 'from-blue-500 to-blue-600',
    'divide-conquer': 'from-purple-500 to-purple-600',
    linear: 'from-green-500 to-green-600',
    variants: 'from-orange-500 to-orange-600',
    exotic: 'from-pink-500 to-pink-600'
  };

  return (
    <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-xl transition-all duration-300 ${
      isDarkMode
        ? 'bg-gray-800/90 border border-gray-700'
        : 'bg-white/90 border border-gray-200'
    }`}>
      {/* Algorithm Selection */}
      <div className="mb-6">
        <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <Settings className="inline w-4 h-4 mr-2" />
          Sorting Algorithm
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {algorithms.map((algorithm) => {
            const isSelected = selectedAlgorithm === algorithm.id;
            const gradientClass = categoryColors[algorithm.category as keyof typeof categoryColors];
            
            return (
              <motion.button
                key={algorithm.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAlgorithmChange(algorithm.id)}
                className={`relative p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="relative z-10">
                  <div className="font-semibold">{algorithm.name}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {algorithm.timeComplexity}
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="selectedAlgorithm"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Algorithm Info */}
        {selectedAlgo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl border-l-4 border-blue-500 transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-r from-gray-700 to-gray-600'
                : 'bg-gradient-to-r from-gray-50 to-gray-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className={`font-semibold mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>{selectedAlgo.name}</h4>
                <p className={`text-sm mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{selectedAlgo.description}</p>
                <div className="flex gap-4 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Time: {selectedAlgo.timeComplexity}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Space: {selectedAlgo.spaceComplexity}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayPause}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : 'Start'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-all shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShuffle}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-lg"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </motion.button>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Array Size: {arraySize}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider transition-all duration-300 ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Speed: {speed}ms
          </label>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider transition-all duration-300 ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          />
        </div>
      </div>
    </div>
  );
};