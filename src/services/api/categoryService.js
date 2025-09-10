import categoriesData from "@/services/mockData/categories.json";
import { storage } from "@/utils/storage";

// Initialize with mock data if localStorage is empty
const initializeCategories = () => {
  const existingCategories = storage.getCategories();
  if (existingCategories.length === 0) {
    storage.saveCategories(categoriesData);
    return categoriesData;
  }
  return existingCategories;
};

const categoryService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return initializeCategories();
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const categories = storage.getCategories();
    const category = categories.find(cat => cat.Id === parseInt(id));
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return { ...category };
  },

  create: async (categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const categories = storage.getCategories();
    const maxId = categories.reduce((max, cat) => Math.max(max, cat.Id), 0);
    
    const newCategory = {
      Id: maxId + 1,
      name: categoryData.name,
      color: categoryData.color || "#64748b",
      taskCount: 0,
      ...categoryData
    };
    
    const updatedCategories = [...categories, newCategory];
    storage.saveCategories(updatedCategories);
    return { ...newCategory };
  },

  update: async (id, categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const categories = storage.getCategories();
    const categoryIndex = categories.findIndex(cat => cat.Id === parseInt(id));
    
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...categoryData,
      Id: parseInt(id)
    };
    
    categories[categoryIndex] = updatedCategory;
    storage.saveCategories(categories);
    return { ...updatedCategory };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const categories = storage.getCategories();
    const categoryIndex = categories.findIndex(cat => cat.Id === parseInt(id));
    
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    
    const updatedCategories = categories.filter(cat => cat.Id !== parseInt(id));
    storage.saveCategories(updatedCategories);
    return true;
  },

  updateTaskCount: async (categoryName, count) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const categories = storage.getCategories();
    const categoryIndex = categories.findIndex(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (categoryIndex !== -1) {
      categories[categoryIndex].taskCount = count;
      storage.saveCategories(categories);
    }
  }
};

export default categoryService;