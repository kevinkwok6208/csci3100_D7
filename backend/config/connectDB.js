const mongoose = require('mongoose');

/**
 * Connects to MongoDB database
 * @returns {Promise} MongoDB connection promise
 */
function connectDatabase() {
  return mongoose.connect('mongodb://localhost:27017/CS3100D7', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = connectDatabase;
