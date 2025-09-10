import React from "react";
import { motion } from "framer-motion";

const Loading = ({ message = "Loading tasks..." }) => {
  return (
    <div className="space-y-4">
      {/* Loading message */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 bg-primary-500 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-primary-500 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
          />
          <motion.div
            className="w-2 h-2 bg-primary-500 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <span className="text-gray-600 ml-2">{message}</span>
        </div>
      </div>

      {/* Task card skeletons */}
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox skeleton */}
              <div className="w-5 h-5 bg-gray-200 rounded border-2 border-gray-300 mt-1 animate-pulse" />
              
              <div className="flex-1 space-y-2">
                {/* Title skeleton */}
                <div className="h-5 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
                
                {/* Meta info skeleton */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                  </div>
                </div>
                
                {/* Description skeleton */}
                {Math.random() > 0.5 && (
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 30 + 70}%` }} />
                  </div>
                )}
              </div>

              {/* Priority badge skeleton */}
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;