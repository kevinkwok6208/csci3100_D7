const Category = require('../models/Category');
const Product = require('../models/Products');

class CategoryController {
  // Create a new category
  async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
      }
      
      // Check if category already exists
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category already exists'
        });
      }
      
      // Create new category
      const category = await Category.create({
        name,
        description
      });
      
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message
      });
    }
  }
  
  // Get all categories
  async getAllCategories(req, res) {
    try {
      const categories = await Category.find().sort({ name: 1 });
      
      res.status(200).json({
        success: true,
        count: categories.length,
        categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  }
  
  // Get products by category name
  async getProductsByCategory(req, res) {
    try {
      const { categoryName } = req.params;
      
      // Find category by name (case insensitive)
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
      });
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      // Find products with this category
      const products = await Product.find({ category: category._id })
        .populate('category', 'name description');
      
      res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products by category',
        error: error.message
      });
    }
  }
}

module.exports = new CategoryController();