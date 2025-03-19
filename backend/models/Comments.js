const mongoose = require('mongoose');

class CommentSchema extends mongoose.Schema {
    constructor() {
        super({
            user: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            productID: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Products'  // Change from 'Location' to 'Venue'
            },
            Rating: {type:Number,
                        default: 0
            },
            content: String,
            timestamp: { 
                type: Date, 
                default: Date.now 
            }
        });
    }
}

module.exports = mongoose.model('Comment', new CommentSchema());