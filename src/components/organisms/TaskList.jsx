import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const TaskList = ({ 
  tasks = [],
  categories = [],
  loading = false,
  error = null,
  onToggle,
  onEdit,
  onDelete,
  onRetry,
  className 
}) => {
  // Create category lookup for quick access
  const categoryLookup = categories.reduce((acc, cat) => {
    acc[cat.name.toLowerCase()] = cat;
    return acc;
  }, {});

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (tasks.length === 0) {
    return <Empty />;
  }

  // Sort tasks: incomplete first, then by priority (high -> low), then by creation date
  const sortedTasks = [...tasks].sort((a, b) => {
    // First, sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
    if (priorityDiff !== 0) return priorityDiff;
    
    // Finally by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className={cn("space-y-3", className)}>
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            layout
          >
            <TaskCard
              task={task}
              category={categoryLookup[task.category]}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;