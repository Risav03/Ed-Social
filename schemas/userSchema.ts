import mongoose, { Schema, model, models, trusted } from 'mongoose';

const UserSchema = new Schema<UserType>({

    username: {
        type: String,
        default: "",
    },
    userhandle: {
        type: String,
        unique: true,
        required: true
    },
    pwd: {
        type: String,
        default: "",
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
    twitter: {
        type: String,
    },
    instagram: {
        type: String,
    },
    youtube: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    facebook: {
        type: String,
    },
    website: {
        type: String,
    },
    email: {
        type: String,
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