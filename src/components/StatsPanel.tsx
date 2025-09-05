import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Zap, TrendingUp } from 'lucide-react';
import { SortingStats } from '../types';

interface StatsPanelProps {
  stats: SortingStats;
  isPlaying: boolean;
  isDarkMode: boolean;
  algorithmName: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  isPlaying,
  isDarkMode,
  algorithmName
}) => {
  return (
    <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-xl transition-all duration-300 ${
      isDarkMode
        ? 'bg-gray-800/90 border border-gray-700'
        : 'bg-white/90 border border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <h3 className={`text-lg font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>Performance Metrics</h3>
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full ml-auto"
          />
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700'
              : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>Comparisons</span>
          </div>
          <div className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-blue-200' : 'text-blue-800'
          }`}>
            {stats.comparisons.toLocaleString()}
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700'
              : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-red-600" />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-red-300' : 'text-red-700'
            }`}>Swaps</span>
          </div>
          <div className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-red-200' : 'text-red-800'
          }`}>
            {stats.swaps.toLocaleString()}
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700'
              : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-green-300' : 'text-green-700'
            }`}>Time</span>
          </div>
          <div className={`text-lg font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-green-200' : 'text-green-800'
          }`}>
            {stats.timeComplexity}
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700'
              : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>Space</span>
          </div>
          <div className={`text-lg font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-purple-200' : 'text-purple-800'
          }`}>
            {stats.spaceComplexity}
          </div>
        </motion.div>
      </div>
      
      <div className={`mt-4 p-3 rounded-xl transition-all duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-r from-gray-700 to-gray-600'
          : 'bg-gradient-to-r from-gray-50 to-gray-100'
      }`}>
        <div className={`text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Currently running: <span className={`font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>{algorithmName}</span>
        </div>
      </div>
    </div>
  );
};