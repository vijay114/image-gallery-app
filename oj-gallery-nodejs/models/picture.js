const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose schema for Picture model
 * Enabling timeStamp to capture create and update on any picture document
 * @author: Vijay Pratap Singh
 */
const pictureSchema = new Schema({
    thumbnailImageUrl: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Picture', pictureSchema);