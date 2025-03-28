const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
/* "http://localhost:5001/api/products"
    Parameters: None
    Function: Returns all products from the database
    Method: GET
*/
router.get('/', productController.getAllProducts);

/* "http://localhost:5001/api/products/:productID"
    Parameters: productID (in URL path)
    Function: Returns a specific product by its ID
    Method: GET
*/
router.get('/:productID', productController.getProductById);

// Protected routes (seller only)
/* "http://localhost:5001/api/products"
    Parameters: {name, description, price,  , stock, imageUrl, etc.} (in request body)
    Function: Creates a new product in the database
    Method: POST
    Authentication: Required (Bearer token)
*/
router.post('/', productController.addProduct); 

/* "http://localhost:5001/api/products/:productID" 
    Parameters: productID (in URL path), {updated product data} (in request body) # accept both partly prodcut data or the entire product data
    Function: Updates all fields of a specific product
    Method: PUT
    Authentication: Required (Bearer token)

    Examples:
1. PUT /api/products/P001
   Body: {"productName": "Updated Name"} #partly: only update price
   Response: {success: true, message: "Product updated", product: {...}}
   
2. PUT /api/products/P002
   Body: {"productPrice": 199.99, "featured": true} #partly: only update price
   Response: {success: true, message: "Product updated", product: {...}}
   
3. PUT /api/products/P003
   Body: {the entire product object}
   Response: {success: true, message: "Product updated", product: {...}}
4. PUT /api/products/P004
   Body: if need update specific image,{productImage:"image file",imageIndex:index numbe from 0 to 2}
   Response: {success: true, message: "Product updated", product: {...}}
*/
router.put('/:productID',  productController.updateProduct);

/* "http://localhost:5001/api/products/:productID/price"
    Parameters: productID (in URL path), {price} (in request body)
    Function: Updates only the price of a specific product
    Method: PATCH
    Authentication: Required (Bearer token)(Removed)
*/
router.patch('/:productID/price', productController.updatePrice);

/* "http://localhost:5001/api/products/:productID/storage"
    Parameters: productID (in URL path), {stock} (in request body)
    Function: Updates only the stock/storage quantity of a specific product
    Method: PATCH
    Authentication: Required (Bearer token)(Removed)
*/
router.patch('/:productID/storage',productController.updateStorage);




/* "http://localhost:5001/api/products/:productID" 
    Parameters: productID (in URL path)
    Function: Deletes a specific product
    Method: DELETE
    Authentication: Required (Bearer token)
    
    Examples:
    1. DELETE /api/products/P001
       Response: {success: true, message: "Product deleted successfully", product: {...}}
*/
router.delete('/:productID',productController.deleteProduct);

module.exports = router;
