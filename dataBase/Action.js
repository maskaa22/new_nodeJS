const { Schema, model } = require('mongoose');

const { tokenTypeEnum } = require('../config');

const actionSchema = new Schema({
    token: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(tokenTypeEnum)
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

actionSchema.pre('findOne', function() {
    this.populate('user_id');
});

module.exports = model('action', actionSchema);
