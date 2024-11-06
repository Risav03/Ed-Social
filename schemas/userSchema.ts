import mongoose, { Schema, model, models, trusted } from 'mongoose';

const UserSchema = new Schema<UserType>({

    username: {
        type: String,
        default: "",
        required:true
    },
    userhandle: {
        type: String,
        unique: true,
        required: true
    },
    pwd: {
        type: String,
        default: "",
        required:true
    },
    profileImage: {
        type: String,
    },
    banner: {
        type: String,
    },
    bio: {
        type: String,
        default: ""
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    searchHistory: {
        type: [String],
        default: null
    },
    role: {
        type: String,
        default: "USER"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

}, { collection: "users" })


UserSchema.index({ username: 'text', email: 'text' });

const User = models.User || model('User', UserSchema);

export default User