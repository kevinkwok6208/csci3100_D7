// src/services/reviewService.js

const reviewService = {
    // Get all reviews for a specific product
    getProductReviews: async (productID) => {
        const response = await fetch(`/api/reviews/products/${productID}`, {
            credentials: 'include', // Include credentials for cookie-based authentication
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get product reviews');
        }

        return response.json(); // Return the reviews data
    },

    // Add a review for a specific product
    addProductReview: async (productID, reviewData) => {
        const response = await fetch(`/api/reviews/products/${productID}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData), // Send review data in the body
            credentials: 'include', // Include credentials for cookie-based authentication
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add product review');
        }

        return response.json(); // Return the added review data
    },

    // Update a specific review
    updateReview: async (reviewId, reviewData) => {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData), // Send updated review data in the body
            credentials: 'include', // Include credentials for cookie-based authentication
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update review');
        }

        return response.json(); // Return the updated review data
    },

    // Delete a specific review
    deleteReview: async (reviewId) => {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            credentials: 'include', // Include credentials for cookie-based authentication
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete review');
        }

        return response.json(); // Return confirmation of deletion
    },
};

export default reviewService;