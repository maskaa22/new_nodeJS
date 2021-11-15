const { Schema, model } = require('mongoose');

const { userRolesEnumConfig } = require('../config');
const passwordServise = require('../servises/password-servise');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // select: false
    },
    age: {
        type: Number
    },
    role: {
        type: String,
        default: userRolesEnumConfig.USER,
        enum: Object.values(userRolesEnumConfig)
    },
    is_active: {
        type: Boolean,
        default: false,
        required: true
    }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

userSchema.virtual('fullName').get(function() {
    return `${this.name} ${this.role} HA-HA`;
});

userSchema.methods = {
    comparePasswords(password) {
        return passwordServise.compare(password, this.password);
    }
};

userSchema.statics = {
    async createUserWithHashPassword(userObject) {
        const hashedPassword = await passwordServise.hash(userObject.password);

        return this.create({ ...userObject, password: hashedPassword });
    }
};

module.exports = model('user', userSchema);
