const mongoose = require('mongoose');

/**
 * Connects to MongoDB database
 * @returns {Promise} MongoDB connection promise
 */
function connectDatabase() {
  /*mongodb+srv://csci3100_d7:csci3100_d7@csci3100d7.3chef.mongodb.net/*/ 
  return mongoose.connect('mongodb://localhost:27017/CSCI3100_D7', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = connectDatabase;
