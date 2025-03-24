const Product = require('../models/Products');
const Comment = require('../models/Comments');

class SearchService {
  // Search products by keyword
  static async searchProducts(keyword, options = {}) {
    try {
      const startTime = Date.now();
      
      let query = {};
      
      // Add text search if keyword is provided
      if (keyword && keyword.trim() !== '') {
        // Since we're not modifying the Products schema to add text index,
        // we'll use regex search on productName and productDescription
        const searchRegex = new RegExp(keyword, 'i');
        query.$or = [
          { productName: searchRegex },
          { productDescription: searchRegex }
        ];
      }
      
      // Add price range filter if provided
      if (options.minPrice !== undefined || options.maxPrice !== undefined) {
        query.productPrice = {};
        
        if (options.minPrice !== undefined) {
          query.productPrice.$gte = parseFloat(options.minPrice);
        }
        
        if (options.maxPrice !== undefined) {
          query.productPrice.$lte = parseFloat(options.maxPrice);
        }
      }
      
      // Create base query
      let productsQuery = Product.find(query);
      
      // Add sorting if provided
      if (options.sort) {
        const sortField = options.sort.toLowerCase();
        
        if (sortField === 'price_asc') {
          productsQuery = productsQuery.sort({ productPrice: 1 });
        } else if (sortField === 'price_desc') {
          productsQuery = productsQuery.sort({ productPrice: -1 });
        } else if (sortField === 'popularity') {
          // For popularity, we'll use the productReservation field as a proxy
          // since we can't modify the Products schema
          productsQuery = productsQuery.sort({ productReservation: -1 });
        }
      }
      
      // Execute query
      const products = await productsQuery.exec();
      
      // If rating filter is provided, we need to fetch ratings for each product
      if (options.minRating !== undefined) {
        const minRating = parseFloat(options.minRating);
        
        // Get product IDs
        const productIds = products.map(product => product._id);
        
        // Get average ratings for these products
        const productRatings = await Comment.aggregate([
          { $match: { productID: { $in: productIds } } },
          { $group: { _id: '$productID', avgRating: { $avg: '$Rating' } } }
        ]);
        
        // Create a map of product ID to average rating
        const ratingMap = {};
        productRatings.forEach(item => {
          ratingMap[item._id.toString()] = item.avgRating;
        });
        
        // Filter products by minimum rating
        const filteredProducts = products.filter(product => {
          const productId = product._id.toString();
          const avgRating = ratingMap[productId] || 0;
          return avgRating >= minRating;
        });
        
        // Sort by rating if requested
        if (options.sort === 'rating') {
          filteredProducts.sort((a, b) => {
            const ratingA = ratingMap[a._id.toString()] || 0;
            const ratingB = ratingMap[b._id.toString()] || 0;
            return ratingB - ratingA;
          });
        }
        
        const endTime = Date.now();
        return {
          products: filteredProducts,
          count: filteredProducts.length,
          executionTime: endTime - startTime
        };
      }
      
      // If sorting by rating is requested but no rating filter
      if (options.sort === 'rating') {
        // Get product IDs
        const productIds = products.map(product => product._id);
        
        // Get average ratings for these products
        const productRatings = await Comment.aggregate([
          { $match: { productID: { $in: productIds } } },
          { $group: { _id: '$productID', avgRating: { $avg: '$Rating' } } }
        ]);
        
        // Create a map of product ID to average rating
        const ratingMap = {};
        productRatings.forEach(item => {
          ratingMap[item._id.toString()] = item.avgRating;
        });
        
        // Sort products by rating
        products.sort((a, b) => {
          const ratingA = ratingMap[a._id.toString()] || 0;
          const ratingB = ratingMap[b._id.toString()] || 0;
          return ratingB - ratingA;
        });
      }
      
      const endTime = Date.now();
      return {
        products,
        count: products.length,
        executionTime: endTime - startTime
      };
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }
}

module.exports = SearchService;