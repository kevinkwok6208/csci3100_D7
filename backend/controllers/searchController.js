const SearchService = require('../services/searchService');

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, category, minRating, sort } = req.query;
    
    // Create options object
    const options = {
      minPrice,
      maxPrice,
      category,
      minRating,
      sort
    };
    
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