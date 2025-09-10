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
    const categoryName = (cat.name_c || cat.name || '').toLowerCase();
    acc[categoryName] = cat;
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
    const aCompleted = a.completed_c || a.completed;
    const bCompleted = b.completed_c || b.completed;
    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1;
    }
    
    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = a.priority_c || a.priority;
    const bPriority = b.priority_c || b.priority;
    const priorityDiff = (priorityOrder[bPriority] || 2) - (priorityOrder[aPriority] || 2);
    if (priorityDiff !== 0) return priorityDiff;
    
    // Finally by creation date (newest first)
    const aCreated = a.created_at_c || a.createdAt;
    const bCreated = b.created_at_c || b.createdAt;
    return new Date(bCreated) - new Date(aCreated);
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
              category={categoryLookup[(task.category_c || task.category || '').toLowerCase()]}
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