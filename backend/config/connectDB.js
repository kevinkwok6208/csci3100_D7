const mongoose = require('mongoose');

/**
 * Connects to MongoDB database
 * @returns {Promise} MongoDB connection promise
 */
function connectDatabase() {
  return mongoose.connect('mongodb+srv://kevinkwok6208:bb157842@kevinkwok6208.k6pso.mongodb.net//CS3100_D7', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = connectDatabase;
