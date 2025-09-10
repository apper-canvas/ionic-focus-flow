import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import PrioritySelector from "@/components/molecules/PrioritySelector";
import ApperIcon from "@/components/ApperIcon";
import descriptionService from "@/services/api/descriptionService";

const TaskForm = ({ 
  task,
  categories = [],
  onSubmit, 
  onCancel,
  className 
}) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "personal",
    dueDate: ""
  });
  
  const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

useEffect(() => {
if (task) {
      setFormData({
        title: task.title_c || task.title || "",
        description: task.description_c || task.description || "",
        priority: task.priority_c || task.priority || "medium",
        category: task.category_c || task.category || "personal",
        dueDate: task.due_date_c ? task.due_date_c.split("T")[0] : (task.dueDate ? task.dueDate.split("T")[0] : "")
      });
    }
  }, [task]);

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      const generatedDescription = await descriptionService.generateDescription(formData.title);
      setFormData(prev => ({
        ...prev,
        description: generatedDescription
      }));
    } catch (error) {
      console.error('Failed to generate description:', error);
      // Silently fail - user can still enter description manually
    } finally {
      setIsGenerating(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate + "T23:59:59").toISOString() : null
      };
      
      await onSubmit(submitData);
      
      if (!task) {
        // Reset form for new tasks
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          category: "personal",
          dueDate: ""
        });
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium", 
      category: "personal",
      dueDate: ""
    });
    setErrors({});
    onCancel && onCancel();
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-6 shadow-lg",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon 
          name={task ? "Edit2" : "Plus"} 
          size={20} 
          className="text-primary-600" 
        />
        <h2 className="text-xl font-bold text-gray-900">
          {task ? "Edit Task" : "Create New Task"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Task Title"
          type="text"
          value={formData.title}
          onChange={handleChange("title")}
          placeholder="Enter task title..."
          error={errors.title}
          required
        />

<div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            {formData.title.trim() && !formData.description.trim() && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="text-xs px-2 py-1 h-auto"
              >
                {isGenerating ? (
                  <>
                    <ApperIcon name="Loader2" size={12} className="animate-spin mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Sparkles" size={12} className="mr-1" />
                    Auto-generate
                  </>
                )}
              </Button>
            )}
          </div>
          <FormField
            type="textarea"
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Add task description (optional)..."
            error={errors.description}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Priority Level
            </label>
            <PrioritySelector
              value={formData.priority}
              onChange={handleChange("priority")}
            />
          </div>

          <FormField
            label="Category"
            type="select"
            value={formData.category}
            onChange={handleChange("category")}
          >
{categories.length > 0 ? (
              categories.map(category => (
                <option key={category.Id} value={(category.name_c || category.name || '').toLowerCase()}>
                  {category.name_c || category.name}
                </option>
              ))
            ) : (
              <>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="learning">Learning</option>
              </>
            )}
          </FormField>
        </div>

        <FormField
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={handleChange("dueDate")}
          min={new Date().toISOString().split("T")[0]}
        />

        <div className="flex items-center gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                {task ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name={task ? "Save" : "Plus"} size={16} className="mr-2" />
                {task ? "Update Task" : "Create Task"}
              </>
            )}
          </Button>

          {(task || onCancel) && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;