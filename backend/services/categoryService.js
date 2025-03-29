// services/categoryService.js
const Category = require('../models/Category');

class CategoryService {
  // Get all categories
  static async getAllCategories() {
    try {
      const categories = await Category.find().sort({ name: 1 });
      return categories;
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }
  
  // Create a new category
  static async createCategory(name, description) {
    try {
      const existingCategory = await Category.findOne({ name });
      
      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }
      
      const newCategory = new Category({
        name,
        description
      });
      
      await newCategory.save();
      return newCategory;
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }
  
  // Update a category
  static async updateCategory(categoryId, name, description) {
    try {
      const category = await Category.findById(categoryId);
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      // Check if name is being changed and if it already exists
      if (name !== category.name) {
        const existingCategory = await Category.findOne({ name });
        
        if (existingCategory) {
          throw new Error('Category with this name already exists');
        }
      }
      
      category.name = name;
      category.description = description;
      
      await category.save();
      return category;
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }
  
  // Delete a category
  static async deleteCategory(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      await Category.findByIdAndDelete(categoryId);
      
      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }
}

module.exports = CategoryService;