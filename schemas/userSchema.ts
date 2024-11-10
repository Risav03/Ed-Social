import mongoose, { Schema, model, models, trusted } from 'mongoose';

const UserSchema = new Schema<UserType>({

    username: {
        type: String,
        default: "",
        required:true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
      },
      pwd: { 
        type: String, 
        required: true, 
        select: false 
      },
      salt: {
        type: String,
        required: true,
        select: false
      },
    userhandle: {
        type: String,
        unique: true,
        required: true
    },
    profileImage: {
        type: String,
    },
    banner: {
        type: String,
    },
    website:{
        type:String
    },
    bio: {
        type: String,
        default: "Enter a really cool description about you."
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