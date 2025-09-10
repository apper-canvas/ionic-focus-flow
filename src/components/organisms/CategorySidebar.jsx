import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const CategorySidebar = ({ 
  categories = [],
  selectedCategory,
  onCategorySelect,
  onCategoryCreate,
  className 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", color: "#2563eb" });

  const predefinedColors = [
    "#2563eb", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
    "#ec4899", // Pink
    "#6b7280"  // Gray
  ];

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    
    try {
      await onCategoryCreate({
        name: newCategory.name,
        color: newCategory.color
      });
      setNewCategory({ name: "", color: "#2563eb" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const CategoryItem = ({ category, isSelected }) => (
    <motion.button
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200",
        isSelected 
          ? "bg-primary-50 border-2 border-primary-200 shadow-sm" 
          : "hover:bg-gray-50 border-2 border-transparent"
      )}
      onClick={() => onCategorySelect(category.name.toLowerCase())}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-4 h-4 rounded-full shadow-sm"
          style={{ backgroundColor: category.color }}
        />
        <div>
          <span className={cn(
            "font-medium",
            isSelected ? "text-primary-700" : "text-gray-700"
          )}>
            {category.name}
          </span>
<p className="text-xs text-gray-500">
            {category.task_count_c || category.taskCount} task{(category.task_count_c || category.taskCount) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ApperIcon name="FolderOpen" size={20} className="text-primary-600" />
          Categories
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2"
        >
          <ApperIcon name={showAddForm ? "X" : "Plus"} size={16} />
        </Button>
      </div>

      {/* All Tasks Option */}
      <motion.button
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg text-left mb-2 transition-all duration-200",
          selectedCategory === "all" 
            ? "bg-primary-50 border-2 border-primary-200 shadow-sm" 
            : "hover:bg-gray-50 border-2 border-transparent"
        )}
        onClick={() => onCategorySelect("all")}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <ApperIcon name="List" size={16} className="text-gray-500" />
        <span className={cn(
          "font-medium",
          selectedCategory === "all" ? "text-primary-700" : "text-gray-700"
        )}>
          All Tasks
        </span>
      </motion.button>

      {/* Add Category Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FormField
              label="Category Name"
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter category name..."
              className="mb-3"
            />
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all duration-200",
                      newCategory.color === color 
                        ? "border-gray-600 scale-110" 
                        : "border-gray-300 hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddCategory}
                disabled={!newCategory.name.trim()}
                className="flex-1"
              >
                <ApperIcon name="Plus" size={14} className="mr-1" />
                Add
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map(category => (
<CategoryItem
            key={category.Id}
            category={category}
            isSelected={selectedCategory === (category.name_c || category.name || '').toLowerCase()}
          />
        ))}
      </div>

      {categories.length === 0 && !showAddForm && (
        <div className="text-center py-6 text-gray-500">
          <ApperIcon name="FolderPlus" size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No categories yet</p>
          <p className="text-xs">Click + to add your first category</p>
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;