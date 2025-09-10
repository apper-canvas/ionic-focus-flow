// Local storage utility functions for Focus Flow

const TASKS_KEY = "focus-flow-tasks";
const CATEGORIES_KEY = "focus-flow-categories";

export const storage = {
  // Tasks
  getTasks: () => {
    try {
      const tasks = localStorage.getItem(TASKS_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  },

  saveTasks: (tasks) => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error("Error saving tasks:", error);
      return false;
    }
  },

  // Categories
  getCategories: () => {
    try {
      const categories = localStorage.getItem(CATEGORIES_KEY);
      return categories ? JSON.parse(categories) : [];
    } catch (error) {
      console.error("Error loading categories:", error);
      return [];
    }
  },

  saveCategories: (categories) => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      return true;
    } catch (error) {
      console.error("Error saving categories:", error);
      return false;
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing data:", error);
      return false;
    }
  }
};