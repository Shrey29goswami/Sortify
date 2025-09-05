import React from 'react';
import { motion } from 'framer-motion';
import { ArrayElement } from '../types';

interface VisualizationAreaProps {
  array: ArrayElement[];
  maxValue: number;
  isDarkMode: boolean;
}

export const VisualizationArea: React.FC<VisualizationAreaProps> = ({
  array,
  maxValue,
  isDarkMode
}) => {
  const getBarColor = (state: ArrayElement['state']) => {
    switch (state) {
      case 'comparing':
        return 'from-yellow-400 to-yellow-500';
      case 'swapping':
        return 'from-red-400 to-red-500';
      case 'sorted':
        return 'from-green-400 to-green-500';
      case 'pivot':
        return 'from-purple-400 to-purple-500';
      default:
        return isDarkMode ? 'from-blue-500 to-blue-600' : 'from-blue-400 to-blue-500';
    }
  };

  const containerHeight = 400;
  const barWidth = Math.max(4, Math.min(20, 800 / array.length));

  return (
    <div className={`rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-gray-700'
        : 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 border border-gray-300'
    }`}>
      <div 
        className="flex items-end justify-center gap-1 overflow-hidden"
        style={{ height: containerHeight }}
      >
        {array.map((element, index) => {
          const height = (element.value / maxValue) * (containerHeight - 20);
          const colorClass = getBarColor(element.state);
          
          return (
            <motion.div
              key={element.id}
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height,
                opacity: 1,
                scale: element.state === 'comparing' || element.state === 'swapping' ? 1.1 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                height: { duration: 0.3 },
                scale: { duration: 0.2 }
              }}
              className={`bg-gradient-to-t ${colorClass} rounded-t-lg relative group cursor-pointer shadow-lg`}
              style={{ 
                width: barWidth,
                minWidth: '4px',
              }}
            >
              {/* Value label on hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-white/90 text-gray-900'
                    : 'bg-black/80 text-white'
                }`}
              >
                {element.value}
              </motion.div>
              
              {/* Glow effect for active states */}
              {(element.state === 'comparing' || element.state === 'swapping' || element.state === 'pivot') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-t ${colorClass} rounded-t-lg blur-sm -z-10`}
                />
              )}
              
              {/* Sparkle effect for sorted elements */}
              {element.state === 'sorted' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-80"
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-blue-400 to-blue-500'
          }`}></div>
          <span className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded"></div>
          <span className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded"></div>
          <span className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded"></div>
          <span className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded"></div>
          <span className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Sorted</span>
        </div>
      </div>
    </div>
  );
};