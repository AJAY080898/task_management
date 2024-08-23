const mongoose = require('mongoose')

const AuthenticationModel = mongoose.model('Authentication', new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    tokenId: {
        type: mongoose.Types.ObjectId,
        ref: 'Authentication'
    },
    type: {
        type: String,
        enum: ["access-token", "refresh-token"]
    }
}, { timestamps: true }));

module.exports = AuthenticationModel;