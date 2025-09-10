import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TaskForm from "@/components/organisms/TaskForm";
import TaskList from "@/components/organisms/TaskList";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskFilters from "@/components/molecules/TaskFilters";
import QuickStats from "@/components/molecules/QuickStats";
import Button from "@/components/atoms/Button";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const TaskManager = () => {
  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");

  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // UI state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Load data on mount
  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  // Update category task counts when tasks change
  useEffect(() => {
    updateCategoryTaskCounts();
  }, [tasks, categories]);

  const loadTasks = async () => {
    setTasksLoading(true);
    setTasksError("");
    
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasksError(error.message || "Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  const loadCategories = async () => {
    setCategoriesLoading(true);
    
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const updateCategoryTaskCounts = async () => {
    for (const category of categories) {
      const categoryTasks = tasks.filter(task => 
        task.category.toLowerCase() === category.name.toLowerCase()
      );
      
      if (categoryTasks.length !== category.taskCount) {
        try {
          await categoryService.updateTaskCount(category.name, categoryTasks.length);
          setCategories(prev => prev.map(cat => 
            cat.Id === category.Id 
              ? { ...cat, taskCount: categoryTasks.length }
              : cat
          ));
        } catch (error) {
          console.error("Error updating category task count:", error);
        }
      }
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowTaskForm(false);
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      throw error;
    }
  };

  const handleEditTask = async (taskData) => {
    if (!editingTask) return;
    
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData);
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ));
      setEditingTask(null);
      setShowTaskForm(false);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      throw error;
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await taskService.toggle(taskId);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      if (updatedTask.completed) {
        toast.success("🎉 Task completed! Great job!");
      } else {
        toast.info("Task marked as pending");
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  const startEditingTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const cancelTaskForm = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (statusFilter === "completed" && !task.completed) return false;
    if (statusFilter === "pending" && task.completed) return false;
    
    // Priority filter
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    
    // Category filter
    if (categoryFilter !== "all" && task.category.toLowerCase() !== categoryFilter) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="CheckSquare" size={24} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Focus Flow
                </h1>
                <p className="text-sm text-gray-600">Stay organized, stay productive</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span className="hidden sm:inline">New Task</span>
              </Button>
              
              {/* Mobile sidebar toggle */}
              <Button
                variant="secondary"
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="lg:hidden p-2.5"
              >
                <ApperIcon name="Menu" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <QuickStats tasks={tasks} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Category Sidebar Overlay */}
          {showMobileSidebar && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
            >
              <motion.div
                className="absolute left-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl p-4"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Filters & Categories</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-2"
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
                
                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                  <TaskFilters
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    categoryFilter={categoryFilter}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setPriorityFilter}
                    onCategoryChange={setCategoryFilter}
                    categories={categories}
                  />
                  
                  <CategorySidebar
                    categories={categories}
                    selectedCategory={categoryFilter}
                    onCategorySelect={setCategoryFilter}
                    onCategoryCreate={handleCreateCategory}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <TaskFilters
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              categoryFilter={categoryFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onCategoryChange={setCategoryFilter}
              categories={categories}
            />
            
            <CategorySidebar
              categories={categories}
              selectedCategory={categoryFilter}
              onCategorySelect={setCategoryFilter}
              onCategoryCreate={handleCreateCategory}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Task Form */}
            {showTaskForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskForm
                  task={editingTask}
                  categories={categories}
                  onSubmit={editingTask ? handleEditTask : handleCreateTask}
                  onCancel={cancelTaskForm}
                />
              </motion.div>
            )}

            {/* Task List Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {statusFilter === "all" && "All Tasks"}
                  {statusFilter === "pending" && "Pending Tasks"}
                  {statusFilter === "completed" && "Completed Tasks"}
                  {categoryFilter !== "all" && ` · ${categories.find(c => c.name.toLowerCase() === categoryFilter)?.name || categoryFilter}`}
                </h2>
                <p className="text-sm text-gray-600">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              categories={categories}
              loading={tasksLoading}
              error={tasksError}
              onToggle={handleToggleTask}
              onEdit={startEditingTask}
              onDelete={handleDeleteTask}
              onRetry={loadTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;