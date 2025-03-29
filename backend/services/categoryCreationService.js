const Category = require('../models/Category');

class CategoryCreationService {
  // Default categories
  static defaultCategories = [
    { name: 'Electronics', description: 'Electronic devices and gadgets' },
    { name: 'Clothing', description: 'Apparel and fashion items' },
    { name: 'Home & Kitchen', description: 'Items for home and kitchen use' },
    { name: 'Books', description: 'Books, e-books, and publications' },
    { name: 'Toys & Games', description: 'Toys, games, and entertainment items' }
  ];

  // Create default categories
  static async createDefaultCategories() {
    try {
      // Create categories if they don't exist
      for (const cat of this.defaultCategories) {
        const existingCategory = await Category.findOne({ name: cat.name });
        
        if (!existingCategory) {
          await Category.create(cat);
          console.log(`Created category: ${cat.name}`);
        } else {
          console.log(`Category already exists: ${cat.name}`);
        }
      }
      
      const categories = await Category.find();
      console.log(`Found ${categories.length} categories in total`);
      
      return { success: true, count: categories.length, categories };
    } catch (error) {
      console.error('Failed to create categories:', error);
      throw new Error(`Error creating categories: ${error.message}`);
    }
  }

  // Get all categories
  static async getAllCategories() {
    try {
      const categories = await Category.find().sort({ name: 1 });
      return categories;
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }
}

module.exports = CategoryCreationService;