// controllers/searchController.js
const SearchService = require('../services/searchService');

// Search products
exports.searchProducts = async (req, res) => {
  try {
    console.log('Raw query parameters:', req.query);
    
    const keyword = req.query.q || req.query.keyword || '';
    
    // Create options object, ensuring we don't pass empty strings
    const options = {
      minPrice: req.query.minPrice || undefined,
      maxPrice: req.query.maxPrice || undefined,
      category: req.query.category || undefined,  // This is the key fix
      minRating: req.query.minRating || undefined,
      sort: req.query.sort || undefined
    };
    
    console.log('Processed options:', options);
    
    const result = await SearchService.searchProducts(keyword, options);
    
    // Check if search was fast enough (requirement F3.3)
    const isFastEnough = result.executionTime < 2000; // less than 2 seconds
    
    res.status(200).json({
      success: true,
      count: result.count,
      executionTime: `${result.executionTime}ms`,
      performanceRequirementMet: isFastEnough,
      products: result.products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await SearchService.getAllCategories();
    
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
};