const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/**
 * Mongoose Schema for User Collection
 * Enabling timeStamp to capture create and update on document
 * @author: Vijay Pratap Singh
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pictures: [{
        type: Schema.Types.ObjectId,
        ref: 'Pictures'
    }]
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);